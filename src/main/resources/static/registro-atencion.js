const sesion = JSON.parse(localStorage.getItem('usuario'));
if (!sesion) location.href = '/';

let clientes = [],
    tecnicos = [],
    fallas = [],
    soluciones = [],
    relaciones = [],
    materiales = [],
    ordenes = [];

let clienteActual = null;
let materialRowId = 0;
let ordenRetomada = null;

const materialesOcultos = new Set([
  "Tarjeta principal de decodificador",
  "Tarjeta/fuente de alimentación de decodificador",
  "Puerto/conector HDMI para decodificador",
  "Puerto/conector de video AV/RCA",
  "Fuente/adaptador de corriente para decodificador"
]);


/* =========================================================
   INICIO
========================================================= */

document.addEventListener('DOMContentLoaded', async () => {

  const fechaAtencion =
    document.getElementById('fechaAtencion');

  if (fechaAtencion) {
    fechaAtencion.value =
      new Date().toISOString().slice(0, 10);
  }

  actualizarCamposResultado();

  try {

    const urls = [
      '/clientes',
      '/tecnicos',
      '/tipos-falla',
      '/soluciones',
      '/tipo-falla-soluciones',
      '/materiales',
      '/ordenes-servicio'
    ];

    const rs =
      await Promise.all(
        urls.map(u => fetch(u))
      );

    if (rs.some(r => !r.ok)) {
      throw new Error(
        'No fue posible cargar toda la información.'
      );
    }

    [
      clientes,
      tecnicos,
      fallas,
      soluciones,
      relaciones,
      materiales,
      ordenes
    ] =
      await Promise.all(
        rs.map(r => r.json())
      );

    cargarCatalogos();
    agregarMaterial();

    /*
     * Si venimos desde:
     * historial.html -> Retomar atención
     *
     * la URL será:
     * registro-atencion.html?retomar=ID
     */

    const idRetomar =
      new URLSearchParams(
        location.search
      ).get('retomar');

    if (idRetomar) {

      cargarOrdenParaRetomar(
        Number(idRetomar)
      );
    }

  } catch (e) {

    console.error(e);

    mensaje(
      'No fue posible cargar los catálogos del sistema.',
      false
    );
  }
});


/* =========================================================
   CATÁLOGOS
========================================================= */

function cargarCatalogos() {

  const activas =
    fallas
      .filter(
        f => f.estado !== false
      )
      .sort(
        (a, b) =>
          (a.categoria || '')
            .localeCompare(
              b.categoria || ''
            )
          ||
          (a.nombreFalla || '')
            .localeCompare(
              b.nombreFalla || ''
            )
      );

  const select =
    document.getElementById('falla');

  if (select) {

    select.innerHTML =
      '<option value="">Seleccione una falla</option>'
      +
      activas
        .map(
          f =>
            `<option value="${f.idTipoFalla}">
              ${esc(f.categoria || 'General')} · ${esc(f.nombreFalla)}
            </option>`
        )
        .join('');
  }

  filtrarSoluciones();
}


/* =========================================================
   CLIENTE
========================================================= */

function buscarCliente() {

  const doc =
    v('numeroDocumento');

  if (!doc) {
    return;
  }

  clienteActual =
    clientes.find(
      c =>
        String(
          c.numeroDocumento || ''
        ).trim() === doc
    )
    || null;


  if (clienteActual) {

    cargarDatosCliente(
      clienteActual
    );


    const abierta =
      buscarOrdenAbiertaCliente(
        clienteActual.idCliente
      );


    if (abierta) {

      document
        .getElementById('estadoBusqueda')
        .textContent =
          `Este usuario tiene la orden ${abierta.numeroOrden} ${textoEstado(abierta.estado)}. Debe retomarla antes de crear una nueva orden.`;

      document
        .getElementById('estadoBusqueda')
        .className =
          'helper-info';


      /*
       * Si el usuario intenta escribir
       * directamente el mismo número,
       * lo reconocemos como continuación.
       */

      const numeroOrden =
        document.getElementById(
          'numeroOrden'
        );

      if (
        numeroOrden
        &&
        !numeroOrden.value
      ) {

        numeroOrden.placeholder =
          `Orden abierta: ${abierta.numeroOrden}`;
      }

    } else {

      document
        .getElementById('estadoBusqueda')
        .textContent =
          'Usuario encontrado. Datos cargados automáticamente. No tiene órdenes pendientes.';

      document
        .getElementById('estadoBusqueda')
        .className =
          'helper-ok';
    }

  } else {

    clienteActual = null;

    limpiarDatosCliente();

    document
      .getElementById('estadoBusqueda')
      .textContent =
        'Usuario nuevo. Complete sus datos una sola vez.';

    document
      .getElementById('estadoBusqueda')
      .className =
        'helper-info';
  }
}


/* =========================================================
   CARGAR DATOS CLIENTE
========================================================= */

function cargarDatosCliente(cliente) {

  const campos = [
    'nombres',
    'apellidos',
    'telefono',
    'correo',
    'direccion',
    'barrio',
    'ciudad',
    'departamento'
  ];

  campos.forEach(k => {

    const elemento =
      document.getElementById(k);

    if (elemento) {

      elemento.value =
        cliente[k] || '';
    }
  });
}


/* =========================================================
   LIMPIAR DATOS CLIENTE
========================================================= */

function limpiarDatosCliente() {

  [
    'nombres',
    'apellidos',
    'telefono',
    'correo',
    'direccion',
    'barrio',
    'ciudad',
    'departamento'
  ].forEach(k => {

    const elemento =
      document.getElementById(k);

    if (elemento) {
      elemento.value = '';
    }
  });
}


/* =========================================================
   BUSCAR ORDEN ABIERTA DEL CLIENTE
========================================================= */

function buscarOrdenAbiertaCliente(idCliente) {

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

        const estado =
          normalizarEstadoOrden(
            o.estado
          );

        return (
          estado === 'PENDIENTE'
          ||
          estado === 'EN PROCESO'
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
   RETOMAR ORDEN
========================================================= */

function cargarOrdenParaRetomar(idOrden) {

  const orden =
    ordenes.find(
      o =>
        Number(o.idOrden)
        ===
        Number(idOrden)
    );


  if (!orden) {

    mensaje(
      'No se encontró la orden que intenta retomar.',
      false
    );

    return;
  }


  const estado =
    normalizarEstadoOrden(
      orden.estado
    );


  if (
    estado !== 'PENDIENTE'
    &&
    estado !== 'EN PROCESO'
  ) {

    mensaje(
      'Esta orden ya no se encuentra abierta y no puede retomarse.',
      false
    );

    return;
  }


  const cliente =
    clientes.find(
      c =>
        Number(c.idCliente)
        ===
        Number(orden.idCliente)
    );


  if (!cliente) {

    mensaje(
      'No se encontró el usuario asociado a esta orden.',
      false
    );

    return;
  }


  ordenRetomada =
    orden;

  clienteActual =
    cliente;


  const documento =
    document.getElementById(
      'numeroDocumento'
    );

  if (documento) {

    documento.value =
      cliente.numeroDocumento || '';

    documento.readOnly =
      true;
  }


  cargarDatosCliente(
    cliente
  );


  const numeroOrden =
    document.getElementById(
      'numeroOrden'
    );

  if (numeroOrden) {

    numeroOrden.value =
      orden.numeroOrden || '';

    numeroOrden.readOnly =
      true;
  }


  const tipoServicio =
    document.getElementById(
      'tipoServicio'
    );

  if (
    tipoServicio
    &&
    orden.tipoServicio
  ) {

    /*
     * Si es select y existe la opción,
     * se selecciona.
     */

    const existe =
      [...tipoServicio.options || []]
        .some(
          op =>
            String(op.value)
            ===
            String(orden.tipoServicio)
        );

    if (existe) {

      tipoServicio.value =
        orden.tipoServicio;
    }
  }


  const motivo =
    document.getElementById(
      'motivo'
    );

  if (motivo) {

    motivo.value =
      orden.descripcionProblema || '';
  }


  const estadoBusqueda =
    document.getElementById(
      'estadoBusqueda'
    );

  if (estadoBusqueda) {

    estadoBusqueda.textContent =
      `Retomando orden ${orden.numeroOrden} · ${estado}. Esta atención continuará sobre la misma orden.`;

    estadoBusqueda.className =
      'helper-ok';
  }


  mensaje(
    `Orden ${orden.numeroOrden} cargada para continuar la atención.`,
    true
  );
}


/* =========================================================
   SOLUCIONES SEGÚN FALLA
========================================================= */

function filtrarSoluciones() {

  const id =
    Number(
      v('falla')
    );


  let lista =
    soluciones.filter(
      s => s.estado !== false
    );


  if (id) {

    const permitidas =
      new Set(
        relaciones
          .filter(
            r =>
              Number(r.idTipoFalla)
              ===
              id
          )
          .map(
            r =>
              Number(r.idSolucion)
          )
      );


    if (permitidas.size) {

      lista =
        lista.filter(
          s =>
            permitidas.has(
              Number(s.idSolucion)
            )
        );
    }
  }


  lista.sort(
    (a, b) =>
      (a.nombreSolucion || '')
        .localeCompare(
          b.nombreSolucion || ''
        )
  );


  const select =
    document.getElementById(
      'solucion'
    );


  if (select) {

    select.innerHTML =
      '<option value="">Seleccione una solución</option>'
      +
      lista
        .map(
          s =>
            `<option value="${s.idSolucion}">
              ${esc(s.nombreSolucion)}
            </option>`
        )
        .join('');
  }
}


/* =========================================================
   CAMBIO DE RESULTADO
========================================================= */

function actualizarCamposResultado() {

  const resultado =
    v('resultado');


  const contenedor =
    document.getElementById(
      'campoMotivoEstado'
    );

  const motivo =
    document.getElementById(
      'motivoEstado'
    );

  const label =
    document.getElementById(
      'labelMotivoEstado'
    );

  const ayuda =
    document.getElementById(
      'ayudaMotivoEstado'
    );


  /*
   * Evita error si el navegador
   * todavía tiene una versión vieja
   * del HTML.
   */

  if (
    !contenedor
    ||
    !motivo
    ||
    !label
    ||
    !ayuda
  ) {

    return;
  }


  contenedor.style.display =
    'none';

  motivo.required =
    false;


  if (
    resultado === 'PENDIENTE'
  ) {

    contenedor.style.display =
      '';

    motivo.required =
      true;

    label.textContent =
      'Motivo por el cual queda pendiente *';

    motivo.placeholder =
      'Ej. Se requiere una nueva visita o material adicional.';

    ayuda.textContent =
      'La orden podrá retomarse posteriormente.';
  }


  else if (
    resultado === 'EN PROCESO'
  ) {

    contenedor.style.display =
      '';

    motivo.required =
      true;

    label.textContent =
      'Motivo por el cual queda en proceso *';

    motivo.placeholder =
      'Ej. Diagnóstico iniciado; se requiere continuar la intervención.';

    ayuda.textContent =
      'La orden permanecerá abierta y podrá continuarse.';
  }


  else if (
    resultado === 'ANULADA'
  ) {

    contenedor.style.display =
      '';

    motivo.required =
      true;

    label.textContent =
      'Motivo de anulación *';

    motivo.placeholder =
      'Explique por qué se anula la orden.';

    ayuda.textContent =
      'La orden quedará anulada y no se contará como solucionada.';
  }
}


/* =========================================================
   MATERIALES
========================================================= */

function agregarMaterial() {

  const id =
    ++materialRowId;


  const activos =
    materiales
      .filter(
        m =>
          m.estado !== false
          &&
          !materialesOcultos.has(
            m.nombreMaterial
          )
      )
      .sort(
        (a, b) =>
          (a.nombreMaterial || '')
            .localeCompare(
              b.nombreMaterial || ''
            )
      );


  const row =
    document.createElement(
      'div'
    );


  row.className =
    'material-row';

  row.dataset.row =
    id;


  row.innerHTML = `

    <div class="field material-select">

      <label>
        Material
      </label>

      <select class="material-id">

        <option value="">
          Seleccione material
        </option>

        <option value="SIN_MATERIAL">
          Sin material utilizado
        </option>

        ${activos.map(m => `

          <option value="${m.idMaterial}">

            ${esc(m.nombreMaterial)}

            ${
              m.unidadMedida
                ? ' · ' + esc(m.unidadMedida)
                : ''
            }

          </option>

        `).join('')}

      </select>

    </div>


    <div class="field material-qty">

      <label>
        Cantidad
      </label>

      <input
        class="material-cantidad"
        type="number"
        min="0.01"
        step="0.01"
        placeholder="0">

    </div>


    <div class="field material-note">

      <label>
        Observación
      </label>

      <input
        class="material-observacion"
        placeholder="Opcional">

    </div>


    <button
      type="button"
      class="remove-material"
      title="Quitar"
      onclick="this.parentElement.remove()">

      ×

    </button>
  `;


  document
    .getElementById(
      'materialRows'
    )
    .appendChild(row);
}


/* =========================================================
   GUARDAR ATENCIÓN
========================================================= */

async function guardarAtencion(ev) {

  ev.preventDefault();


  const btn =
    document.getElementById(
      'btnGuardar'
    );


  btn.disabled =
    true;


  mensaje(
    'Guardando registro completo...',
    true
  );


  try {

    const numeroOrden =
      v('numeroOrden');

    const resultado =
      v('resultado');

    const motivoEstado =
      v('motivoEstado');

    const solucionSeleccionada =
      v('solucion');

    const fallaSeleccionada =
      v('falla');

    const documento =
      v('numeroDocumento');


    /* =====================================================
       VALIDACIONES BÁSICAS
    ===================================================== */

    if (!numeroOrden) {

      throw new Error(
        'Debe ingresar el número de orden.'
      );
    }


    if (!documento) {

      throw new Error(
        'Debe ingresar la identificación del usuario.'
      );
    }


    if (!resultado) {

      throw new Error(
        'Debe seleccionar el resultado de la atención.'
      );
    }


    if (
      !fallaSeleccionada
      &&
      resultado !== 'ANULADA'
    ) {

      throw new Error(
        'Debe seleccionar la falla encontrada.'
      );
    }


    if (
      resultado === 'RESUELTO'
      &&
      !solucionSeleccionada
    ) {

      throw new Error(
        'Para marcar la atención como resuelta debe seleccionar una solución aplicada.'
      );
    }


    if (
      [
        'PENDIENTE',
        'EN PROCESO',
        'ANULADA'
      ].includes(resultado)
      &&
      !motivoEstado
    ) {

      throw new Error(
        'Debe indicar el motivo del estado seleccionado.'
      );
    }


    /* =====================================================
       IDENTIFICAR CLIENTE EXISTENTE
    ===================================================== */

    const clienteExistente =
      clientes.find(
        c =>
          String(
            c.numeroDocumento || ''
          ).trim()
          ===
          documento
      );


    /*
     * REGLA PRINCIPAL:
     *
     * Si el cliente ya tiene una orden
     * PENDIENTE o EN PROCESO, no puede
     * crear una segunda orden.
     */

    if (clienteExistente) {

      const abierta =
        buscarOrdenAbiertaCliente(
          clienteExistente.idCliente
        );


      if (abierta) {

        const esLaMismaOrden =
          (
            ordenRetomada
            &&
            Number(ordenRetomada.idOrden)
            ===
            Number(abierta.idOrden)
          )
          ||
          (
            String(
              abierta.numeroOrden || ''
            )
              .trim()
              .toLowerCase()
            ===
            numeroOrden
              .trim()
              .toLowerCase()
          );


        if (!esLaMismaOrden) {

          throw new Error(
            `Este usuario ya tiene la orden ${abierta.numeroOrden} ${textoEstado(abierta.estado)}. Debe retomarla desde la Ficha del usuario antes de registrar una nueva orden.`
          );
        }
      }
    }


    /* =====================================================
       BUSCAR ORDEN
    ===================================================== */

    let orden =
      ordenRetomada
      ||
      ordenes.find(
        o =>
          String(
            o.numeroOrden || ''
          )
            .trim()
            .toLowerCase()
          ===
          numeroOrden
            .trim()
            .toLowerCase()
      );


    /* =====================================================
       VALIDAR PROPIETARIO DE ORDEN
    ===================================================== */

    if (
      orden
      &&
      clienteExistente
      &&
      Number(orden.idCliente)
      !==
      Number(clienteExistente.idCliente)
    ) {

      throw new Error(
        'Ese número de orden pertenece a otro usuario.'
      );
    }


    /* =====================================================
       VALIDAR ESTADO DE ORDEN EXISTENTE
    ===================================================== */

    if (orden) {

      const estadoActual =
        normalizarEstadoOrden(
          orden.estado
        );


      if (
        estadoActual === 'RESUELTO'
      ) {

        throw new Error(
          'Esta orden ya está resuelta y cerrada. No puede registrarse una nueva atención sobre ella.'
        );
      }


      if (
        estadoActual === 'ANULADA'
      ) {

        throw new Error(
          'Esta orden está anulada y no puede retomarse.'
        );
      }


      if (
        estadoActual !== 'PENDIENTE'
        &&
        estadoActual !== 'EN PROCESO'
      ) {

        throw new Error(
          `La orden ${orden.numeroOrden} no se encuentra disponible para continuar.`
        );
      }
    }


    /* =====================================================
       PREPARAR CLIENTE
    ===================================================== */

    if (
      !clienteActual
      ||
      String(
        clienteActual.numeroDocumento
      ).trim()
      !==
      documento
    ) {

      await prepararCliente();

    } else {

      await actualizarClienteSiCambio();
    }


    /*
     * Segunda validación después de
     * preparar el cliente.
     */

    const abiertaCliente =
      buscarOrdenAbiertaCliente(
        clienteActual.idCliente
      );


    if (abiertaCliente) {

      const misma =
        orden
        &&
        Number(abiertaCliente.idOrden)
        ===
        Number(orden.idOrden);


      if (!misma) {

        throw new Error(
          `El usuario ya tiene la orden ${abiertaCliente.numeroOrden} ${textoEstado(abiertaCliente.estado)}. Debe finalizarla o anularla antes de crear otra.`
        );
      }
    }


    /* =====================================================
       TÉCNICO
    ===================================================== */

    const tecnicoTexto =
      v('tecnicoNombre');


    const tecnico =
      tecnicos.find(
        t =>
          normalizar(
            nombreTecnico(t)
          )
          ===
          normalizar(
            tecnicoTexto
          )
      );


    const ahora =
      new Date();


    const fecha =
      v('fechaAtencion');


    /* =====================================================
       ESTADO FINAL DE LA ORDEN
    ===================================================== */

    let estadoOrden;


    if (
      resultado === 'RESUELTO'
    ) {

      estadoOrden =
        'CERRADA';

    } else {

      estadoOrden =
        resultado;
    }


    const observacionOrden =
      resultado === 'RESUELTO'
        ?
          (
            v('observaciones')
            ||
            null
          )
        :
          (
            motivoEstado
            ||
            v('observaciones')
            ||
            null
          );


    /* =====================================================
       CREAR ORDEN NUEVA
    ===================================================== */

    if (!orden) {

      /*
       * Seguridad adicional:
       * justo antes de crear.
       */

      const abiertaAntesCrear =
        buscarOrdenAbiertaCliente(
          clienteActual.idCliente
        );


      if (abiertaAntesCrear) {

        throw new Error(
          `No puede crear otra orden. El usuario tiene abierta la orden ${abiertaAntesCrear.numeroOrden}.`
        );
      }


      const ordenPayload = {

        numeroOrden:
          numeroOrden,

        idCliente:
          clienteActual.idCliente,

        idInstalacion:
          null,

        idTecnicoAsignado:
          tecnico?.idTecnico
          ||
          null,

        tipoServicio:
          v('tipoServicio')
          ||
          'Asistencia técnica',

        descripcionProblema:
          v('motivo'),

        prioridad:
          'MEDIA',

        estado:
          estadoOrden,

        fechaAsignacion:
          null,

        fechaProgramada:
          null,

        fechaCierre:
          (
            resultado === 'RESUELTO'
            ||
            resultado === 'ANULADA'
          )
            ?
              ahora
                .toISOString()
                .slice(0, 19)
            :
              null,

        observacionesCierre:
          observacionOrden
      };


      orden =
        await postJson(
          '/ordenes-servicio',
          ordenPayload
        );


      ordenes.push(
        orden
      );
    }


    /* =====================================================
       ACTUALIZAR LA MISMA ORDEN
    ===================================================== */

    else {

      const ordenActualizada = {

        ...orden,

        /*
         * Conservamos siempre el cliente
         * original de la orden.
         */

        idCliente:
          orden.idCliente,

        idTecnicoAsignado:
          tecnico?.idTecnico
          ||
          orden.idTecnicoAsignado
          ||
          null,

        tipoServicio:
          v('tipoServicio')
          ||
          orden.tipoServicio
          ||
          'Asistencia técnica',

        /*
         * Conservamos el motivo original
         * de la orden si ya existía.
         */

        descripcionProblema:
          orden.descripcionProblema
          ||
          v('motivo'),

        prioridad:
          orden.prioridad
          ||
          'MEDIA',

        estado:
          estadoOrden,

        fechaCierre:
          (
            resultado === 'RESUELTO'
            ||
            resultado === 'ANULADA'
          )
            ?
              ahora
                .toISOString()
                .slice(0, 19)
            :
              null,

        observacionesCierre:
          observacionOrden
      };


      orden =
        await putJson(
          `/ordenes-servicio/${orden.idOrden}`,
          ordenActualizada
        );


      /*
       * Actualizamos también la copia
       * en memoria.
       */

      const indice =
        ordenes.findIndex(
          o =>
            Number(o.idOrden)
            ===
            Number(orden.idOrden)
        );


      if (indice >= 0) {

        ordenes[indice] =
          orden;
      }
    }


    /* =====================================================
       FALLA
    ===================================================== */

    const falla =
      fallas.find(
        f =>
          Number(f.idTipoFalla)
          ===
          Number(fallaSeleccionada)
      );


    /* =====================================================
       NUEVA ASISTENCIA
       Cada continuación crea una nueva visita,
       pero NO una nueva orden.
    ===================================================== */

    const asistenciaPayload = {

      idOrden:
        orden.idOrden,

      idTecnico:
        tecnico?.idTecnico
        ||
        null,

      tecnicoNombreRegistro:
        tecnicoTexto,

      fechaAsistencia:
        fecha,

      horaInicio:
        ahora
          .toTimeString()
          .slice(0, 8),

      horaFin:
        ahora
          .toTimeString()
          .slice(0, 8),

      diagnostico:
        resultado === 'ANULADA'
          ?
            'Orden anulada'
          :
            [
              falla?.nombreFalla,
              v('detalleFalla')
            ]
              .filter(Boolean)
              .join(' - '),

      estadoServicio:
        resultado,

      resultadoServicio:
        resultado,

      observaciones:
        motivoEstado
          ?
            `${motivoEstado}${
              v('observaciones')
                ?
                  ' | '
                  +
                  v('observaciones')
                :
                  ''
            }`
          :
            (
              v('observaciones')
              ||
              null
            ),

      firmaCliente:
        null,

      evidenciaFotografica:
        null,

      motivoAnulacion:
        resultado === 'ANULADA'
          ?
            motivoEstado
          :
            null,

      fechaAnulacion:
        resultado === 'ANULADA'
          ?
            ahora
              .toISOString()
              .slice(0, 19)
          :
            null,

      anuladoPor:
        resultado === 'ANULADA'
          ?
            obtenerNombreSesion()
          :
            null
    };


    const asistencia =
      await postJson(
        '/asistencias-tecnicas',
        asistenciaPayload
      );


    /* =====================================================
       GUARDAR FALLA
    ===================================================== */

    if (
      resultado !== 'ANULADA'
      &&
      fallaSeleccionada
    ) {

      await postJson(
        '/asistencia-fallas',
        {

          idAsistencia:
            asistencia.idAsistencia,

          idTipoFalla:
            Number(
              fallaSeleccionada
            ),

          detalle:
            v('detalleFalla')
            ||
            null
        }
      );
    }


    /* =====================================================
       GUARDAR SOLUCIÓN
    ===================================================== */

    if (
      resultado !== 'ANULADA'
      &&
      solucionSeleccionada
    ) {

      await postJson(
        '/asistencia-soluciones',
        {

          idAsistencia:
            asistencia.idAsistencia,

          idSolucion:
            Number(
              solucionSeleccionada
            ),

          detalle:
            v('detalleSolucion')
            ||
            null
        }
      );
    }


    /* =====================================================
       MATERIALES
    ===================================================== */

    if (
      resultado !== 'ANULADA'
    ) {

      const filas =
        [
          ...document.querySelectorAll(
            '.material-row'
          )
        ];


      for (
        const row
        of filas
      ) {

        const selectMaterial =
          row.querySelector(
            '.material-id'
          );


        if (!selectMaterial) {
          continue;
        }


        const valorMaterial =
          selectMaterial.value;


        if (
          !valorMaterial
          ||
          valorMaterial
          ===
          'SIN_MATERIAL'
        ) {

          continue;
        }


        const mid =
          Number(
            valorMaterial
          );


        const cantidadInput =
          row.querySelector(
            '.material-cantidad'
          );


        const cant =
          Number(
            cantidadInput?.value
          );


        if (
          mid
          &&
          cant > 0
        ) {

          const observacionInput =
            row.querySelector(
              '.material-observacion'
            );


          await postJson(
            '/detalle-materiales',
            {

              idAsistencia:
                asistencia.idAsistencia,

              idMaterial:
                mid,

              cantidadUtilizada:
                cant,

              observaciones:
                observacionInput?.value
                  ?.trim()
                ||
                null
            }
          );
        }
      }
    }


    /* =====================================================
       MENSAJE FINAL
    ===================================================== */

    if (
      resultado === 'RESUELTO'
    ) {

      mensaje(
        `Atención guardada. Orden ${numeroOrden} cerrada como resuelta.`,
        true
      );
    }


    else if (
      resultado === 'ANULADA'
    ) {

      mensaje(
        `Orden ${numeroOrden} anulada correctamente.`,
        true
      );
    }


    else {

      mensaje(
        `Atención guardada. Orden ${numeroOrden} quedó ${resultado.toLowerCase()} y podrá retomarse desde la ficha del usuario.`,
        true
      );
    }


    setTimeout(
      () => {

        location.href =
          `historial.html?q=${
            encodeURIComponent(
              documento
            )
          }`;

      },
      1200
    );


  } catch (e) {

    console.error(e);

    mensaje(
      e.message
      ||
      'No fue posible guardar la atención.',
      false
    );

    btn.disabled =
      false;
  }
}


/* =========================================================
   CLIENTE NUEVO
========================================================= */

async function prepararCliente() {

  const documento =
    v('numeroDocumento');


  const existente =
    clientes.find(
      c =>
        String(
          c.numeroDocumento || ''
        ).trim()
        ===
        documento
    );


  if (existente) {

    clienteActual =
      existente;

    await actualizarClienteSiCambio();

    return;
  }


  const payload = {

    numeroDocumento:
      documento,

    nombres:
      v('nombres'),

    apellidos:
      v('apellidos')
      ||
      null,

    tipoDocumento:
      'CC',

    telefono:
      v('telefono')
      ||
      null,

    correo:
      v('correo')
      ||
      null,

    direccion:
      v('direccion'),

    barrio:
      v('barrio')
      ||
      null,

    ciudad:
      v('ciudad'),

    departamento:
      v('departamento')
      ||
      null,

    estado:
      true
  };


  clienteActual =
    await postJson(
      '/clientes',
      payload
    );


  clientes.push(
    clienteActual
  );
}


/* =========================================================
   ACTUALIZAR CLIENTE
========================================================= */

async function actualizarClienteSiCambio() {

  if (!clienteActual) {
    return;
  }


  const payload = {

    ...clienteActual,

    nombres:
      v('nombres'),

    apellidos:
      v('apellidos')
      ||
      null,

    telefono:
      v('telefono')
      ||
      null,

    correo:
      v('correo')
      ||
      null,

    direccion:
      v('direccion'),

    barrio:
      v('barrio')
      ||
      null,

    ciudad:
      v('ciudad'),

    departamento:
      v('departamento')
      ||
      null
  };


  const cambio = [

    'nombres',
    'apellidos',
    'telefono',
    'correo',
    'direccion',
    'barrio',
    'ciudad',
    'departamento'

  ].some(
    k =>
      String(
        payload[k] || ''
      )
      !==
      String(
        clienteActual[k] || ''
      )
  );


  if (cambio) {

    const r =
      await fetch(
        `/clientes/${clienteActual.idCliente}`,
        {

          method:
            'PUT',

          headers: {

            'Content-Type':
              'application/json'
          },

          body:
            JSON.stringify(
              payload
            )
        }
      );


    if (!r.ok) {

      throw new Error(
        await r.text()
      );
    }


    clienteActual =
      await r.json();


    const indice =
      clientes.findIndex(
        c =>
          Number(c.idCliente)
          ===
          Number(
            clienteActual.idCliente
          )
      );


    if (indice >= 0) {

      clientes[indice] =
        clienteActual;
    }
  }
}


/* =========================================================
   PETICIONES HTTP
========================================================= */

async function postJson(
  url,
  payload
) {

  const r =
    await fetch(
      url,
      {

        method:
          'POST',

        headers: {

          'Content-Type':
            'application/json'
        },

        body:
          JSON.stringify(
            payload
          )
      }
    );


  if (!r.ok) {

    const txt =
      await r.text();


    throw new Error(
      txt
      ||
      `Error al guardar en ${url}`
    );
  }


  return r.json();
}


async function putJson(
  url,
  payload
) {

  const r =
    await fetch(
      url,
      {

        method:
          'PUT',

        headers: {

          'Content-Type':
            'application/json'
        },

        body:
          JSON.stringify(
            payload
          )
      }
    );


  if (!r.ok) {

    const txt =
      await r.text();


    throw new Error(
      txt
      ||
      `Error al actualizar ${url}`
    );
  }


  return r.json();
}


/* =========================================================
   ESTADOS
========================================================= */

function normalizarEstadoOrden(
  estado
) {

  let valor =
    String(
      estado || 'PENDIENTE'
    )
      .trim()
      .toUpperCase();


  if (
    valor === 'CERRADA'
    ||
    valor === 'FINALIZADO'
    ||
    valor === 'FINALIZADA'
  ) {

    return 'RESUELTO';
  }


  if (
    valor === 'ANULADO'
  ) {

    return 'ANULADA';
  }


  return valor;
}


function textoEstado(
  estado
) {

  const valor =
    normalizarEstadoOrden(
      estado
    );


  if (
    valor === 'EN PROCESO'
  ) {

    return 'en proceso';
  }


  if (
    valor === 'PENDIENTE'
  ) {

    return 'pendiente';
  }


  if (
    valor === 'ANULADA'
  ) {

    return 'anulada';
  }


  if (
    valor === 'RESUELTO'
  ) {

    return 'resuelta';
  }


  return valor.toLowerCase();
}


/* =========================================================
   UTILIDADES
========================================================= */

function nombreTecnico(t) {

  return `${
    t.nombres || ''
  } ${
    t.apellidos || ''
  }`.trim();
}


function normalizar(s) {

  return String(
    s || ''
  )
    .trim()
    .toLowerCase()
    .replace(
      /\s+/g,
      ' '
    );
}


function v(id) {

  const elemento =
    document.getElementById(
      id
    );


  return elemento
    ?
      String(
        elemento.value || ''
      ).trim()
    :
      '';
}


function mensaje(
  texto,
  ok
) {

  const m =
    document.getElementById(
      'mensajeGuardar'
    );


  if (!m) {

    if (!ok) {
      alert(texto);
    }

    return;
  }


  m.textContent =
    texto;


  m.className =
    ok
      ?
        'save-message ok'
      :
        'save-message error';
}


function obtenerNombreSesion() {

  if (!sesion) {

    return 'Usuario del sistema';
  }


  return (
    sesion.nombreUsuario
    ||
    sesion.nombre
    ||
    sesion.correo
    ||
    'Usuario del sistema'
  );
}


function esc(x) {

  return String(
    x ?? ''
  )
    .replace(
      /[&<>"']/g,
      c => ({

        '&':
          '&amp;',

        '<':
          '&lt;',

        '>':
          '&gt;',

        '"':
          '&quot;',

        "'":
          '&#39;'

      }[c])
    );
}