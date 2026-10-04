const usuario =
    JSON.parse(
        localStorage.getItem("usuario")
    );

let clientes = [];


if (!usuario) {
    window.location.href = "/";
}


document.addEventListener(
    "DOMContentLoaded",
    () => {

        const usuarioActual =
            document.getElementById(
                "usuarioActual"
            );

        if (usuarioActual && usuario) {

            usuarioActual.textContent =
                usuario.nombreUsuario
                + " - "
                + (usuario.nombreRol ?? "");
        }

        cargarClientes();
    }
);


async function cargarClientes() {

    const contenedor =
        document.getElementById(
            "tablaClientes"
        );

    contenedor.innerHTML =
        "<p>Cargando clientes...</p>";


    try {

        const respuesta =
            await fetch("/clientes");


        if (!respuesta.ok) {

            throw new Error(
                "Error HTTP "
                + respuesta.status
            );
        }


        clientes =
            await respuesta.json();


        mostrarClientes(clientes);

    } catch (error) {

        console.error(error);

        contenedor.innerHTML =
            "<p>No fue posible cargar los clientes.</p>";
    }
}


function mostrarClientes(lista) {

    const contenedor =
        document.getElementById(
            "tablaClientes"
        );


    if (
        !Array.isArray(lista)
        || lista.length === 0
    ) {

        contenedor.innerHTML =
            "<p>No hay clientes registrados.</p>";

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
                            Teléfono
                        </th>

                        <th>
                            Dirección
                        </th>

                        <th>
                            Ciudad
                        </th>

                        <th>
                            Estado
                        </th>

                        <th>
                            Acciones
                        </th>

                    </tr>

                </thead>

                <tbody>
    `;


    lista.forEach(cliente => {

        const nombreCompleto =
            [
                cliente.nombres,
                cliente.apellidos
            ]
            .filter(Boolean)
            .join(" ");


        html += `

            <tr>

                <td>
                    ${
                        escaparHTML(
                            cliente.numeroDocumento
                            ?? "—"
                        )
                    }
                </td>

                <td>
                    ${
                        escaparHTML(
                            nombreCompleto
                            || "—"
                        )
                    }
                </td>

                <td>
                    ${
                        escaparHTML(
                            cliente.telefono
                            ?? "—"
                        )
                    }
                </td>

                <td>
                    ${
                        escaparHTML(
                            cliente.direccion
                            ?? "—"
                        )
                    }
                </td>

                <td>
                    ${
                        escaparHTML(
                            cliente.ciudad
                            ?? "—"
                        )
                    }
                </td>

                <td>
                    ${
                        cliente.estado === false
                            ? "Inactivo"
                            : "Activo"
                    }
                </td>

                <td>

                    <div
                        style="
                            display:flex;
                            gap:6px;
                            flex-wrap:wrap;
                        "
                    >

                        <button
                            class="boton-actualizar"
                            onclick="editarCliente(
                                ${cliente.idCliente}
                            )"
                        >
                            Editar
                        </button>

                        <button
                            class="boton-exito"
                            onclick="crearOrdenCliente(${cliente.idCliente})"
                        >
                            Crear orden
                        </button>

                        <button
                            onclick="verFichaCliente(${cliente.idCliente})"
                        >
                            Ficha / Historial
                        </button>

                        <button
                            class="boton-peligro"
                            onclick="eliminarCliente(
                                ${cliente.idCliente}
                            )"
                        >
                            Eliminar
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


function filtrarClientes() {

    const texto =
        document
            .getElementById(
                "buscarCliente"
            )
            .value
            .trim()
            .toLowerCase();


    if (!texto) {

        mostrarClientes(clientes);

        return;
    }


    const filtrados =
        clientes.filter(cliente => {

            const nombre =
                (
                    (cliente.nombres ?? "")
                    + " "
                    + (cliente.apellidos ?? "")
                )
                .toLowerCase();


            const documento =
                String(
                    cliente.numeroDocumento
                    ?? ""
                )
                .toLowerCase();


            return (
                nombre.includes(texto)
                ||
                documento.includes(texto)
            );
        });


    mostrarClientes(filtrados);
}


function abrirFormularioNuevo() {

    limpiarFormulario();


    document.getElementById(
        "tituloFormulario"
    ).textContent =
        "Nuevo cliente";


    document.getElementById(
        "estado"
    ).value =
        "true";


    mostrarModal();
}


function editarCliente(idCliente) {

    const cliente =
        clientes.find(
            item =>
                Number(item.idCliente)
                === Number(idCliente)
        );


    if (!cliente) {

        alert(
            "No se encontró el cliente."
        );

        return;
    }


    document.getElementById(
        "tituloFormulario"
    ).textContent =
        "Editar cliente";


    document.getElementById(
        "idCliente"
    ).value =
        cliente.idCliente;


    document.getElementById(
        "nombres"
    ).value =
        cliente.nombres ?? "";


    document.getElementById(
        "apellidos"
    ).value =
        cliente.apellidos ?? "";


    document.getElementById(
        "tipoDocumento"
    ).value =
        cliente.tipoDocumento ?? "";


    document.getElementById(
        "numeroDocumento"
    ).value =
        cliente.numeroDocumento ?? "";


    document.getElementById(
        "telefono"
    ).value =
        cliente.telefono ?? "";


    document.getElementById(
        "correo"
    ).value =
        cliente.correo ?? "";


    document.getElementById(
        "direccion"
    ).value =
        cliente.direccion ?? "";


    document.getElementById(
        "barrio"
    ).value =
        cliente.barrio ?? "";


    document.getElementById(
        "ciudad"
    ).value =
        cliente.ciudad ?? "";


    document.getElementById(
        "departamento"
    ).value =
        cliente.departamento ?? "";


    document.getElementById(
        "estado"
    ).value =
        String(
            cliente.estado !== false
        );


    document.getElementById(
        "mensajeFormulario"
    ).textContent =
        "";


    mostrarModal();
}


function mostrarModal() {

    document.getElementById(
        "modalCliente"
    ).style.display =
        "flex";
}


function cerrarFormularioCliente() {

    document.getElementById(
        "modalCliente"
    ).style.display =
        "none";


    limpiarFormulario();
}


function limpiarFormulario() {

    const campos = [

        "idCliente",
        "nombres",
        "apellidos",
        "tipoDocumento",
        "numeroDocumento",
        "telefono",
        "correo",
        "direccion",
        "barrio",
        "ciudad",
        "departamento"
    ];


    campos.forEach(id => {

        const elemento =
            document.getElementById(id);

        if (elemento) {
            elemento.value = "";
        }
    });


    const mensaje =
        document.getElementById(
            "mensajeFormulario"
        );


    if (mensaje) {
        mensaje.textContent = "";
    }
}


async function guardarCliente() {

    const idCliente =
        document
            .getElementById(
                "idCliente"
            )
            .value;


    const nombres =
        document
            .getElementById(
                "nombres"
            )
            .value
            .trim();


    const direccion =
        document
            .getElementById(
                "direccion"
            )
            .value
            .trim();


    const ciudad =
        document
            .getElementById(
                "ciudad"
            )
            .value
            .trim();


    const mensaje =
        document.getElementById(
            "mensajeFormulario"
        );


    if (
        !nombres
        || !direccion
        || !ciudad
    ) {

        mensaje.textContent =
            "Complete los campos obligatorios: nombres, dirección y ciudad.";

        return;
    }


    const cliente = {

        nombres:
            nombres,

        apellidos:
            document
                .getElementById(
                    "apellidos"
                )
                .value
                .trim(),

        tipoDocumento:
            document
                .getElementById(
                    "tipoDocumento"
                )
                .value,

        numeroDocumento:
            document
                .getElementById(
                    "numeroDocumento"
                )
                .value
                .trim(),

        telefono:
            document
                .getElementById(
                    "telefono"
                )
                .value
                .trim(),

        correo:
            document
                .getElementById(
                    "correo"
                )
                .value
                .trim(),

        direccion:
            direccion,

        barrio:
            document
                .getElementById(
                    "barrio"
                )
                .value
                .trim(),

        ciudad:
            ciudad,

        departamento:
            document
                .getElementById(
                    "departamento"
                )
                .value
                .trim(),

        estado:
            document
                .getElementById(
                    "estado"
                )
                .value
                === "true"
    };


    try {

        let respuesta;


        if (idCliente) {

            respuesta =
                await fetch(
                    "/clientes/"
                    + idCliente,
                    {

                        method: "PUT",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body:
                            JSON.stringify(
                                cliente
                            )
                    }
                );

        } else {

            respuesta =
                await fetch(
                    "/clientes",
                    {

                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body:
                            JSON.stringify(
                                cliente
                            )
                    }
                );
        }


        if (!respuesta.ok) {

            const texto =
                await respuesta.text();

            throw new Error(texto);
        }


        mensaje.textContent =
            idCliente
                ? "Cliente actualizado correctamente."
                : "Cliente registrado correctamente.";


        setTimeout(
            async () => {

                cerrarFormularioCliente();

                await cargarClientes();

            },
            600
        );

    } catch (error) {

        console.error(error);


        mensaje.textContent =
            "No fue posible guardar el cliente. Verifique que la identificación no esté registrada.";
    }
}


async function eliminarCliente(
    idCliente
) {

    const cliente =
        clientes.find(
            item =>
                Number(item.idCliente)
                === Number(idCliente)
        );


    if (!cliente) {

        alert(
            "No se encontró el cliente."
        );

        return;
    }


    const nombre =
        [
            cliente.nombres,
            cliente.apellidos
        ]
        .filter(Boolean)
        .join(" ");


    const confirmar =
        window.confirm(
            "¿Está seguro de eliminar al cliente "
            + nombre
            + "?"
        );


    if (!confirmar) {
        return;
    }


    try {

        const respuesta =
            await fetch(
                "/clientes/"
                + idCliente,
                {
                    method: "DELETE"
                }
            );


        if (!respuesta.ok) {

            throw new Error(
                "No se pudo eliminar"
            );
        }


        await cargarClientes();


    } catch (error) {

        console.error(error);


        alert(
            "No fue posible eliminar el cliente. Puede tener órdenes, instalaciones u otros registros asociados."
        );
    }
}


function escaparHTML(valor) {

    return String(valor)
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

function crearOrdenCliente(idCliente) {
    window.location.href = "ordenes.html?cliente=" + idCliente;
}

function verHistorialCliente(idCliente) {
    const cliente = clientes.find(c => Number(c.idCliente) === Number(idCliente));
    const numeroDocumento = cliente?.numeroDocumento ?? "";
    window.location.href = "asistencias.html?documento=" + encodeURIComponent(numeroDocumento);
}

function verFichaCliente(idCliente) { window.location.href = "ficha-cliente.html?id=" + idCliente; }
