const s = JSON.parse(localStorage.getItem('usuario'));

if (!s) {
    location.href = '/';
}

const admin =
    String(s.nombreRol || '').toUpperCase() === 'ADMINISTRADOR';

let clientes = [];
let ordenes = [];
let asistencias = [];
let fallas = [];
let soluciones = [];
let materiales = [];
let af = [];
let asol = [];
let dm = [];
let relaciones = [];

let clienteFichaActual = null;


/* =========================================================
   INICIO
========================================================= */

document.addEventListener('DOMContentLoaded', async () => {

    try {

        await cargar();

        const q =
            new URLSearchParams(location.search).get('q');

        if (q) {

            document.getElementById('q').value = q;

            buscar();
        }

    } catch (err) {

        console.error(err);

        feedback(
            'No fue posible cargar la información del sistema.',
            true
        );
    }
});


document
    .getElementById('q')
    ?.addEventListener('keydown', e => {

        if (e.key === 'Enter') {
            buscar();
        }
    });


/* =========================================================
   CARGAR INFORMACIÓN
========================================================= */

async function cargar() {

    const urls = [
        '/clientes',
        '/ordenes-servicio',
        '/asistencias-tecnicas',
        '/tipos-falla',
        '/soluciones',
        '/materiales',
        '/asistencia-fallas',
        '/asistencia-soluciones',
        '/detalle-materiales',
        '/tipo-falla-soluciones'
    ];

    const rs =
        await Promise.all(
            urls.map(u => fetch(u))
        );

    if (rs.some(r => !r.ok)) {
        throw new Error('Carga incompleta');
    }

    [
        clientes,
        ordenes,
        asistencias,
        fallas,
        soluciones,
        materiales,
        af,
        asol,
        dm,
        relaciones
    ] =
        await Promise.all(
            rs.map(r => r.json())
        );
}


/* =========================================================
   BUSCAR USUARIO
========================================================= */

function buscar() {

    const q =
        document.getElementById('q').value.trim();

    if (!q) {

        ocultarFicha();

        return feedback(
            'Ingrese la cédula del usuario.',
            true
        );
    }


    const c =
        clientes.find(
            x =>
                String(x.numeroDocumento || '').trim()
                ===
                q
        );


    if (!c) {

        ocultarFicha();

        return feedback(
            'No se encontró un usuario con esa cédula.',
            true
        );
    }


    feedback('');

    mostrarFicha(c);
}


/* =========================================================
   MOSTRAR FICHA
========================================================= */

function mostrarFicha(c) {

    clienteFichaActual = c;

    document.getElementById('estadoInicial').style.display =
        'none';

    document.getElementById('fichaUsuario').style.display =
        'block';


    document.getElementById('nombreFicha').textContent =
        nombre(c);

    document.getElementById('documentoFicha').textContent =
        `Cédula / identificación: ${c.numeroDocumento || '—'}`;


    const ord =
        ordenes.filter(
            o =>
                Number(o.idCliente)
                ===
                Number(c.idCliente)
        );


    const idsO =
        new Set(
            ord.map(o => Number(o.idOrden))
        );


    const ats =
        asistencias
            .filter(
                a =>
                    idsO.has(Number(a.idOrden))
                    &&
                    estado(a) !== 'ANULADA'
            )
            .sort(
                (a, b) =>
                    String(b.fechaAsistencia || '')
                        .localeCompare(
                            String(a.fechaAsistencia || '')
                        )
            );


    const ultima =
        ats.length
            ? fechaES(ats[0].fechaAsistencia)
            : '—';


    const rec =
        calcularReincidencias(ats);


    const abierta =
        buscarOrdenAbierta(c.idCliente);


    document.getElementById('resumen').innerHTML = `

        <div>
            <span>Nombre</span>
            <strong>${e(nombre(c))}</strong>
        </div>

        <div>
            <span>Identificación</span>
            <strong>${e(c.numeroDocumento)}</strong>
        </div>

        <div>
            <span>Total de atenciones</span>
            <strong>${ats.length}</strong>
        </div>

        <div>
            <span>Última atención</span>
            <strong>${e(ultima)}</strong>
        </div>

        <div>
            <span>Órdenes registradas</span>
            <strong>${ord.length}</strong>
        </div>

        <div>
            <span>Fallas reincidentes</span>
            <strong>${rec.length}</strong>
        </div>

    `;


    renderOrdenAbierta(abierta);

    renderReincidencias(rec);

    renderHistorial(ord);
}


/* =========================================================
   BUSCAR ORDEN ABIERTA DEL USUARIO
========================================================= */

function buscarOrdenAbierta(idCliente) {

    const abiertas =
        ordenes
            .filter(o => {

                if (
                    Number(o.idCliente)
                    !==
                    Number(idCliente)
                ) {
                    return false;
                }

                const st =
                    estadoOrden(o);

                return (
                    st === 'PENDIENTE'
                    ||
                    st === 'EN PROCESO'
                );
            })
            .sort(
                (a, b) =>
                    Number(b.idOrden || 0)
                    -
                    Number(a.idOrden || 0)
            );


    return abiertas.length
        ? abiertas[0]
        : null;
}


/* =========================================================
   MOSTRAR ORDEN ABIERTA
========================================================= */

function renderOrdenAbierta(orden) {

    /*
     * No necesitamos modificar historial.html.
     * Insertamos dinámicamente el aviso antes del historial.
     */

    let contenedor =
        document.getElementById('ordenAbiertaAviso');


    if (!contenedor) {

        contenedor =
            document.createElement('div');

        contenedor.id =
            'ordenAbiertaAviso';


        const resultados =
            document.getElementById('resultados');

        if (resultados?.parentElement) {

            resultados.parentElement.insertBefore(
                contenedor,
                resultados
            );
        }
    }


    if (!orden) {

        contenedor.innerHTML = '';

        contenedor.style.display =
            'none';

        return;
    }


    const st =
        estadoOrden(orden);


    contenedor.style.display =
        'block';


    contenedor.innerHTML = `

        <article class="history-card"
                 style="border:2px solid #d99b20;margin-bottom:20px;">

            <div class="history-top">

                <div>

                    <span class="muted">
                        ORDEN ABIERTA
                    </span>

                    <strong>
                        Orden ${e(orden.numeroOrden)}
                    </strong>

                </div>

                <span class="status-pill warn">
                    ${e(st)}
                </span>

            </div>

            <p>
                <b>Motivo reportado:</b>
                ${e(orden.descripcionProblema)}
            </p>

            <p>
                Esta orden todavía no está cerrada.
                Debe continuarse antes de registrar
                una nueva orden para este usuario.
            </p>

            <button
                type="button"
                class="secondary-action"
                onclick="retomarOrden(${Number(orden.idOrden)})">

                Retomar atención

            </button>

        </article>

    `;
}


/* =========================================================
   RETOMAR ORDEN
========================================================= */

function retomarOrden(idOrden) {

    const orden =
        ordenes.find(
            o =>
                Number(o.idOrden)
                ===
                Number(idOrden)
        );


    if (!orden) {

        alert(
            'No fue posible encontrar la orden.'
        );

        return;
    }


    const st =
        estadoOrden(orden);


    if (
        st !== 'PENDIENTE'
        &&
        st !== 'EN PROCESO'
    ) {

        alert(
            'Esta orden ya no se encuentra abierta.'
        );

        return;
    }


    /*
     * Enviamos el ID de la orden.
     * registro-atencion.js cargará la información.
     */

    location.href =
        `registro-atencion.html?retomar=${encodeURIComponent(idOrden)}`;
}


/* =========================================================
   COMPONENTE PARA REINCIDENCIAS
========================================================= */

function componente(f) {

    const c =
        String(f?.categoria || '').trim();


    const permitidos = [
        'Cableado',
        'Antena',
        'Amplificador',
        'Decodificador',
        'LNB',
        'TAP',
        'TAP/Amplificador',
        'Conectores'
    ];


    return permitidos.includes(c)
        ? c
        : null;
}


/* =========================================================
   CALCULAR REINCIDENCIAS
========================================================= */

function calcularReincidencias(ats) {

    const idsA =
        new Set(
            ats.map(
                a => Number(a.idAsistencia)
            )
        );


    const grupos = {};


    af
        .filter(
            x =>
                idsA.has(
                    Number(x.idAsistencia)
                )
        )
        .forEach(x => {

            const f =
                fallas.find(
                    z =>
                        Number(z.idTipoFalla)
                        ===
                        Number(x.idTipoFalla)
                );


            const comp =
                componente(f);


            if (!comp) {
                return;
            }


            const a =
                asistencias.find(
                    z =>
                        Number(z.idAsistencia)
                        ===
                        Number(x.idAsistencia)
                );


            if (!grupos[comp]) {
                grupos[comp] = [];
            }


            grupos[comp].push({

                fecha:
                    a?.fechaAsistencia,

                falla:
                    f?.nombreFalla || 'Falla',

                idFalla:
                    Number(x.idTipoFalla)
            });
        });


    return Object
        .entries(grupos)
        .filter(
            ([, visitas]) =>
                visitas.length > 1
        )
        .map(
            ([comp, visitas]) => {

                const solIds = [

                    ...new Set(

                        visitas.flatMap(v =>

                            relaciones
                                .filter(
                                    r =>
                                        Number(r.idTipoFalla)
                                        ===
                                        v.idFalla
                                )
                                .map(
                                    r =>
                                        Number(r.idSolucion)
                                )
                        )
                    )
                ];


                return {

                    nombre:
                        comp,

                    veces:
                        visitas.length,

                    fechas: [
                        ...new Set(
                            visitas
                                .map(v => v.fecha)
                                .filter(Boolean)
                        )
                    ]
                        .sort()
                        .reverse(),

                    fallas: [
                        ...new Set(
                            visitas.map(v => v.falla)
                        )
                    ],

                    posibles:
                        solIds
                            .map(
                                id =>
                                    soluciones.find(
                                        x =>
                                            Number(x.idSolucion)
                                            ===
                                            id
                                    )?.nombreSolucion
                            )
                            .filter(Boolean)
                };
            }
        )
        .sort(
            (a, b) =>
                b.veces - a.veces
        );
}


/* =========================================================
   MOSTRAR REINCIDENCIAS
========================================================= */

function renderReincidencias(rec) {

    const out =
        document.getElementById('reincidencias');


    if (!rec.length) {

        out.innerHTML = `

            <div class="no-recurrence">

                <strong>
                    No se detectan fallas reincidentes.
                </strong>

                <span>
                    Con los registros actuales,
                    ninguna falla se ha repetido
                    más de una vez.
                </span>

            </div>
        `;

        return;
    }


    out.innerHTML = `

        <div class="recurrence-list">

            ${rec.map(r => `

                <article class="recurrence-item">

                    <div class="recurrence-count">

                        ${r.veces}

                        <small>
                            veces
                        </small>

                    </div>

                    <div>

                        <h3>
                            ${e(r.nombre)}
                        </h3>

                        <p>
                            <b>Fallas relacionadas:</b>
                            ${e(r.fallas.join(' · '))}
                        </p>

                        <p>
                            <b>Fechas:</b>
                            ${e(
                                r.fechas
                                    .map(fechaES)
                                    .join(' · ')
                            )}
                        </p>

                        <p>
                            <b>Posibles soluciones del catálogo:</b>

                            ${e(
                                r.posibles.join(' · ')
                                ||
                                'Sin soluciones asociadas en el catálogo'
                            )}

                        </p>

                    </div>

                </article>

            `).join('')}

        </div>
    `;
}


/* =========================================================
   HISTORIAL
========================================================= */

function renderHistorial(ord) {

    const out =
        document.getElementById('resultados');

    const items = [];


    ord.forEach(o => {

        const aa =
            asistencias.filter(
                a =>
                    Number(a.idOrden)
                    ===
                    Number(o.idOrden)
            );


        if (!aa.length) {

            items.push({
                o,
                a: null
            });

        } else {

            aa.forEach(a =>
                items.push({
                    o,
                    a
                })
            );
        }
    });


    items.sort(
        (x, y) =>
            String(
                y.a?.fechaAsistencia
                ||
                y.o.fechaReporte
                ||
                ''
            )
                .localeCompare(
                    String(
                        x.a?.fechaAsistencia
                        ||
                        x.o.fechaReporte
                        ||
                        ''
                    )
                )
    );


    if (!items.length) {

        out.innerHTML = `

            <p class="empty-state">
                Este usuario todavía no tiene
                órdenes ni atenciones registradas.
            </p>
        `;

        return;
    }


    const botonesMostrados =
        new Set();


    out.innerHTML =
        items.map(({ o, a }) => {

            const estadoO =
                estadoOrden(o);

            const resuelta =
                estadoO === 'RESUELTO';


            const mostrarEliminar =
                admin
                &&
                resuelta
                &&
                !botonesMostrados.has(
                    Number(o.idOrden)
                );


            if (mostrarEliminar) {

                botonesMostrados.add(
                    Number(o.idOrden)
                );
            }


            const botonEliminar =
                mostrarEliminar
                    ? `
                        <button
                            class="danger-outline"
                            onclick="eliminarOrden(
                                ${o.idOrden},
                                '${e(o.numeroOrden)}'
                            )">
                            Eliminar orden
                        </button>
                      `
                    : '';


            /*
             * Botón retomar solo para órdenes abiertas.
             * Se muestra una sola vez por orden.
             */

            let botonRetomar = '';


            if (
                (
                    estadoO === 'PENDIENTE'
                    ||
                    estadoO === 'EN PROCESO'
                )
                &&
                !botonesMostrados.has(
                    `retomar-${o.idOrden}`
                )
            ) {

                botonesMostrados.add(
                    `retomar-${o.idOrden}`
                );


                botonRetomar = `

                    <button
                        class="secondary-action"
                        onclick="retomarOrden(${o.idOrden})">

                        Retomar atención

                    </button>
                `;
            }


            if (!a) {

                return `

                    <article class="history-card">

                        <div class="history-top">

                            <div>

                                <span class="muted">
                                    ${e(
                                        fechaHoraES(
                                            o.fechaReporte
                                        )
                                    )}
                                </span>

                                <strong>
                                    Orden ${e(o.numeroOrden)}
                                </strong>

                            </div>

                            <div class="history-actions">

                                <span class="status-pill warn">
                                    ${e(estadoO)}
                                </span>

                                ${botonRetomar}

                                ${botonEliminar}

                            </div>

                        </div>

                        <p>
                            <b>Motivo reportado:</b>
                            ${e(o.descripcionProblema)}
                        </p>

                        <p class="muted">
                            Aún no tiene atención técnica registrada.
                        </p>

                    </article>
                `;
            }


            const ff =
                af
                    .filter(
                        x =>
                            Number(x.idAsistencia)
                            ===
                            Number(a.idAsistencia)
                    )
                    .map(
                        x =>
                            fallas.find(
                                f =>
                                    Number(f.idTipoFalla)
                                    ===
                                    Number(x.idTipoFalla)
                            )
                    )
                    .filter(Boolean);


            const ss =
                asol
                    .filter(
                        x =>
                            Number(x.idAsistencia)
                            ===
                            Number(a.idAsistencia)
                    )
                    .map(
                        x =>
                            soluciones.find(
                                z =>
                                    Number(z.idSolucion)
                                    ===
                                    Number(x.idSolucion)
                            )?.nombreSolucion
                    )
                    .filter(Boolean);


            const mm =
                dm
                    .filter(
                        x =>
                            Number(x.idAsistencia)
                            ===
                            Number(a.idAsistencia)
                    )
                    .map(x => {

                        const m =
                            materiales.find(
                                z =>
                                    Number(z.idMaterial)
                                    ===
                                    Number(x.idMaterial)
                            );


                        return m
                            ? `${m.nombreMaterial} (${x.cantidadUtilizada} ${m.unidadMedida || ''})`
                            : '';
                    })
                    .filter(Boolean);


            const st =
                estado(a);


            const componentes = [
                ...new Set(
                    ff
                        .map(componente)
                        .filter(Boolean)
                )
            ];


            return `

                <article class="history-card">

                    <div class="history-top">

                        <div>

                            <span class="muted">
                                ${e(
                                    fechaES(
                                        a.fechaAsistencia
                                    )
                                )}
                            </span>

                            <strong>
                                Orden ${e(o.numeroOrden)}
                            </strong>

                        </div>


                        <div class="history-actions">

                            <span class="status-pill ${
                                st === 'RESUELTO'
                                    ? 'ok'
                                    : st === 'ANULADA'
                                        ? ''
                                        : 'warn'
                            }">

                                ${e(st)}

                            </span>

                            ${botonRetomar}

                            ${botonEliminar}

                        </div>

                    </div>


                    <div class="history-grid">

                        <p>
                            <b>Motivo:</b>
                            ${e(o.descripcionProblema)}
                        </p>

                        <p>
                            <b>Técnico:</b>
                            ${e(
                                a.tecnicoNombreRegistro
                                ||
                                '—'
                            )}
                        </p>

                        <p>
                            <b>Componente:</b>
                            ${e(
                                componentes.join(', ')
                                ||
                                '—'
                            )}
                        </p>

                        <p>
                            <b>Falla:</b>
                            ${e(
                                ff
                                    .map(
                                        f => f.nombreFalla
                                    )
                                    .join(', ')
                                ||
                                a.diagnostico
                                ||
                                '—'
                            )}
                        </p>

                        <p>
                            <b>Solución:</b>
                            ${e(
                                ss.join(', ')
                                ||
                                '—'
                            )}
                        </p>

                        <p>
                            <b>Materiales:</b>
                            ${e(
                                mm.join(', ')
                                ||
                                'Sin material registrado'
                            )}
                        </p>

                    </div>


                    ${
                        a.observaciones
                            ? `
                                <p class="history-observation">
                                    <b>Observaciones:</b>
                                    ${e(a.observaciones)}
                                </p>
                              `
                            : ''
                    }

                    ${
                        st === 'ANULADA'
                        &&
                        a.motivoAnulacion
                            ? `
                                <p class="history-observation">
                                    <b>Motivo de anulación:</b>
                                    ${e(a.motivoAnulacion)}
                                </p>
                              `
                            : ''
                    }

                </article>
            `;

        }).join('');
}


/* =========================================================
   ELIMINAR ORDEN RESUELTA
========================================================= */

async function eliminarOrden(id, numero) {

    if (!admin) {
        return;
    }


    if (
        !confirm(
            `¿Eliminar definitivamente la orden ${numero}?\n\n`
            +
            `Esta acción elimina también su atención, fallas, `
            +
            `soluciones y materiales asociados y no se puede deshacer.`
        )
    ) {
        return;
    }


    const r =
        await fetch(
            `/admin/ordenes/${id}`,
            {
                method: 'DELETE',

                headers: {
                    'X-User-Role':
                        s.nombreRol || ''
                }
            }
        );


    if (!r.ok) {

        let msg =
            'No fue posible eliminar la orden.';


        try {

            const j =
                await r.json();

            if (j.error) {
                msg = j.error;
            }

        } catch (_) {}


        alert(msg);

        return;
    }


    await cargar();

    buscar();
}


/* =========================================================
   ANULAR ASISTENCIA
========================================================= */

async function anular(id) {

    if (!admin) {
        return;
    }


    const motivo =
        prompt(
            'Indique el motivo de la anulación:'
        );


    if (
        !motivo
        ||
        !motivo.trim()
    ) {
        return;
    }


    const a =
        asistencias.find(
            x =>
                Number(x.idAsistencia)
                ===
                Number(id)
        );


    if (!a) {

        alert(
            'No fue posible encontrar la atención.'
        );

        return;
    }


    const payload = {

        ...a,

        estadoServicio:
            'ANULADA',

        resultadoServicio:
            'ANULADA',

        motivoAnulacion:
            motivo.trim(),

        fechaAnulacion:
            new Date().toISOString(),

        anuladoPor:
            s.nombreUsuario
            ||
            s.correo
            ||
            'ADMINISTRADOR'
    };


    const r =
        await fetch(
            `/asistencias-tecnicas/${id}`,
            {
                method: 'PUT',

                headers: {
                    'Content-Type':
                        'application/json'
                },

                body:
                    JSON.stringify(payload)
            }
        );


    if (!r.ok) {

        alert(
            'No fue posible anular el registro.'
        );

        return;
    }


    await cargar();

    buscar();
}


/* =========================================================
   NUEVA BÚSQUEDA
========================================================= */

function nuevaBusqueda() {

    document.getElementById('q').value =
        '';

    ocultarFicha();

    feedback('');

    document.getElementById('q').focus();
}


/* =========================================================
   OCULTAR FICHA
========================================================= */

function ocultarFicha() {

    clienteFichaActual = null;

    document.getElementById('fichaUsuario').style.display =
        'none';

    document.getElementById('estadoInicial').style.display =
        'block';
}


/* =========================================================
   MENSAJES
========================================================= */

function feedback(t, error = false) {

    const m =
        document.getElementById('mensajeBusqueda');

    m.textContent = t;

    m.className =
        'search-feedback'
        +
        (error ? ' error' : '');
}


/* =========================================================
   FECHAS
========================================================= */

function fechaES(v) {

    if (!v) {
        return '—';
    }


    const p =
        String(v)
            .slice(0, 10)
            .split('-');


    return p.length === 3
        ? `${p[2]}/${p[1]}/${p[0]}`
        : String(v);
}


function fechaHoraES(v) {

    return fechaES(v);
}


/* =========================================================
   ESTADOS
========================================================= */

function estado(a) {

    let v =
        String(
            a?.resultadoServicio
            ||
            a?.estadoServicio
            ||
            'PENDIENTE'
        )
            .trim()
            .toUpperCase();


    if (v === 'FINALIZADO') {
        return 'RESUELTO';
    }


    if (v === 'ANULADO') {
        return 'ANULADA';
    }


    return v;
}


function estadoOrden(o) {

    let v =
        String(
            o?.estado
            ||
            'PENDIENTE'
        )
            .trim()
            .toUpperCase();


    if (
        v === 'CERRADA'
        ||
        v === 'FINALIZADO'
    ) {
        return 'RESUELTO';
    }


    if (v === 'ANULADO') {
        return 'ANULADA';
    }


    return v;
}


/* =========================================================
   NOMBRE CLIENTE
========================================================= */

function nombre(c) {

    return c
        ? `${c.nombres || ''} ${c.apellidos || ''}`.trim()
        : '—';
}


/* =========================================================
   ESCAPAR HTML
========================================================= */

function e(x) {

    return String(x ?? '—')
        .replace(
            /[&<>"']/g,
            c => ({
                '&': '&amp;',
                '<': '&lt;',
                '>': '&gt;',
                '"': '&quot;',
                "'": '&#39;'
            }[c])
        );
}