const usuarioOrdenes = JSON.parse(localStorage.getItem("usuario"));
if (!usuarioOrdenes) window.location.href = "/";

let ordenes = [];
let clientesOrdenes = [];
let instalacionesOrdenes = [];
let tecnicosOrdenes = [];

window.addEventListener("DOMContentLoaded", async () => {
    document.getElementById("usuarioActual").textContent = `${usuarioOrdenes.nombreUsuario} - ${usuarioOrdenes.nombreRol ?? ""}`;
    await cargarCatalogosOrden();
    await cargarOrdenes();
    const idCliente = new URLSearchParams(location.search).get("cliente");
    if (idCliente) abrirNuevaOrden(Number(idCliente));
});

async function cargarCatalogosOrden() {
    const respuestas = await Promise.all([fetch("/clientes"), fetch("/instalaciones"), fetch("/tecnicos")]);
    if (respuestas.some(r => !r.ok)) throw new Error("No fue posible cargar catálogos");
    [clientesOrdenes, instalacionesOrdenes, tecnicosOrdenes] = await Promise.all(respuestas.map(r => r.json()));
}

async function cargarOrdenes() {
    const contenedor = document.getElementById("tablaOrdenes");
    contenedor.innerHTML = "<p>Cargando órdenes...</p>";
    try {
        const r = await fetch("/ordenes-servicio");
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        ordenes = await r.json();
        mostrarOrdenes(ordenes);
    } catch (e) {
        console.error(e);
        contenedor.innerHTML = "<p class='mensaje-error'>No fue posible cargar las órdenes.</p>";
    }
}

function mostrarOrdenes(lista) {
    const mapaClientes = new Map(clientesOrdenes.map(c => [Number(c.idCliente), c]));
    const mapaTecnicos = new Map(tecnicosOrdenes.map(t => [Number(t.idTecnico), t]));
    const contenedor = document.getElementById("tablaOrdenes");
    document.getElementById("resultadoOrdenes").textContent = `${lista.length} orden(es) encontrada(s).`;
    if (!lista.length) { contenedor.innerHTML = "<p>No hay órdenes para mostrar.</p>"; return; }
    let html = `<div class="tabla-contenedor"><table class="tabla-principal"><thead><tr>
        <th>Orden</th><th>Identificación</th><th>Cliente</th><th>Tipo</th><th>Motivo</th><th>Prioridad</th><th>Estado</th><th>Técnico</th><th>Acciones</th>
        </tr></thead><tbody>`;
    [...lista].sort((a,b)=>Number(b.idOrden)-Number(a.idOrden)).forEach(o => {
        const c = mapaClientes.get(Number(o.idCliente));
        const t = mapaTecnicos.get(Number(o.idTecnicoAsignado));
        html += `<tr>
            <td>${esc(o.numeroOrden)}</td>
            <td>${esc(c?.numeroDocumento ?? "—")}</td>
            <td>${esc(nombre(c))}</td>
            <td>${esc(o.tipoServicio)}</td>
            <td>${esc(o.descripcionProblema)}</td>
            <td>${esc(o.prioridad)}</td>
            <td>${esc(o.estado)}</td>
            <td>${esc(nombre(t))}</td>
            <td><div class="acciones-toolbar">
                <button onclick="editarOrden(${o.idOrden})">Editar</button>
                ${o.estado !== "CERRADA" ? `<button class="boton-exito" onclick="crearAsistenciaDesdeOrden(${o.idOrden})">Crear asistencia</button>` : `<button onclick="verAsistenciasCliente(${o.idCliente})">Ver historial</button>`}
                <button class="boton-peligro" onclick="eliminarOrden(${o.idOrden})">Eliminar</button>
            </div></td>
        </tr>`;
    });
    html += "</tbody></table></div>";
    contenedor.innerHTML = html;
}

function filtrarOrdenes() {
    const q = document.getElementById("buscarOrden").value.trim().toLowerCase();
    if (!q) return mostrarOrdenes(ordenes);
    const mapaClientes = new Map(clientesOrdenes.map(c => [Number(c.idCliente), c]));
    mostrarOrdenes(ordenes.filter(o => {
        const c = mapaClientes.get(Number(o.idCliente));
        return [o.numeroOrden, c?.numeroDocumento, nombre(c)].some(v => String(v ?? "").toLowerCase().includes(q));
    }));
}

function llenarClientes(idSeleccionado) {
    const select = document.getElementById("idCliente");
    select.innerHTML = `<option value="">Seleccione</option>` + clientesOrdenes
        .filter(c => c.estado !== false)
        .map(c => `<option value="${c.idCliente}">${esc(c.numeroDocumento ?? "Sin documento")} - ${esc(nombre(c))}</option>`).join("");
    if (idSeleccionado) select.value = String(idSeleccionado);
    actualizarInstalacionesCliente();
}

function llenarTecnicos(idSeleccionado) {
    const select = document.getElementById("idTecnicoAsignado");
    select.innerHTML = `<option value="">Sin asignar</option>` + tecnicosOrdenes
        .filter(t => t.estado !== false)
        .map(t => `<option value="${t.idTecnico}">${esc(nombre(t))}</option>`).join("");
    if (idSeleccionado) select.value = String(idSeleccionado);
}

function actualizarInstalacionesCliente(idSeleccionado) {
    const idCliente = Number(document.getElementById("idCliente").value);
    const select = document.getElementById("idInstalacion");
    const lista = instalacionesOrdenes.filter(i => Number(i.idCliente) === idCliente);
    select.innerHTML = `<option value="">Sin instalación</option>` + lista.map(i =>
        `<option value="${i.idInstalacion}">${esc(i.direccionInstalacion)} - ${esc(i.estado)}</option>`).join("");
    if (idSeleccionado) select.value = String(idSeleccionado);
}

function abrirNuevaOrden(idClientePreseleccionado = null) {
    document.getElementById("tituloOrden").textContent = "Nueva orden de servicio";
    document.getElementById("idOrden").value = "";
    document.getElementById("numeroOrden").value = generarNumeroOrden();
    document.getElementById("tipoServicio").value = "";
    document.getElementById("descripcionProblema").value = "";
    document.getElementById("prioridad").value = "MEDIA";
    document.getElementById("estadoOrden").value = "PENDIENTE";
    document.getElementById("fechaProgramada").value = "";
    document.getElementById("observacionesCierre").value = "";
    document.getElementById("mensajeOrden").textContent = "";
    llenarClientes(idClientePreseleccionado);
    llenarTecnicos();
    document.getElementById("modalOrden").style.display = "flex";
}

function editarOrden(id) {
    const o = ordenes.find(x => Number(x.idOrden) === Number(id));
    if (!o) return;
    document.getElementById("tituloOrden").textContent = "Editar orden de servicio";
    document.getElementById("idOrden").value = o.idOrden;
    document.getElementById("numeroOrden").value = o.numeroOrden ?? "";
    document.getElementById("tipoServicio").value = o.tipoServicio ?? "";
    document.getElementById("descripcionProblema").value = o.descripcionProblema ?? "";
    document.getElementById("prioridad").value = o.prioridad ?? "MEDIA";
    document.getElementById("estadoOrden").value = o.estado ?? "PENDIENTE";
    document.getElementById("fechaProgramada").value = normalizarDateTimeLocal(o.fechaProgramada);
    document.getElementById("observacionesCierre").value = o.observacionesCierre ?? "";
    document.getElementById("mensajeOrden").textContent = "";
    llenarClientes(o.idCliente);
    actualizarInstalacionesCliente(o.idInstalacion);
    llenarTecnicos(o.idTecnicoAsignado);
    document.getElementById("modalOrden").style.display = "flex";
}

async function guardarOrden() {
    const id = document.getElementById("idOrden").value;
    const numeroOrden = document.getElementById("numeroOrden").value.trim();
    const idCliente = Number(document.getElementById("idCliente").value);
    const tipoServicio = document.getElementById("tipoServicio").value.trim();
    const descripcionProblema = document.getElementById("descripcionProblema").value.trim();
    const mensaje = document.getElementById("mensajeOrden");
    if (!numeroOrden || !idCliente || !tipoServicio || !descripcionProblema) {
        mensaje.className = "mensaje-error";
        mensaje.textContent = "Complete número de orden, cliente, tipo de servicio y motivo.";
        return;
    }
    const anterior = id ? ordenes.find(o => Number(o.idOrden) === Number(id)) : null;
    const payload = {
        numeroOrden,
        idCliente,
        idInstalacion: valorNumeroOpcional("idInstalacion"),
        idTecnicoAsignado: valorNumeroOpcional("idTecnicoAsignado"),
        tipoServicio,
        descripcionProblema,
        prioridad: document.getElementById("prioridad").value,
        estado: document.getElementById("estadoOrden").value,
        fechaAsignacion: anterior?.fechaAsignacion ?? null,
        fechaProgramada: valorFechaOpcional("fechaProgramada"),
        fechaCierre: anterior?.fechaCierre ?? null,
        observacionesCierre: document.getElementById("observacionesCierre").value.trim() || null
    };
    try {
        const r = await fetch(id ? `/ordenes-servicio/${id}` : "/ordenes-servicio", {
            method: id ? "PUT" : "POST",
            headers: {"Content-Type":"application/json"}, body: JSON.stringify(payload)
        });
        if (!r.ok) throw new Error(await r.text());
        mensaje.className = "mensaje-exito";
        mensaje.textContent = id ? "Orden actualizada correctamente." : "Orden creada correctamente.";
        await cargarOrdenes();
        setTimeout(cerrarModalOrden, 500);
    } catch (e) {
        console.error(e); mensaje.className = "mensaje-error";
        mensaje.textContent = "No fue posible guardar. Verifique que el número de orden no esté repetido.";
    }
}

async function eliminarOrden(id) {
    if (!confirm("¿Desea eliminar esta orden?")) return;
    const r = await fetch(`/ordenes-servicio/${id}`, {method:"DELETE"});
    if (r.ok) return cargarOrdenes();
    alert("No fue posible eliminar la orden. Puede tener registros relacionados.");
}
function crearAsistenciaDesdeOrden(id) { location.href = `asistencias.html?orden=${id}`; }
function verAsistenciasCliente(idCliente) { const c=clientesOrdenes.find(x=>Number(x.idCliente)===Number(idCliente)); location.href=`asistencias.html?documento=${encodeURIComponent(c?.numeroDocumento ?? "")}`; }
function generarNumeroOrden(){ const y=new Date().getFullYear(); const pref=`OS-${y}-`; const nums=ordenes.map(o=>String(o.numeroOrden??"")).filter(n=>n.startsWith(pref)).map(n=>Number(n.slice(pref.length))).filter(Number.isFinite); return `${pref}${String((nums.length?Math.max(...nums):0)+1).padStart(3,"0")}`; }
function cerrarModalOrden() { document.getElementById("modalOrden").style.display = "none"; }
function valorNumeroOpcional(id) { const v = document.getElementById(id).value; return v ? Number(v) : null; }
function valorFechaOpcional(id) { const v = document.getElementById(id).value; return v || null; }
function normalizarDateTimeLocal(v) { return v ? String(v).slice(0,16) : ""; }
function nombre(x) { return x ? [x.nombres, x.apellidos].filter(Boolean).join(" ") || "—" : "—"; }
function esc(v) { return String(v ?? "—").replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;").replaceAll("'","&#039;"); }
function cerrarSesion() { localStorage.removeItem("usuario"); location.href = "/"; }
