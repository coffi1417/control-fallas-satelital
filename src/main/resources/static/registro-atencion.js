const sesion=JSON.parse(localStorage.getItem('usuario'));if(!sesion)location.href='/';
let clientes=[],tecnicos=[],fallas=[],soluciones=[],relaciones=[],materiales=[],ordenes=[];
let clienteActual=null,materialRowId=0,ordenRetomada=null;
const materialesOcultos=new Set();

document.addEventListener('DOMContentLoaded',async()=>{
  document.getElementById('fechaAtencion').value=new Date().toISOString().slice(0,10);
  try{
    const urls=['/clientes','/tecnicos','/tipos-falla','/soluciones','/tipo-falla-soluciones','/materiales','/ordenes-servicio'];
    const rs=await Promise.all(urls.map(u=>fetch(u)));
    if(rs.some(r=>!r.ok))throw new Error('No fue posible cargar los datos del sistema.');
    [clientes,tecnicos,fallas,soluciones,relaciones,materiales,ordenes]=await Promise.all(rs.map(r=>r.json()));
    cargarCatalogos();agregarMaterial();
    await cargarOrdenParaRetomar();
  }catch(e){console.error(e);mensaje('No fue posible cargar los catálogos del sistema.',false)}
});

async function cargarOrdenParaRetomar(){
  const id=Number(new URLSearchParams(location.search).get('retomar'));
  if(!id)return;
  const orden=ordenes.find(o=>Number(o.idOrden)===id);
  if(!orden){mensaje('La orden que intenta retomar no existe.',false);return;}
  ordenRetomada=orden;
  clienteActual=clientes.find(c=>Number(c.idCliente)===Number(orden.idCliente))||null;
  if(!clienteActual){mensaje('No fue posible localizar el usuario asociado a la orden.',false);return;}

  document.getElementById('numeroDocumento').value=clienteActual.numeroDocumento||'';
  document.getElementById('numeroOrden').value=orden.numeroOrden||'';
  ['nombres','apellidos','telefono','correo','direccion','barrio','ciudad','departamento'].forEach(k=>document.getElementById(k).value=clienteActual[k]||'');
  document.getElementById('tipoServicio').value=orden.tipoServicio||'Asistencia técnica';
  document.getElementById('motivo').value=orden.descripcionProblema||'';
  document.getElementById('numeroDocumento').readOnly=true;
  document.getElementById('numeroOrden').readOnly=true;
  document.getElementById('numeroOrden').placeholder='Número de orden';
  document.getElementById('estadoBusqueda').textContent=`Retomando la orden ${orden.numeroOrden}. Al guardar, esta misma orden actualizará su estado.`;
  document.getElementById('estadoBusqueda').className='helper-info';
  const h1=document.querySelector('.page-header h1');if(h1)h1.textContent='Retomar atención técnica';
  const intro=document.querySelector('.page-header p:not(.eyebrow)');if(intro)intro.textContent='Complete la atención pendiente. Se conservará el mismo número de orden y se actualizará su estado.';
}

function cargarCatalogos(){
  const af=fallas.filter(f=>f.estado!==false).sort((a,b)=>(a.categoria||'').localeCompare(b.categoria||'')||(a.nombreFalla||'').localeCompare(b.nombreFalla||''));
  document.getElementById('falla').innerHTML='<option value="">Seleccione una falla</option>'+af.map(f=>`<option value="${f.idTipoFalla}">${esc(f.categoria||'General')} · ${esc(f.nombreFalla)}</option>`).join('');
  filtrarSoluciones();
}

function buscarCliente(){
  if(ordenRetomada)return;
  const doc=v('numeroDocumento');if(!doc)return;
  clienteActual=clientes.find(c=>String(c.numeroDocumento||'').trim()===doc)||null;
  if(clienteActual){
    ['nombres','apellidos','telefono','correo','direccion','barrio','ciudad','departamento'].forEach(k=>document.getElementById(k).value=clienteActual[k]||'');
    document.getElementById('estadoBusqueda').textContent='Usuario encontrado. Datos cargados automáticamente.';
    document.getElementById('estadoBusqueda').className='helper-ok';
  }else{
    ['nombres','apellidos','telefono','correo','direccion','barrio','ciudad','departamento'].forEach(k=>document.getElementById(k).value='');
    document.getElementById('estadoBusqueda').textContent='Usuario nuevo. Complete sus datos una sola vez.';
    document.getElementById('estadoBusqueda').className='helper-info';
  }
}

function filtrarSoluciones(){
  const id=Number(v('falla'));
  let lista=soluciones.filter(s=>s.estado!==false);
  if(id){const permitidas=new Set(relaciones.filter(r=>Number(r.idTipoFalla)===id).map(r=>Number(r.idSolucion)));if(permitidas.size)lista=lista.filter(s=>permitidas.has(Number(s.idSolucion)));}
  lista.sort((a,b)=>(a.nombreSolucion||'').localeCompare(b.nombreSolucion||''));
  document.getElementById('solucion').innerHTML='<option value="">Seleccione una solución</option>'+lista.map(s=>`<option value="${s.idSolucion}">${esc(s.nombreSolucion)}</option>`).join('');
}

function agregarMaterial(){
  const id=++materialRowId;
  const activos=materiales.filter(m=>m.estado!==false&&!materialesOcultos.has(m.nombreMaterial)).sort((a,b)=>(a.nombreMaterial||'').localeCompare(b.nombreMaterial||''));
  const row=document.createElement('div');row.className='material-row';row.dataset.row=id;
  row.innerHTML=`<div class="field material-select"><label>Material</label><select class="material-id"><option value="">Seleccione material</option><option value="SIN_MATERIAL">Sin material utilizado</option>${activos.map(m=>`<option value="${m.idMaterial}">${esc(m.nombreMaterial)}${m.unidadMedida?' · '+esc(m.unidadMedida):''}</option>`).join('')}</select></div><div class="field material-qty"><label>Cantidad</label><input class="material-cantidad" type="number" min="0.01" step="0.01" placeholder="0"></div><div class="field material-note"><label>Observación</label><input class="material-observacion" placeholder="Opcional"></div><button type="button" class="remove-material" title="Quitar" onclick="this.parentElement.remove()">×</button>`;
  document.getElementById('materialRows').appendChild(row);
}

async function guardarAtencion(ev){
  ev.preventDefault();const btn=document.getElementById('btnGuardar');btn.disabled=true;mensaje('Guardando registro completo...',true);
  try{
    const numeroOrden=v('numeroOrden');
    if(!numeroOrden)throw new Error('El número de orden es obligatorio.');
    if(!ordenRetomada&&ordenes.some(o=>String(o.numeroOrden||'').trim().toLowerCase()===numeroOrden.toLowerCase()))throw new Error('Ese número de orden ya está registrado. Use un número diferente.');
    if(!clienteActual||String(clienteActual.numeroDocumento)!==v('numeroDocumento')) await prepararCliente(); else await actualizarClienteSiCambio();
    if(!ordenRetomada){
      const abierta=ordenes.find(o=>Number(o.idCliente)===Number(clienteActual.idCliente)&&['PENDIENTE','EN PROCESO'].includes(estadoOrdenActual(o)));
      if(abierta)throw new Error(`El usuario ya tiene la orden ${abierta.numeroOrden} ${estadoOrdenActual(abierta)}. Para crear otra atención debe usar la opción Retomar atención desde el historial.`);
    }
    const tecnicoTexto=v('tecnicoNombre');const tecnico=tecnicos.find(t=>normalizar(nombreTecnico(t))===normalizar(tecnicoTexto));
    const resultado=v('resultado');const ahora=new Date();const fecha=v('fechaAtencion');
    if(['PENDIENTE','EN PROCESO'].includes(resultado)&&!v('observaciones'))throw new Error('Para dejar una atención Pendiente o En proceso, indique el motivo en Observaciones generales.');

    // En un registro normal se crea una orden nueva. Al Retomar se actualiza la misma
    // orden, conservando su número e id; la nueva asistencia queda como trazabilidad.
    const ordenPayload={numeroOrden,idCliente:clienteActual.idCliente,idInstalacion:ordenRetomada?.idInstalacion||null,idTecnicoAsignado:tecnico?.idTecnico||ordenRetomada?.idTecnicoAsignado||null,tipoServicio:v('tipoServicio')||'Asistencia técnica',descripcionProblema:v('motivo'),prioridad:ordenRetomada?.prioridad||'MEDIA',estado:estadoOrdenParaGuardar(resultado),fechaAsignacion:null,fechaProgramada:null,fechaCierre:resultado==='RESUELTO'?ahora.toISOString().slice(0,19):null,observacionesCierre:resultado==='RESUELTO'?(v('observaciones')||null):null};
    const orden=ordenRetomada
      ? await putJson(`/ordenes-servicio/${ordenRetomada.idOrden}`,ordenPayload)
      : await postJson('/ordenes-servicio',ordenPayload);

    const falla=fallas.find(f=>Number(f.idTipoFalla)===Number(v('falla')));
    const asistenciaPayload={idOrden:orden.idOrden,idTecnico:tecnico?.idTecnico||null,tecnicoNombreRegistro:tecnicoTexto,fechaAsistencia:fecha,horaInicio:ahora.toTimeString().slice(0,8),horaFin:ahora.toTimeString().slice(0,8),diagnostico:[falla?.nombreFalla,v('detalleFalla')].filter(Boolean).join(' - '),estadoServicio:resultado,resultadoServicio:resultado,observaciones:v('observaciones')||null,firmaCliente:null,evidenciaFotografica:null,motivoAnulacion:null,fechaAnulacion:null,anuladoPor:null};
    const asistencia=await postJson('/asistencias-tecnicas',asistenciaPayload);
    await postJson('/asistencia-fallas',{idAsistencia:asistencia.idAsistencia,idTipoFalla:Number(v('falla')),detalle:v('detalleFalla')||null});
    await postJson('/asistencia-soluciones',{idAsistencia:asistencia.idAsistencia,idSolucion:Number(v('solucion')),detalle:v('detalleSolucion')||null});
    const filas=[...document.querySelectorAll('.material-row')];
    for(const row of filas){const mid=Number(row.querySelector('.material-id').value),cant=Number(row.querySelector('.material-cantidad').value);if(mid&&cant>0)await postJson('/detalle-materiales',{idAsistencia:asistencia.idAsistencia,idMaterial:mid,cantidadUtilizada:cant,observaciones:row.querySelector('.material-observacion').value.trim()||null});}


    mensaje(`Atención guardada correctamente. Orden ${numeroOrden}.`,true);
    setTimeout(()=>location.href=`historial.html?q=${encodeURIComponent(v('numeroDocumento'))}`,900);
  }catch(e){console.error(e);mensaje(e.message||'No fue posible guardar la atención.',false);btn.disabled=false;}
}

function estadoOrdenActual(o){const x=String(o?.estado||'PENDIENTE').toUpperCase();return ['CERRADA','FINALIZADO','RESUELTO'].includes(x)?'RESUELTO':x;}

function estadoOrdenParaGuardar(resultado){return String(resultado||'PENDIENTE').toUpperCase();}

async function prepararCliente(){
  const documento=v('numeroDocumento');
  const existente=clientes.find(c=>String(c.numeroDocumento||'').trim()===documento);
  if(existente){clienteActual=existente;await actualizarClienteSiCambio();return;}
  const payload={numeroDocumento:documento,nombres:v('nombres'),apellidos:v('apellidos')||null,tipoDocumento:'CC',telefono:v('telefono')||null,correo:v('correo')||null,direccion:v('direccion'),barrio:v('barrio')||null,ciudad:v('ciudad'),departamento:v('departamento')||null,estado:true};
  clienteActual=await postJson('/clientes',payload);clientes.push(clienteActual);
}
async function actualizarClienteSiCambio(){
  const payload={...clienteActual,nombres:v('nombres'),apellidos:v('apellidos')||null,telefono:v('telefono')||null,correo:v('correo')||null,direccion:v('direccion'),barrio:v('barrio')||null,ciudad:v('ciudad'),departamento:v('departamento')||null};
  const cambio=['nombres','apellidos','telefono','correo','direccion','barrio','ciudad','departamento'].some(k=>String(payload[k]||'')!==String(clienteActual[k]||''));
  if(cambio){const r=await fetch(`/clientes/${clienteActual.idCliente}`,{method:'PUT',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload)});if(!r.ok)throw new Error(await r.text());clienteActual=await r.json();}
}
async function postJson(url,payload){const r=await fetch(url,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload)});if(!r.ok){let txt=await r.text();throw new Error(txt||`Error al guardar en ${url}`)}return r.json();}
async function putJson(url,payload){const r=await fetch(url,{method:'PUT',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload)});if(!r.ok){let txt=await r.text();throw new Error(txt||`Error al actualizar ${url}`)}return r.json();}
function nombreTecnico(t){return `${t.nombres||''} ${t.apellidos||''}`.trim()}
function normalizar(s){return String(s||'').trim().toLowerCase().replace(/\s+/g,' ')}
function v(id){return document.getElementById(id).value.trim()}
function mensaje(texto,ok){const m=document.getElementById('mensajeGuardar');m.textContent=texto;m.className=ok?'save-message ok':'save-message error'}
function esc(x){return String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
