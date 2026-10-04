const s=JSON.parse(localStorage.getItem('usuario'));if(!s)location.href='/';
const rol=String(s.nombreRol||'').toUpperCase();
const admin=rol==='ADMINISTRADOR';
const puedeGestionarAtencion=admin||rol==='TECNICO'||rol==='TÉCNICO';
let clientes=[],ordenes=[],asistencias=[],fallas=[],soluciones=[],materiales=[],af=[],asol=[],dm=[],relaciones=[];
document.addEventListener('DOMContentLoaded',async()=>{try{await cargar();const q=new URLSearchParams(location.search).get('q');if(q){document.getElementById('q').value=q;buscar()}}catch(err){feedback('No fue posible cargar la información del sistema.',true)}});
document.getElementById('q')?.addEventListener('keydown',e=>{if(e.key==='Enter')buscar()});
async function cargar(){const urls=['/clientes','/ordenes-servicio','/asistencias-tecnicas','/tipos-falla','/soluciones','/materiales','/asistencia-fallas','/asistencia-soluciones','/detalle-materiales','/tipo-falla-soluciones'];const rs=await Promise.all(urls.map(u=>fetch(u)));if(rs.some(r=>!r.ok))throw new Error('Carga incompleta');[clientes,ordenes,asistencias,fallas,soluciones,materiales,af,asol,dm,relaciones]=await Promise.all(rs.map(r=>r.json()))}
function buscar(){const q=document.getElementById('q').value.trim();if(!q){ocultarFicha();return feedback('Ingrese la cédula del usuario.',true)}const c=clientes.find(x=>String(x.numeroDocumento||'').trim()===q);if(!c){ocultarFicha();return feedback('No se encontró un usuario con esa cédula.',true)}feedback('');mostrarFicha(c)}
function mostrarFicha(c){
  document.getElementById('estadoInicial').style.display='none';document.getElementById('fichaUsuario').style.display='block';document.getElementById('nombreFicha').textContent=nombre(c);document.getElementById('documentoFicha').textContent=`Cédula / identificación: ${c.numeroDocumento||'—'}`;
  const ord=ordenes.filter(o=>Number(o.idCliente)===Number(c.idCliente));
  // Para estadísticas y reincidencias se usa solo la intervención más reciente de cada orden.
  // Las visitas anteriores siguen almacenadas como trazabilidad, pero no duplican resultados.
  const ats=ord.map(o=>asistencias.filter(a=>Number(a.idOrden)===Number(o.idOrden)&&estado(a)!=='ANULADO').sort((a,b)=>Number(b.idAsistencia)-Number(a.idAsistencia))[0]).filter(Boolean).sort((a,b)=>String(b.fechaAsistencia||'').localeCompare(String(a.fechaAsistencia||'')));
  const ultima=ats.length?fechaES(ats[0].fechaAsistencia):'—';const rec=calcularReincidencias(ats);
  document.getElementById('resumen').innerHTML=`<div><span>Nombre</span><strong>${e(nombre(c))}</strong></div><div><span>Identificación</span><strong>${e(c.numeroDocumento)}</strong></div><div><span>Total de atenciones</span><strong>${ats.length}</strong></div><div><span>Última atención</span><strong>${e(ultima)}</strong></div><div><span>Órdenes registradas</span><strong>${ord.length}</strong></div><div><span>Fallas reincidentes</span><strong>${rec.length}</strong></div>`;renderReincidencias(rec);renderHistorial(ord)
}
function componente(f){
  const c=String(f?.categoria||'').trim();
  const permitidos=['Cableado','Antena','Amplificador','Decodificador','LNB','TAP','TAP/Amplificador','Conectores'];
  return permitidos.includes(c)?c:null;
}
function calcularReincidencias(ats){
  const grupos={};
  ats.forEach(a=>{
    // Una misma atención cuenta una sola vez por componente, aunque tenga varias fallas de esa familia.
    const fallasVisita=af.filter(x=>Number(x.idAsistencia)===Number(a.idAsistencia)).map(x=>fallas.find(z=>Number(z.idTipoFalla)===Number(x.idTipoFalla))).filter(Boolean);
    const porComponente={};
    fallasVisita.forEach(f=>{const comp=componente(f);if(!comp)return;(porComponente[comp]??=[]).push(f)});
    Object.entries(porComponente).forEach(([comp,fs])=>{
      if(!grupos[comp])grupos[comp]=[];
      grupos[comp].push({fecha:a.fechaAsistencia,fallas:[...new Set(fs.map(f=>f.nombreFalla||'Falla'))],idsFalla:[...new Set(fs.map(f=>Number(f.idTipoFalla)))]});
    });
  });
  return Object.entries(grupos).filter(([,visitas])=>visitas.length>1).map(([comp,visitas])=>{
    const idsFalla=[...new Set(visitas.flatMap(v=>v.idsFalla))];
    const solIds=[...new Set(idsFalla.flatMap(id=>relaciones.filter(r=>Number(r.idTipoFalla)===id).map(r=>Number(r.idSolucion))))];
    return {nombre:comp,veces:visitas.length,fechas:[...new Set(visitas.map(v=>v.fecha).filter(Boolean))].sort().reverse(),fallas:[...new Set(visitas.flatMap(v=>v.fallas))],posibles:solIds.map(id=>soluciones.find(x=>Number(x.idSolucion)===id)?.nombreSolucion).filter(Boolean)};
  }).sort((a,b)=>b.veces-a.veces);
}
function renderReincidencias(rec){const out=document.getElementById('reincidencias');if(!rec.length){out.innerHTML='<div class="no-recurrence"><strong>No se detectan fallas reincidentes.</strong><span>Con los registros actuales, ninguna falla se ha repetido más de una vez.</span></div>';return}out.innerHTML=`<div class="recurrence-list">${rec.map(r=>`<article class="recurrence-item"><div class="recurrence-count">${r.veces}<small>veces</small></div><div><h3>${e(r.nombre)}</h3><p><b>Fallas relacionadas:</b> ${e(r.fallas.join(' · '))}</p><p><b>Fechas:</b> ${e(r.fechas.map(fechaES).join(' · '))}</p><p><b>Posibles soluciones del catálogo:</b> ${e(r.posibles.join(' · ')||'Sin soluciones asociadas en el catálogo')}</p></div></article>`).join('')}</div>`}
function renderHistorial(ord){
  const out=document.getElementById('resultados');
  const items=ord.map(o=>{
    const visitas=asistencias
      .filter(a=>Number(a.idOrden)===Number(o.idOrden))
      .sort((x,y)=>Number(y.idAsistencia)-Number(x.idAsistencia));
    return {o,a:visitas[0]||null,visitas};
  }).sort((x,y)=>String(y.a?.fechaAsistencia||y.o.fechaReporte||'').localeCompare(String(x.a?.fechaAsistencia||x.o.fechaReporte||'')));

  if(!items.length){out.innerHTML='<p class="empty-state">Este usuario todavía no tiene órdenes ni atenciones registradas.</p>';return}

  out.innerHTML=items.map(({o,a,visitas})=>{
    const estadoActual=estadoActualOrden(o);
    const puedeRetomar=puedeGestionarAtencion&&['PENDIENTE','EN PROCESO','ANULADO','ANULADA'].includes(estadoActual);
    const botonRetomar=puedeRetomar?`<button class="secondary-action" onclick="retomarOrden(${o.idOrden})">Retomar atención</button>`:'';
    const botonEliminar=admin?`<button class="danger-outline" onclick="eliminarOrden(${o.idOrden},'${e(o.numeroOrden)}')">Eliminar orden</button>`:'';
    const acciones=`${botonRetomar}${botonEliminar}`;

    if(!a)return `<article class="history-card"><div class="history-top"><div><span class="muted">${e(fechaHoraES(o.fechaReporte))}</span><strong>Orden ${e(o.numeroOrden)}</strong></div><div class="history-actions"><span class="status-pill ${estadoActual==='RESUELTO'?'ok':'warn'}">${e(estadoActual)}</span>${acciones}</div></div><p><b>Motivo reportado:</b> ${e(o.descripcionProblema)}</p><p class="muted">Aún no tiene atención técnica registrada.</p></article>`;

    const ff=af.filter(x=>Number(x.idAsistencia)===Number(a.idAsistencia)).map(x=>fallas.find(f=>Number(f.idTipoFalla)===Number(x.idTipoFalla))).filter(Boolean);
    const ss=asol.filter(x=>Number(x.idAsistencia)===Number(a.idAsistencia)).map(x=>soluciones.find(z=>Number(z.idSolucion)===Number(x.idSolucion))?.nombreSolucion).filter(Boolean);
    const mm=dm.filter(x=>Number(x.idAsistencia)===Number(a.idAsistencia)).map(x=>{const m=materiales.find(z=>Number(z.idMaterial)===Number(x.idMaterial));return m?`${m.nombreMaterial} (${x.cantidadUtilizada} ${m.unidadMedida||''})`:''}).filter(Boolean);
    const componentes=[...new Set(ff.map(componente).filter(Boolean))];
    const trazabilidad=visitas.length>1?`<p class="history-observation"><b>Visitas realizadas sobre esta orden:</b> ${visitas.length}. Se muestra la intervención más reciente; las visitas anteriores permanecen almacenadas como trazabilidad.</p>`:'';

    return `<article class="history-card"><div class="history-top"><div><span class="muted">${e(fechaES(a.fechaAsistencia))}</span><strong>Orden ${e(o.numeroOrden)}</strong></div><div class="history-actions"><span class="status-pill ${estadoActual==='RESUELTO'?'ok':'warn'}">${e(estadoActual)}</span>${acciones}</div></div><div class="history-grid"><p><b>Motivo:</b> ${e(o.descripcionProblema)}</p><p><b>Técnico:</b> ${e(a.tecnicoNombreRegistro||'—')}</p><p><b>Componente:</b> ${e(componentes.join(', ')||'—')}</p><p><b>Falla:</b> ${e(ff.map(f=>f.nombreFalla).join(', ')||a.diagnostico||'—')}</p><p><b>Solución:</b> ${e(ss.join(', ')||'—')}</p><p><b>Materiales:</b> ${e(mm.join(', ')||'Sin material registrado')}</p></div>${a.observaciones?`<p class="history-observation"><b>Observaciones:</b> ${e(a.observaciones)}</p>`:''}${trazabilidad}</article>`
  }).join('')
}
function estadoActualOrden(o){
  // La orden es la fuente oficial de su estado actual. Las asistencias anteriores
  // se conservan únicamente como trazabilidad y nunca deben volver a marcar la
  // orden como Pendiente o En proceso después de haber sido resuelta.
  return estadoOrden(o);
}
function retomarOrden(id){if(!puedeGestionarAtencion)return;location.href=`registro-atencion.html?retomar=${encodeURIComponent(id)}`}
async function eliminarOrden(id,numero){if(!admin)return;if(!confirm(`¿Eliminar definitivamente la orden ${numero}?\n\nSe eliminarán también todas sus asistencias, fallas, soluciones y materiales asociados. Esta acción no se puede deshacer.`))return;const r=await fetch(`/admin/ordenes/${id}`,{method:'DELETE',headers:{'X-User-Role':s.nombreRol||''}});if(!r.ok){let msg='No fue posible eliminar la orden.';try{const j=await r.json();if(j.error)msg=j.error}catch(_){}alert(msg);return}await cargar();buscar()}
async function anular(id){if(!admin)return;const motivo=prompt('Indique el motivo de la anulación:');if(!motivo||!motivo.trim())return;const a=asistencias.find(x=>Number(x.idAsistencia)===Number(id));const payload={...a,estadoServicio:'ANULADO',resultadoServicio:'ANULADO',motivoAnulacion:motivo.trim(),fechaAnulacion:new Date().toISOString(),anuladoPor:s.nombreUsuario||s.correo||'ADMINISTRADOR'};const r=await fetch(`/asistencias-tecnicas/${id}`,{method:'PUT',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload)});if(!r.ok){alert('No fue posible anular el registro.');return}await cargar();buscar()}
function nuevaBusqueda(){document.getElementById('q').value='';ocultarFicha();feedback('');document.getElementById('q').focus()}
function ocultarFicha(){document.getElementById('fichaUsuario').style.display='none';document.getElementById('estadoInicial').style.display='block'}
function feedback(t,error=false){const m=document.getElementById('mensajeBusqueda');m.textContent=t;m.className='search-feedback'+(error?' error':'')}
function fechaES(v){if(!v)return'—';const p=String(v).slice(0,10).split('-');return p.length===3?`${p[2]}/${p[1]}/${p[0]}`:String(v)}
function fechaHoraES(v){return fechaES(v)}
function estado(a){const v=String(a?.resultadoServicio||a?.estadoServicio||'PENDIENTE').toUpperCase();return v==='FINALIZADO'?'RESUELTO':v}
function estadoOrden(o){const v=String(o?.estado||'PENDIENTE').toUpperCase();return ['CERRADA','FINALIZADO','RESUELTO'].includes(v)?'RESUELTO':v}
function nombre(c){return c?`${c.nombres||''} ${c.apellidos||''}`.trim():'—'}
function e(x){return String(x??'—').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
