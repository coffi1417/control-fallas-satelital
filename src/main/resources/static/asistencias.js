const usuarioAsistencias = JSON.parse(localStorage.getItem("usuario"));
if (!usuarioAsistencias) window.location.href = "/";

let asistenciasRaw = [], asistenciasVista = [], ordenesA = [], clientesA = [], tecnicosA = [];
let tiposFallaA = [], solucionesA = [], materialesA = [], relacionesFallaSolucionA = [];

window.addEventListener("DOMContentLoaded", async () => {
    document.getElementById("usuarioActual").textContent = `${usuarioAsistencias.nombreUsuario} - ${usuarioAsistencias.nombreRol ?? ""}`;
    await cargarCatalogosAsistencia();
    await cargarAsistencias();
    const p = new URLSearchParams(location.search);
    const documento = p.get("documento");
    if (documento) {
        document.getElementById("buscarDocumento").value = documento;
        filtrarAsistencias();
    }
    const orden = p.get("orden");
    if (orden) abrirNuevaAsistencia(Number(orden));
});

async function cargarCatalogosAsistencia() {
    const rs = await Promise.all([
        fetch("/ordenes-servicio"), fetch("/clientes"), fetch("/tecnicos"), fetch("/tipos-falla"), fetch("/soluciones"), fetch("/materiales"), fetch("/tipo-falla-soluciones")
    ]);
    if (rs.some(r => !r.ok)) throw new Error("No fue posible cargar catálogos");
    [ordenesA, clientesA, tecnicosA, tiposFallaA, solucionesA, materialesA, relacionesFallaSolucionA] = await Promise.all(rs.map(r => r.json()));
}

async function cargarAsistencias() {
    const contenedor = document.getElementById("tablaAsistencias");
    contenedor.innerHTML = "<p>Cargando asistencias...</p>";
    try {
        await cargarCatalogosAsistencia();
        const r = await fetch("/asistencias-tecnicas");
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        asistenciasRaw = await r.json();
        asistenciasVista = enriquecerAsistencias(asistenciasRaw);
        mostrarAsistencias(asistenciasVista);
    } catch (e) {
        console.error(e);
        contenedor.innerHTML = "<p class='mensaje-error'>No fue posible cargar las asistencias.</p>";
    }
}

function enriquecerAsistencias(lista) {
    const mo = new Map(ordenesA.map(o => [Number(o.idOrden), o]));
    const mc = new Map(clientesA.map(c => [Number(c.idCliente), c]));
    const mt = new Map(tecnicosA.map(t => [Number(t.idTecnico), t]));
    return lista.map(a => {
        const o = mo.get(Number(a.idOrden));
        const c = o ? mc.get(Number(o.idCliente)) : null;
        const t = mt.get(Number(a.idTecnico));
        return {...a, numeroOrden:o?.numeroOrden ?? "—", numeroDocumento:c?.numeroDocumento ?? "—", cliente:nombre(c), tecnico:nombre(t), motivo:o?.descripcionProblema ?? "—"};
    }).sort((a,b)=>`${b.fechaAsistencia ?? ""} ${b.horaInicio ?? ""}`.localeCompare(`${a.fechaAsistencia ?? ""} ${a.horaInicio ?? ""}`));
}

function mostrarAsistencias(lista) {
    const c = document.getElementById("tablaAsistencias");
    document.getElementById("resultadoFiltro").textContent = `${lista.length} asistencia(s) encontrada(s).`;
    if (!lista.length) { c.innerHTML = "<p>No hay asistencias para mostrar.</p>"; return; }
    let h = `<div class="tabla-contenedor"><table class="tabla-principal"><thead><tr>
        <th>Identificación</th><th>Cliente</th><th>Orden</th><th>Fecha</th><th>Hora</th><th>Técnico</th><th>Estado</th><th>Motivo</th><th>Diagnóstico</th><th>Acciones</th>
        </tr></thead><tbody>`;
    lista.forEach(a => {
        h += `<tr><td>${esc(a.numeroDocumento)}</td><td>${esc(a.cliente)}</td><td>${esc(a.numeroOrden)}</td>
        <td>${esc(formatearFecha(a.fechaAsistencia))}</td><td>${esc(a.horaInicio)}${a.horaFin ? ` - ${esc(a.horaFin)}` : ""}</td>
        <td>${esc(a.tecnico)}</td><td>${esc(a.estadoServicio)}</td><td>${esc(a.motivo)}</td><td>${esc(a.diagnostico)}</td>
        <td><div class="acciones-toolbar">
            ${a.estadoServicio !== "FINALIZADO" ? `<button onclick="editarAsistencia(${a.idAsistencia})">Editar</button><button onclick="registrarFalla(${a.idAsistencia})">Registrar falla</button><button onclick="registrarSolucion(${a.idAsistencia})">Registrar solución</button><button onclick="registrarMaterial(${a.idAsistencia})">Registrar material</button><button class="boton-exito" onclick="finalizarAsistencia(${a.idAsistencia})">Finalizar</button>` : `<span class="estado-cerrado">Servicio cerrado</span>`}
            <button onclick="verFallas(${a.idAsistencia})">Ver fallas</button>
            <button onclick="verSoluciones(${a.idAsistencia})">Ver soluciones</button>
            <button onclick="verMateriales(${a.idAsistencia})">Ver materiales</button>
        </div></td></tr>`;
    });
    h += "</tbody></table></div>";
    c.innerHTML = h;
}

function filtrarAsistencias() {
    const q = document.getElementById("buscarDocumento").value.trim().toLowerCase();
    if (!q) return mostrarAsistencias(asistenciasVista);
    mostrarAsistencias(asistenciasVista.filter(a => [a.numeroDocumento,a.cliente,a.numeroOrden].some(v => String(v ?? "").toLowerCase().includes(q))));
}
function limpiarFiltro() { document.getElementById("buscarDocumento").value = ""; mostrarAsistencias(asistenciasVista); }

function llenarOrdenes(idSel) {
    const s = document.getElementById("idOrdenAsistencia");
    s.innerHTML = `<option value="">Seleccione</option>` + ordenesA.map(o => {
        const c = clientesA.find(x => Number(x.idCliente) === Number(o.idCliente));
        return `<option value="${o.idOrden}">${esc(o.numeroOrden)} - ${esc(c?.numeroDocumento ?? "")} - ${esc(nombre(c))}</option>`;
    }).join("");
    if (idSel) s.value = String(idSel);
}
function llenarTecnicosA(idSel) {
    const s = document.getElementById("idTecnicoAsistencia");
    s.innerHTML = `<option value="">Seleccione</option>` + tecnicosA.filter(t=>t.estado!==false).map(t=>`<option value="${t.idTecnico}">${esc(nombre(t))}</option>`).join("");
    if (idSel) s.value = String(idSel);
}
function sincronizarTecnicoOrden() {
    const o = ordenesA.find(x => Number(x.idOrden) === Number(document.getElementById("idOrdenAsistencia").value));
    if (o?.idTecnicoAsignado) document.getElementById("idTecnicoAsistencia").value = String(o.idTecnicoAsignado);
}

function abrirNuevaAsistencia(idOrden = null) {
    document.getElementById("tituloAsistencia").textContent = "Nueva asistencia técnica";
    document.getElementById("idAsistencia").value = "";
    llenarOrdenes(idOrden); llenarTecnicosA(); sincronizarTecnicoOrden();
    const ahora = new Date();
    document.getElementById("fechaAsistencia").value = fechaLocal(ahora);
    document.getElementById("horaInicio").value = horaLocal(ahora);
    document.getElementById("horaFin").value = "";
    document.getElementById("estadoServicio").value = "EN PROCESO";
    document.getElementById("diagnostico").value = "";
    document.getElementById("observaciones").value = "";
    document.getElementById("mensajeAsistencia").textContent = "";
    document.getElementById("modalAsistencia").style.display = "flex";
}

function editarAsistencia(id) {
    const a = asistenciasRaw.find(x => Number(x.idAsistencia) === Number(id)); if (!a) return;
    document.getElementById("tituloAsistencia").textContent = "Editar asistencia técnica";
    document.getElementById("idAsistencia").value = a.idAsistencia;
    llenarOrdenes(a.idOrden); llenarTecnicosA(a.idTecnico);
    document.getElementById("fechaAsistencia").value = a.fechaAsistencia ?? "";
    document.getElementById("horaInicio").value = a.horaInicio ?? "";
    document.getElementById("horaFin").value = a.horaFin ?? "";
    document.getElementById("estadoServicio").value = a.estadoServicio ?? "EN PROCESO";
    document.getElementById("diagnostico").value = a.diagnostico ?? "";
    document.getElementById("observaciones").value = a.observaciones ?? "";
    document.getElementById("mensajeAsistencia").textContent = "";
    document.getElementById("modalAsistencia").style.display = "flex";
}

async function guardarAsistencia() {
    const id = document.getElementById("idAsistencia").value;
    const payload = {
        idOrden:Number(document.getElementById("idOrdenAsistencia").value),
        idTecnico:Number(document.getElementById("idTecnicoAsistencia").value),
        fechaAsistencia:document.getElementById("fechaAsistencia").value,
        horaInicio:normalizarHora(document.getElementById("horaInicio").value),
        horaFin:normalizarHora(document.getElementById("horaFin").value) || null,
        diagnostico:document.getElementById("diagnostico").value.trim(),
        estadoServicio:document.getElementById("estadoServicio").value,
        observaciones:document.getElementById("observaciones").value.trim() || null,
        firmaCliente:id ? asistenciasRaw.find(a=>Number(a.idAsistencia)===Number(id))?.firmaCliente ?? null : null,
        evidenciaFotografica:id ? asistenciasRaw.find(a=>Number(a.idAsistencia)===Number(id))?.evidenciaFotografica ?? null : null
    };
    const m = document.getElementById("mensajeAsistencia");
    if (!payload.idOrden || !payload.idTecnico || !payload.fechaAsistencia || !payload.horaInicio || !payload.diagnostico) {
        m.className="mensaje-error"; m.textContent="Complete orden, técnico, fecha, hora de inicio y diagnóstico."; return;
    }
    try {
        const r = await fetch(id ? `/asistencias-tecnicas/${id}` : "/asistencias-tecnicas", {method:id?"PUT":"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify(payload)});
        if (!r.ok) throw new Error(await r.text());
        if (!id) await marcarOrdenEnProceso(payload.idOrden, payload.idTecnico);
        m.className="mensaje-exito"; m.textContent=id?"Asistencia actualizada.":"Asistencia creada.";
        await cargarAsistencias(); setTimeout(()=>cerrarModal("modalAsistencia"),500);
    } catch(e) { console.error(e); m.className="mensaje-error"; m.textContent="No fue posible guardar la asistencia."; }
}

async function marcarOrdenEnProceso(idOrden, idTecnico) {
    const o = ordenesA.find(x => Number(x.idOrden) === Number(idOrden));
    if (!o || o.estado === "CERRADA") return;
    const payload = {...o, idTecnicoAsignado:o.idTecnicoAsignado ?? idTecnico, estado:"EN PROCESO", fechaAsignacion:o.fechaAsignacion ?? fechaHoraLocal(new Date())};
    const r = await fetch(`/ordenes-servicio/${idOrden}`, {method:"PUT", headers:{"Content-Type":"application/json"}, body:JSON.stringify(payload)});
    if (r.ok) { const actualizado=await r.json(); const i=ordenesA.findIndex(x=>Number(x.idOrden)===Number(idOrden)); if(i>=0) ordenesA[i]=actualizado; }
}

async function finalizarAsistencia(id) {
    const a = asistenciasRaw.find(x=>Number(x.idAsistencia)===Number(id)); if(!a) return;
    const [rf, rs] = await Promise.all([fetch(`/asistencia-fallas/asistencia/${id}`), fetch("/asistencia-soluciones")]);
    if (!rf.ok || !rs.ok) return alert("No fue posible validar el cierre del servicio.");
    const fallas = await rf.json();
    const soluciones = (await rs.json()).filter(x => Number(x.idAsistencia) === Number(id));
    if (!fallas.length) return alert("Antes de finalizar debe registrar al menos una falla encontrada.");
    if (!soluciones.length) return alert("Antes de finalizar debe registrar al menos una solución aplicada.");
    if (!confirm("Se cerrará la asistencia y también la orden de servicio relacionada. ¿Continuar?")) return;
    const observacion = prompt("Observación final del servicio:", a.observaciones ?? "") ?? null;
    if (observacion === null) return;
    const payload = {...a, horaFin:normalizarHora(horaLocal(new Date())), estadoServicio:"FINALIZADO", observaciones:observacion};
    const r = await fetch(`/asistencias-tecnicas/${id}`, {method:"PUT", headers:{"Content-Type":"application/json"}, body:JSON.stringify(payload)});
    if (!r.ok) return alert("No fue posible finalizar la asistencia.");
    await cerrarOrdenRelacionada(a.idOrden, observacion);
    await cargarAsistencias();
}

async function cerrarOrdenRelacionada(idOrden, observacion) {
    const o = ordenesA.find(x=>Number(x.idOrden)===Number(idOrden)); if(!o) return;
    const payload = {...o, estado:"CERRADA", fechaCierre:fechaHoraLocal(new Date()), observacionesCierre:observacion || o.observacionesCierre || null};
    await fetch(`/ordenes-servicio/${idOrden}`, {method:"PUT", headers:{"Content-Type":"application/json"}, body:JSON.stringify(payload)});
}

async function registrarFalla(id) {
    const opciones = tiposFallaA.filter(x=>x.estado!==false).sort((a,b)=>String(a.categoria??"").localeCompare(String(b.categoria??""))).map(x=>`<option value="${x.idTipoFalla}">${esc(x.categoria ?? "Sin categoría")} - ${esc(x.nombreFalla)}</option>`).join("");
    abrirOperacion(`<h2>Registrar falla</h2><p>Asistencia #${id}</p><div class="form-grid" style="margin-top:18px;"><div class="campo-completo"><label>Tipo de falla *</label><select id="opFalla">${opciones}</select></div><div class="campo-completo"><label>Detalle</label><textarea id="opDetalle"></textarea></div></div><p id="opMensaje"></p><div class="modal-acciones"><button class="boton-secundario" onclick="cerrarModal('modalOperacion')">Cancelar</button><button class="boton-exito" onclick="guardarFalla(${id})">Guardar falla</button></div>`);
}
async function guardarFalla(id) {
    const p={idAsistencia:id,idTipoFalla:Number(document.getElementById("opFalla").value),detalle:document.getElementById("opDetalle").value.trim()};
    await postOperacion("/asistencia-fallas",p,"Falla registrada.");
}
async function verFallas(id) {
    const [r1,r2]=await Promise.all([fetch(`/asistencia-fallas/asistencia/${id}`),fetch("/tipos-falla")]);
    if(!r1.ok||!r2.ok)return alert("No fue posible cargar las fallas.");
    const regs=await r1.json(), tipos=await r2.json(), map=new Map(tipos.map(x=>[Number(x.idTipoFalla),x]));
    mostrarListadoOperacion("Fallas registradas",id,regs.map(x=>[map.get(Number(x.idTipoFalla))?.categoria??"—",map.get(Number(x.idTipoFalla))?.nombreFalla??x.idTipoFalla,x.detalle??"—"]),["Categoría","Falla","Detalle"]);
}

async function registrarSolucion(id) {
    const rf = await fetch(`/asistencia-fallas/asistencia/${id}`);
    if (!rf.ok) return alert("No fue posible consultar las fallas de la asistencia.");
    const fallasRegistradas = await rf.json();
    if (!fallasRegistradas.length) return alert("Primero registre la falla encontrada. Así el sistema podrá mostrar soluciones compatibles.");
    const idsFalla = new Set(fallasRegistradas.map(x => Number(x.idTipoFalla)));
    const idsSolucion = new Set(relacionesFallaSolucionA.filter(r => idsFalla.has(Number(r.idTipoFalla))).map(r => Number(r.idSolucion)));
    let compatibles = solucionesA.filter(x => x.estado !== false && idsSolucion.has(Number(x.idSolucion)));
    if (!compatibles.length) compatibles = solucionesA.filter(x => x.estado !== false);
    compatibles.sort((a,b)=>String(a.nombreSolucion).localeCompare(String(b.nombreSolucion)));
    const opciones=compatibles.map(x=>`<option value="${x.idSolucion}">${esc(x.nombreSolucion)}${x.descripcion ? ` — ${esc(x.descripcion)}` : ""}</option>`).join("");
    abrirOperacion(`<h2>Registrar solución</h2><p>Asistencia #${id}</p><p class="ayuda-operacion">Se muestran primero las soluciones compatibles con las fallas registradas.</p><div class="form-grid" style="margin-top:18px;"><div class="campo-completo"><label>Solución *</label><select id="opSolucion">${opciones}</select></div><div class="campo-completo"><label>Detalle de la solución aplicada</label><textarea id="opDetalle" placeholder="Describa qué se realizó y el resultado obtenido"></textarea></div></div><p id="opMensaje"></p><div class="modal-acciones"><button class="boton-secundario" onclick="cerrarModal('modalOperacion')">Cancelar</button><button class="boton-exito" onclick="guardarSolucion(${id})">Guardar solución</button></div>`);
}
async function guardarSolucion(id){await postOperacion("/asistencia-soluciones",{idAsistencia:id,idSolucion:Number(document.getElementById("opSolucion").value),detalle:document.getElementById("opDetalle").value.trim()},"Solución registrada.");}
async function verSoluciones(id){
    const [r1,r2]=await Promise.all([fetch("/asistencia-soluciones"),fetch("/soluciones")]); if(!r1.ok||!r2.ok)return alert("No fue posible cargar soluciones.");
    const regs=(await r1.json()).filter(x=>Number(x.idAsistencia)===Number(id)), cats=await r2.json(), map=new Map(cats.map(x=>[Number(x.idSolucion),x]));
    mostrarListadoOperacion("Soluciones aplicadas",id,regs.map(x=>[map.get(Number(x.idSolucion))?.nombreSolucion??x.idSolucion,x.detalle??"—"]),["Solución","Detalle"]);
}

async function registrarMaterial(id){
    const opciones=materialesA.filter(x=>x.estado!==false).sort((a,b)=>String(a.nombreMaterial).localeCompare(String(b.nombreMaterial))).map(x=>`<option value="${x.idMaterial}">${esc(x.nombreMaterial)} — ${esc(x.unidadMedida??"")} — disponible: ${esc(x.cantidadStock)}</option>`).join("");
    abrirOperacion(`<h2>Registrar material utilizado</h2><p>Asistencia #${id}</p><div class="form-grid" style="margin-top:18px;"><div><label>Material *</label><select id="opMaterial">${opciones}</select></div><div><label>Cantidad utilizada *</label><input id="opCantidad" type="number" min="0.01" step="0.01"></div><div class="campo-completo"><label>Observaciones</label><textarea id="opDetalle"></textarea></div></div><p id="opMensaje"></p><div class="modal-acciones"><button class="boton-secundario" onclick="cerrarModal('modalOperacion')">Cancelar</button><button class="boton-exito" onclick="guardarMaterial(${id})">Guardar material</button></div>`);
}
async function guardarMaterial(id){
    const cantidad=Number(document.getElementById("opCantidad").value); if(!cantidad||cantidad<=0){document.getElementById("opMensaje").textContent="Ingrese una cantidad válida.";return;}
    await postOperacion("/detalle-materiales",{idAsistencia:id,idMaterial:Number(document.getElementById("opMaterial").value),cantidadUtilizada:cantidad,observaciones:document.getElementById("opDetalle").value.trim()},"Material registrado.");
}
async function verMateriales(id){
    const [r1,r2]=await Promise.all([fetch("/detalle-materiales"),fetch("/materiales")]); if(!r1.ok||!r2.ok)return alert("No fue posible cargar materiales.");
    const regs=(await r1.json()).filter(x=>Number(x.idAsistencia)===Number(id)), cats=await r2.json(), map=new Map(cats.map(x=>[Number(x.idMaterial),x]));
    mostrarListadoOperacion("Materiales utilizados",id,regs.map(x=>[map.get(Number(x.idMaterial))?.nombreMaterial??x.idMaterial,x.cantidadUtilizada,map.get(Number(x.idMaterial))?.unidadMedida??"—",x.observaciones??"—"]),["Material","Cantidad","Unidad","Observaciones"]);
}

async function postOperacion(url,payload,ok){
    const m=document.getElementById("opMensaje");
    try{const r=await fetch(url,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(payload)});if(!r.ok)throw new Error(await r.text());m.className="mensaje-exito";m.textContent=ok;setTimeout(()=>cerrarModal("modalOperacion"),500);}catch(e){console.error(e);m.className="mensaje-error";m.textContent="No fue posible guardar. Revise si el registro ya existe para esta asistencia.";}
}
function mostrarListadoOperacion(titulo,id,filas,columnas){
    let tabla=filas.length?`<div class="tabla-contenedor"><table class="tabla-principal"><thead><tr>${columnas.map(x=>`<th>${esc(x)}</th>`).join("")}</tr></thead><tbody>${filas.map(f=>`<tr>${f.map(v=>`<td>${esc(v)}</td>`).join("")}</tr>`).join("")}</tbody></table></div>`:"<p>No hay registros.</p>";
    abrirOperacion(`<h2>${esc(titulo)}</h2><p>Asistencia #${id}</p>${tabla}<div class="modal-acciones"><button onclick="cerrarModal('modalOperacion')">Cerrar</button></div>`);
}
function abrirOperacion(html){document.getElementById("contenidoOperacion").innerHTML=html;document.getElementById("modalOperacion").style.display="flex";}
function cerrarModal(id){document.getElementById(id).style.display="none";}
function normalizarHora(v){if(!v)return null;return v.length===5?`${v}:00`:v;}
function fechaLocal(d){const z=n=>String(n).padStart(2,"0");return `${d.getFullYear()}-${z(d.getMonth()+1)}-${z(d.getDate())}`;}
function horaLocal(d){const z=n=>String(n).padStart(2,"0");return `${z(d.getHours())}:${z(d.getMinutes())}:${z(d.getSeconds())}`;}
function fechaHoraLocal(d){return `${fechaLocal(d)}T${horaLocal(d)}`;}
function formatearFecha(v){if(!v)return"—";const [y,m,d]=String(v).split("-");return `${d}/${m}/${y}`;}
function nombre(x){return x?[x.nombres,x.apellidos].filter(Boolean).join(" ")||"—":"—";}
function esc(v){return String(v??"—").replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;").replaceAll("'","&#039;");}
function cerrarSesion(){localStorage.removeItem("usuario");location.href="/";}
