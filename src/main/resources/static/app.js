const pagina = document.body.dataset.pagina;
const endpoint = document.body.dataset.endpoint;
const titulo = document.body.dataset.titulo;

const usuario = JSON.parse(
    localStorage.getItem("usuario")
);

let asistenciasCompletas = [];


if (!usuario) {
    window.location.href = "/";
}


document.addEventListener(
    "DOMContentLoaded",
    () => {

        const nombreUsuario =
            document.getElementById(
                "usuarioActual"
            );

        if (nombreUsuario && usuario) {

            nombreUsuario.textContent =
                usuario.nombreUsuario
                + " - "
                + (usuario.nombreRol ?? "");
        }


        const tituloPagina =
            document.getElementById(
                "tituloPagina"
            );

        if (tituloPagina) {
            tituloPagina.textContent = titulo;
        }


        cargarDatos();
    }
);


async function cargarDatos() {

    const contenedor =
        document.getElementById(
            "tablaDatos"
        );

    contenedor.innerHTML =
        "<p>Cargando información...</p>";


    try {

        if (pagina === "asistencias") {

            await cargarAsistenciasCompletas();

            return;
        }


        const respuesta =
            await fetch(endpoint);


        if (!respuesta.ok) {

            throw new Error(
                "Error HTTP: "
                + respuesta.status
            );
        }


        const datos =
            await respuesta.json();


        mostrarTabla(datos);

    } catch (error) {

        contenedor.innerHTML =
            "<p class='mensaje-error'>"
            + "No fue posible cargar "
            + "la información."
            + "</p>";

        console.error(error);
    }
}


async function cargarAsistenciasCompletas() {

    const contenedor =
        document.getElementById(
            "tablaDatos"
        );


    try {

        const respuestas =
            await Promise.all([

                fetch(
                    "/asistencias-tecnicas"
                ),

                fetch(
                    "/ordenes-servicio"
                ),

                fetch(
                    "/clientes"
                ),

                fetch(
                    "/tecnicos"
                )
            ]);


        for (const respuesta of respuestas) {

            if (!respuesta.ok) {

                throw new Error(
                    "Error cargando "
                    + "información relacionada"
                );
            }
        }


        const [
            asistencias,
            ordenes,
            clientes,
            tecnicos
        ] =
            await Promise.all(
                respuestas.map(
                    respuesta =>
                        respuesta.json()
                )
            );


        const mapaOrdenes =
            new Map();


        ordenes.forEach(orden => {

            mapaOrdenes.set(
                Number(orden.idOrden),
                orden
            );
        });


        const mapaClientes =
            new Map();


        clientes.forEach(cliente => {

            mapaClientes.set(
                Number(cliente.idCliente),
                cliente
            );
        });


        const mapaTecnicos =
            new Map();


        tecnicos.forEach(tecnico => {

            mapaTecnicos.set(
                Number(tecnico.idTecnico),
                tecnico
            );
        });


        asistenciasCompletas =
            asistencias.map(
                asistencia => {

                    const orden =
                        mapaOrdenes.get(
                            Number(
                                asistencia.idOrden
                            )
                        );


                    const cliente =
                        orden
                            ? mapaClientes.get(
                                Number(
                                    orden.idCliente
                                )
                            )
                            : null;


                    const tecnico =
                        mapaTecnicos.get(
                            Number(
                                asistencia.idTecnico
                            )
                        );


                    return {

                        idAsistencia:
                            asistencia.idAsistencia,

                        numeroDocumento:
                            cliente
                                ? cliente.numeroDocumento
                                : "—",

                        cliente:
                            cliente
                                ? nombreCompleto(
                                    cliente.nombres,
                                    cliente.apellidos
                                )
                                : "—",

                        numeroOrden:
                            orden
                                ? orden.numeroOrden
                                : "—",

                        fechaAsistencia:
                            asistencia.fechaAsistencia,

                        horaInicio:
                            asistencia.horaInicio,

                        horaFin:
                            asistencia.horaFin,

                        tecnico:
                            tecnico
                                ? nombreCompleto(
                                    tecnico.nombres,
                                    tecnico.apellidos
                                )
                                : "—",

                        estadoServicio:
                            asistencia.estadoServicio,

                        diagnostico:
                            asistencia.diagnostico,

                        observaciones:
                            asistencia.observaciones
                    };
                }
            );


        asistenciasCompletas.sort(
            (a, b) => {

                const fechaA =
                    (
                        a.fechaAsistencia
                        ?? ""
                    )
                    + " "
                    + (
                        a.horaInicio
                        ?? ""
                    );


                const fechaB =
                    (
                        b.fechaAsistencia
                        ?? ""
                    )
                    + " "
                    + (
                        b.horaInicio
                        ?? ""
                    );


                return fechaB.localeCompare(
                    fechaA
                );
            }
        );


        mostrarTablaAsistencias(
            asistenciasCompletas
        );


        const resultado =
            document.getElementById(
                "resultadoFiltro"
            );


        if (resultado) {

            resultado.textContent =
                asistenciasCompletas.length
                + " asistencia(s) encontrada(s).";
        }

    } catch (error) {

        console.error(error);


        contenedor.innerHTML =
            "<p class='mensaje-error'>"
            + "No fue posible cargar "
            + "las asistencias técnicas."
            + "</p>";
    }
}


function nombreCompleto(
    nombres,
    apellidos
) {

    return [
        nombres,
        apellidos
    ]
    .filter(Boolean)
    .join(" ");
}


function mostrarTablaAsistencias(
    datos
) {

    const contenedor =
        document.getElementById(
            "tablaDatos"
        );


    if (
        !Array.isArray(datos)
        || datos.length === 0
    ) {

        contenedor.innerHTML =
            "<p>No hay asistencias "
            + "para mostrar.</p>";

        return;
    }


    let html = `

        <div class="tabla-contenedor">

            <table class="tabla-principal">

                <thead>

                    <tr>

                        <th>
                            Identificación
                        </th>

                        <th>
                            Cliente
                        </th>

                        <th>
                            Orden
                        </th>

                        <th>
                            Fecha
                        </th>

                        <th>
                            Hora inicio
                        </th>

                        <th>
                            Hora fin
                        </th>

                        <th>
                            Técnico
                        </th>

                        <th>
                            Estado
                        </th>

                        <th>
                            Diagnóstico
                        </th>

                        <th>
                            Acciones
                        </th>

                    </tr>

                </thead>

                <tbody>
    `;


    datos.forEach(registro => {

        html += `

            <tr>

                <td>
                    ${
                        escaparHTML(
                            String(
                                registro.numeroDocumento
                                ?? "—"
                            )
                        )
                    }
                </td>

                <td>
                    ${
                        escaparHTML(
                            String(
                                registro.cliente
                                ?? "—"
                            )
                        )
                    }
                </td>

                <td>
                    ${
                        escaparHTML(
                            String(
                                registro.numeroOrden
                                ?? "—"
                            )
                        )
                    }
                </td>

                <td>
                    ${
                        escaparHTML(
                            String(
                                formatearValor(
                                    "fechaAsistencia",
                                    registro.fechaAsistencia
                                )
                            )
                        )
                    }
                </td>

                <td>
                    ${
                        escaparHTML(
                            String(
                                registro.horaInicio
                                ?? "—"
                            )
                        )
                    }
                </td>

                <td>
                    ${
                        escaparHTML(
                            String(
                                registro.horaFin
                                ?? "—"
                            )
                        )
                    }
                </td>

                <td>
                    ${
                        escaparHTML(
                            String(
                                registro.tecnico
                                ?? "—"
                            )
                        )
                    }
                </td>

                <td>
                    ${
                        escaparHTML(
                            String(
                                registro.estadoServicio
                                ?? "—"
                            )
                        )
                    }
                </td>

                <td>
                    ${
                        escaparHTML(
                            String(
                                registro.diagnostico
                                ?? "—"
                            )
                        )
                    }
                </td>

                <td>

                    <div
                        style="
                            display: flex;
                            gap: 7px;
                            flex-wrap: wrap;
                        "
                    >

                        <button
                            type="button"
                            class="boton-actualizar"
                            onclick="
                                abrirRegistroFalla(
                                    ${registro.idAsistencia}
                                )
                            "
                        >
                            Registrar falla
                        </button>

                        <button
                            type="button"
                            onclick="
                                verFallasAsistencia(
                                    ${registro.idAsistencia}
                                )
                            "
                        >
                            Ver fallas
                        </button>

                    </div>

                </td>

            </tr>
        `;
    });


    html += `

                </tbody>

            </table>

        </div>
    `;


    contenedor.innerHTML = html;
}


function filtrarAsistenciasPorDocumento() {

    const input =
        document.getElementById(
            "buscarDocumento"
        );


    const resultado =
        document.getElementById(
            "resultadoFiltro"
        );


    if (!input) {
        return;
    }


    const documento =
        input.value
            .trim()
            .toLowerCase();


    if (documento === "") {

        mostrarTablaAsistencias(
            asistenciasCompletas
        );


        if (resultado) {

            resultado.textContent =
                asistenciasCompletas.length
                + " asistencia(s) encontrada(s).";
        }

        return;
    }


    const filtradas =
        asistenciasCompletas.filter(
            asistencia => {

                return String(
                    asistencia.numeroDocumento
                    ?? ""
                )
                .toLowerCase()
                .includes(documento);
            }
        );


    mostrarTablaAsistencias(
        filtradas
    );


    if (resultado) {

        if (filtradas.length === 0) {

            resultado.textContent =
                "No se encontraron "
                + "asistencias para "
                + "esa identificación.";

        } else {

            const cliente =
                filtradas[0].cliente;


            resultado.textContent =
                cliente
                + " - "
                + filtradas.length
                + " asistencia(s) "
                + "en el historial.";
        }
    }
}


function limpiarFiltroAsistencias() {

    const input =
        document.getElementById(
            "buscarDocumento"
        );


    if (input) {
        input.value = "";
    }


    mostrarTablaAsistencias(
        asistenciasCompletas
    );


    const resultado =
        document.getElementById(
            "resultadoFiltro"
        );


    if (resultado) {

        resultado.textContent =
            asistenciasCompletas.length
            + " asistencia(s) encontrada(s).";
    }
}


function mostrarTabla(datos) {

    const contenedor =
        document.getElementById(
            "tablaDatos"
        );


    if (
        !Array.isArray(datos)
        || datos.length === 0
    ) {

        contenedor.innerHTML =
            "<p>No hay registros "
            + "disponibles.</p>";

        return;
    }


    const columnas =
        obtenerColumnas(datos);


    let html = `

        <div class="tabla-contenedor">

            <table class="tabla-principal">

                <thead>

                    <tr>
    `;


    columnas.forEach(columna => {

        html += `

            <th>
                ${formatearNombre(columna)}
            </th>
        `;
    });


    html += `

                    </tr>

                </thead>

                <tbody>
    `;


    datos.forEach(registro => {

        html += "<tr>";


        columnas.forEach(columna => {

            const valor =
                formatearValor(
                    columna,
                    registro[columna]
                );


            html += `

                <td>
                    ${
                        escaparHTML(
                            String(valor)
                        )
                    }
                </td>
            `;
        });


        html += "</tr>";
    });


    html += `

                </tbody>

            </table>

        </div>
    `;


    contenedor.innerHTML = html;
}


function obtenerColumnas(datos) {

    const columnas =
        new Set();


    datos.forEach(registro => {

        Object.keys(registro)
            .forEach(clave => {

                columnas.add(clave);
            });
    });


    return Array.from(columnas);
}


async function abrirRegistroFalla(
    idAsistencia
) {

    try {

        const respuesta =
            await fetch(
                "/tipos-falla"
            );


        if (!respuesta.ok) {

            throw new Error(
                "Error cargando "
                + "tipos de falla"
            );
        }


        const fallas =
            await respuesta.json();


        const categorias = [

            "Antena",
            "LNB",
            "Señal",
            "Distribución",
            "Cableado coaxial",
            "Alimentación eléctrica",
            "Decodificador",
            "Tarjeta"
        ];


        fallas.sort(
            (a, b) => {

                const posicionA =
                    categorias.indexOf(
                        a.categoria
                    );


                const posicionB =
                    categorias.indexOf(
                        b.categoria
                    );


                const categoriaA =
                    posicionA === -1
                        ? 999
                        : posicionA;


                const categoriaB =
                    posicionB === -1
                        ? 999
                        : posicionB;


                if (
                    categoriaA
                    !== categoriaB
                ) {

                    return (
                        categoriaA
                        - categoriaB
                    );
                }


                return a.nombreFalla
                    .localeCompare(
                        b.nombreFalla,
                        "es",
                        {
                            sensitivity:
                                "base"
                        }
                    );
            }
        );


        let opciones = `

            <option value="">
                Seleccione una falla
            </option>
        `;


        fallas
            .filter(
                falla =>
                    falla.estado !== false
            )
            .forEach(falla => {

                opciones += `

                    <option
                        value="${falla.idTipoFalla}"
                    >
                        ${
                            escaparHTML(
                                falla.categoria
                                + " - "
                                + falla.nombreFalla
                            )
                        }
                    </option>
                `;
            });


        const fondo =
            document.createElement(
                "div"
            );


        fondo.id =
            "modalRegistroFalla";


        fondo.style.position =
            "fixed";

        fondo.style.top =
            "0";

        fondo.style.left =
            "0";

        fondo.style.width =
            "100%";

        fondo.style.height =
            "100%";

        fondo.style.background =
            "rgba(0, 0, 0, 0.65)";

        fondo.style.display =
            "flex";

        fondo.style.alignItems =
            "center";

        fondo.style.justifyContent =
            "center";

        fondo.style.zIndex =
            "9999";


        fondo.innerHTML = `

            <div
                style="
                    background: white;
                    width: 90%;
                    max-width: 550px;
                    padding: 25px;
                    border-radius: 10px;
                "
            >

                <h2>
                    Registrar falla
                </h2>

                <p>
                    Asistencia #${idAsistencia}
                </p>

                <label for="tipoFalla">
                    Falla encontrada
                </label>

                <select
                    id="tipoFalla"
                    style="
                        width: 100%;
                        padding: 10px;
                        margin-top: 8px;
                        margin-bottom: 18px;
                    "
                >
                    ${opciones}
                </select>

                <label for="detalleFalla">
                    Detalle de lo encontrado
                </label>

                <textarea
                    id="detalleFalla"
                    rows="5"
                    placeholder="
                        Describa lo encontrado
                        durante la asistencia
                    "
                    style="
                        width: 100%;
                        padding: 10px;
                        margin-top: 8px;
                        box-sizing: border-box;
                    "
                ></textarea>

                <div
                    style="
                        display: flex;
                        gap: 10px;
                        justify-content: flex-end;
                        margin-top: 20px;
                    "
                >

                    <button
                        type="button"
                        onclick="
                            cerrarRegistroFalla()
                        "
                    >
                        Cancelar
                    </button>

                    <button
                        type="button"
                        class="boton-actualizar"
                        onclick="
                            guardarFallaAsistencia(
                                ${idAsistencia}
                            )
                        "
                    >
                        Guardar falla
                    </button>

                </div>

                <p
                    id="mensajeRegistroFalla"
                    style="
                        margin-top: 15px;
                    "
                ></p>

            </div>
        `;


        document.body.appendChild(
            fondo
        );

    } catch (error) {

        console.error(error);


        alert(
            "No fue posible cargar "
            + "el catálogo de fallas."
        );
    }
}


async function guardarFallaAsistencia(
    idAsistencia
) {

    const select =
        document.getElementById(
            "tipoFalla"
        );


    const detalle =
        document.getElementById(
            "detalleFalla"
        );


    const mensaje =
        document.getElementById(
            "mensajeRegistroFalla"
        );


    if (!select.value) {

        mensaje.textContent =
            "Debe seleccionar "
            + "una falla.";

        return;
    }


    const registro = {

        idAsistencia:
            idAsistencia,

        idTipoFalla:
            Number(
                select.value
            ),

        detalle:
            detalle.value.trim()
    };


    try {

        const respuesta =
            await fetch(
                "/asistencia-fallas",
                {

                    method: "POST",

                    headers: {

                        "Content-Type":
                            "application/json"
                    },

                    body:
                        JSON.stringify(
                            registro
                        )
                }
            );


        if (!respuesta.ok) {

            const texto =
                await respuesta.text();


            throw new Error(texto);
        }


        mensaje.textContent =
            "Falla registrada "
            + "correctamente.";


        setTimeout(
            () => {

                cerrarRegistroFalla();
            },
            800
        );

    } catch (error) {

        console.error(error);


        mensaje.textContent =
            "No fue posible registrar "
            + "la falla. Puede que ya "
            + "esté registrada en esta "
            + "asistencia.";
    }
}


function cerrarRegistroFalla() {

    const modal =
        document.getElementById(
            "modalRegistroFalla"
        );


    if (modal) {
        modal.remove();
    }
}


async function verFallasAsistencia(
    idAsistencia
) {

    try {

        const [
            respuestaAsistencia,
            respuestaTipos
        ] =
            await Promise.all([

                fetch(
                    "/asistencia-fallas/asistencia/"
                    + idAsistencia
                ),

                fetch(
                    "/tipos-falla"
                )
            ]);


        if (
            !respuestaAsistencia.ok
            || !respuestaTipos.ok
        ) {

            throw new Error(
                "No se pudieron "
                + "cargar las fallas"
            );
        }


        const fallasAsistencia =
            await respuestaAsistencia
                .json();


        const tiposFalla =
            await respuestaTipos
                .json();


        const mapaTipos =
            new Map();


        tiposFalla.forEach(tipo => {

            mapaTipos.set(
                Number(
                    tipo.idTipoFalla
                ),
                tipo
            );
        });


        let contenido = "";


        if (
            fallasAsistencia.length
            === 0
        ) {

            contenido =
                "<p>No hay fallas "
                + "registradas para "
                + "esta asistencia.</p>";

        } else {

            contenido = `

                <div
                    class="tabla-contenedor"
                >

                    <table
                        class="tabla-principal"
                    >

                        <thead>

                            <tr>

                                <th>
                                    Categoría
                                </th>

                                <th>
                                    Falla
                                </th>

                                <th>
                                    Detalle
                                </th>

                            </tr>

                        </thead>

                        <tbody>
            `;


            fallasAsistencia
                .forEach(registro => {

                    const tipo =
                        mapaTipos.get(
                            Number(
                                registro.idTipoFalla
                            )
                        );


                    contenido += `

                        <tr>

                            <td>
                                ${
                                    escaparHTML(
                                        String(
                                            tipo
                                                ? tipo.categoria
                                                : "—"
                                        )
                                    )
                                }
                            </td>

                            <td>
                                ${
                                    escaparHTML(
                                        String(
                                            tipo
                                                ? tipo.nombreFalla
                                                : registro.idTipoFalla
                                        )
                                    )
                                }
                            </td>

                            <td>
                                ${
                                    escaparHTML(
                                        String(
                                            registro.detalle
                                            ?? "—"
                                        )
                                    )
                                }
                            </td>

                        </tr>
                    `;
                });


            contenido += `

                        </tbody>

                    </table>

                </div>
            `;
        }


        const fondo =
            document.createElement(
                "div"
            );


        fondo.id =
            "modalVerFallas";


        fondo.style.position =
            "fixed";

        fondo.style.top =
            "0";

        fondo.style.left =
            "0";

        fondo.style.width =
            "100%";

        fondo.style.height =
            "100%";

        fondo.style.background =
            "rgba(0, 0, 0, 0.65)";

        fondo.style.display =
            "flex";

        fondo.style.alignItems =
            "center";

        fondo.style.justifyContent =
            "center";

        fondo.style.zIndex =
            "9999";


        fondo.innerHTML = `

            <div
                style="
                    background: white;
                    width: 90%;
                    max-width: 800px;
                    max-height: 80vh;
                    overflow-y: auto;
                    padding: 25px;
                    border-radius: 10px;
                "
            >

                <h2>
                    Fallas registradas
                </h2>

                <p>
                    Asistencia #${idAsistencia}
                </p>

                ${contenido}

                <div
                    style="
                        text-align: right;
                        margin-top: 20px;
                    "
                >

                    <button
                        type="button"
                        onclick="
                            cerrarVerFallas()
                        "
                    >
                        Cerrar
                    </button>

                </div>

            </div>
        `;


        document.body.appendChild(
            fondo
        );

    } catch (error) {

        console.error(error);


        alert(
            "No fue posible cargar "
            + "las fallas de esta "
            + "asistencia."
        );
    }
}


function cerrarVerFallas() {

    const modal =
        document.getElementById(
            "modalVerFallas"
        );


    if (modal) {
        modal.remove();
    }
}


function formatearValor(
    columna,
    valor
) {

    if (
        valor === null
        || valor === undefined
        || valor === ""
    ) {

        return "—";
    }


    if (
        typeof valor === "boolean"
    ) {

        if (
            columna
                .toLowerCase()
                .includes("estado")
            ||
            columna
                .toLowerCase()
                .includes("activo")
        ) {

            return valor
                ? "Activo"
                : "Inactivo";
        }


        return valor
            ? "Sí"
            : "No";
    }


    if (
        typeof valor === "object"
    ) {

        return convertirObjeto(
            valor
        );
    }


    if (esFechaHora(valor)) {

        return formatearFechaHora(
            valor
        );
    }


    if (esFecha(valor)) {

        return formatearFecha(
            valor
        );
    }


    return valor;
}


function esFechaHora(valor) {

    return (
        typeof valor === "string"
        &&
        /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/
            .test(valor)
    );
}


function esFecha(valor) {

    return (
        typeof valor === "string"
        &&
        /^\d{4}-\d{2}-\d{2}$/
            .test(valor)
    );
}


function formatearFechaHora(valor) {

    const [
        fecha,
        horaCompleta
    ] =
        valor.split("T");


    const [
        anio,
        mes,
        dia
    ] =
        fecha.split("-");


    const hora =
        horaCompleta.substring(
            0,
            5
        );


    return (
        dia
        + "/"
        + mes
        + "/"
        + anio
        + " "
        + hora
    );
}


function formatearFecha(valor) {

    const [
        anio,
        mes,
        dia
    ] =
        valor.split("-");


    return (
        dia
        + "/"
        + mes
        + "/"
        + anio
    );
}


function convertirObjeto(objeto) {

    if (objeto === null) {
        return "—";
    }


    if (objeto.nombreRol) {
        return objeto.nombreRol;
    }


    if (objeto.nombreUsuario) {
        return objeto.nombreUsuario;
    }


    if (objeto.nombre) {
        return objeto.nombre;
    }


    return JSON.stringify(objeto);
}


function formatearNombre(texto) {

    const nombresEspeciales = {

        idCliente:
            "ID Cliente",

        idInstalacion:
            "ID Instalación",

        idEquipo:
            "ID Equipo",

        idOrden:
            "ID Orden",

        idTecnico:
            "ID Técnico",

        idTecnicoAsignado:
            "ID Técnico Asignado",

        idAsistencia:
            "ID Asistencia",

        idTipoFalla:
            "ID Tipo Falla",

        idSolucion:
            "ID Solución",

        idMaterial:
            "ID Material",

        idUsuario:
            "ID Usuario",

        idRol:
            "ID Rol",

        numeroDocumento:
            "Número Documento",

        tipoDocumento:
            "Tipo Documento",

        fechaRegistro:
            "Fecha Registro",

        fechaInstalacion:
            "Fecha Instalación",

        fechaAsignacion:
            "Fecha Asignación",

        fechaCierre:
            "Fecha Cierre",

        fechaProgramada:
            "Fecha Programada",

        fechaReporte:
            "Fecha Reporte",

        fechaAsistencia:
            "Fecha Asistencia",

        fechaIngreso:
            "Fecha Ingreso",

        numeroOrden:
            "Número Orden",

        nombreUsuario:
            "Nombre Usuario",

        nombreRol:
            "Nombre Rol",

        nombreFalla:
            "Nombre Falla",

        nombreSolucion:
            "Nombre Solución",

        nombreMaterial:
            "Nombre Material",

        tipoInstalacion:
            "Tipo Instalación",

        tipoEquipo:
            "Tipo Equipo",

        tipoServicio:
            "Tipo Servicio",

        estadoServicio:
            "Estado Servicio",

        unidadMedida:
            "Unidad Medida",

        cantidadStock:
            "Cantidad Stock",

        horaInicio:
            "Hora Inicio",

        horaFin:
            "Hora Fin",

        firmaCliente:
            "Firma Cliente",

        evidenciaFotografica:
            "Evidencia Fotográfica",

        observacionesCierre:
            "Observaciones Cierre",

        codigoInventario:
            "Código Inventario",

        serialEquipo:
            "Serial Equipo",

        serialTarjeta:
            "Serial Tarjeta"
    };


    if (
        nombresEspeciales[texto]
    ) {

        return nombresEspeciales[
            texto
        ];
    }


    return texto
        .replace(
            /([A-Z])/g,
            " $1"
        )
        .replace(
            /^./,
            letra =>
                letra.toUpperCase()
        );
}


function escaparHTML(texto) {

    return texto
        .replaceAll(
            "&",
            "&amp;"
        )
        .replaceAll(
            "<",
            "&lt;"
        )
        .replaceAll(
            ">",
            "&gt;"
        )
        .replaceAll(
            '"',
            "&quot;"
        )
        .replaceAll(
            "'",
            "&#039;"
        );
}


function cerrarSesion() {

    localStorage.removeItem(
        "usuario"
    );

    window.location.href = "/";
}