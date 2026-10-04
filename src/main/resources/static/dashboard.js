const u=JSON.parse(localStorage.getItem('usuario'));if(!u)location.href='/';
const admin=String(u.nombreRol||'').toUpperCase()==='ADMINISTRADOR';
document.getElementById('usuarioActual').textContent=`Sesión: ${u.nombreUsuario||'Usuario'}${u.nombreRol?' · '+u.nombreRol:''}`;
document.addEventListener('DOMContentLoaded',cargarReporte);

async function cargarReporte(){try{
 const urls=['/clientes','/ordenes-servicio','/asistencias-tecnicas','/tecnicos','/asistencia-fallas','/tipos-falla'];
 const rs=await Promise.all(urls.map(x=>fetch(x)));if(rs.some(r=>!r.ok))throw new Error('Carga incompleta');
 const [c,o,a,t,af,tf]=await Promise.all(rs.map(x=>x.json()));
 // Solo se consideran atenciones cuya orden todavía existe. Esto evita que una
 // atención de una orden eliminada permanezca visible en Inicio.
 const idsOrdenes=new Set(o.map(x=>Number(x.idOrden)));
 const atencionesConOrden=a.filter(x=>idsOrdenes.has(Number(x.idOrden)));
 // El dashboard representa el estado actual de cada orden, no cada visita histórica.
 // Si una orden antigua conserva más de una asistencia por pruebas previas, solo
 // se toma la asistencia más reciente (mayor idAsistencia).
 const ultimaPorOrden=new Map();
 atencionesConOrden.forEach(x=>{
   const id=Number(x.idOrden),prev=ultimaPorOrden.get(id);
   if(!prev||Number(x.idAsistencia)>Number(prev.idAsistencia))ultimaPorOrden.set(id,x);
 });
 const atencionesVigentes=[...ultimaPorOrden.values()];
 const estadoOrdenActual=new Map();
 o.forEach(ord=>{const aa=ultimaPorOrden.get(Number(ord.idOrden));estadoOrdenActual.set(Number(ord.idOrden),aa?normalizarEstado(aa):normalizarEstadoOrden(ord));});
 const activas=atencionesVigentes.filter(x=>normalizarEstado(x)!=='ANULADO');
 const res=[...estadoOrdenActual.values()].filter(x=>x==='RESUELTO').length;
 const pen=[...estadoOrdenActual.values()].filter(x=>x==='PENDIENTE').length;
 const proc=[...estadoOrdenActual.values()].filter(x=>x==='EN PROCESO').length;
 const anu=[...estadoOrdenActual.values()].filter(x=>['ANULADO','ANULADA'].includes(x)).length;
 // Un usuario tiene reincidencia solo si el mismo componente técnico aparece en dos o más órdenes vigentes.
 const fallasPorAsistencia=new Map();
 af.forEach(x=>{const id=Number(x.idAsistencia);if(!fallasPorAsistencia.has(id))fallasPorAsistencia.set(id,[]);fallasPorAsistencia.get(id).push(mapaComponente(tf,Number(x.idTipoFalla)))});
 const componentesPorCliente={};
 o.forEach(ord=>{const at=ultimaPorOrden.get(Number(ord.idOrden));if(!at||normalizarEstado(at)==='ANULADO')return;const comps=new Set((fallasPorAsistencia.get(Number(at.idAsistencia))||[]).filter(Boolean));if(!componentesPorCliente[ord.idCliente])componentesPorCliente[ord.idCliente]={};comps.forEach(comp=>componentesPorCliente[ord.idCliente][comp]=(componentesPorCliente[ord.idCliente][comp]||0)+1)});
 const reinc=Object.values(componentesPorCliente).filter(g=>Object.values(g).some(n=>n>1)).length;
 document.getElementById('indicadores').innerHTML=card('Usuarios atendidos',new Set(o.map(x=>x.idCliente)).size)+card('Órdenes registradas',o.length)+card('Atenciones registradas',atencionesVigentes.length)+card('Resueltas',res)+card('Pendientes',pen)+card('En proceso',proc)+card('Anuladas',anu)+card('Usuarios con reincidencia',reinc);
 const mapaFallas=new Map(tf.map(x=>[Number(x.idTipoFalla),x]));const count={};
 af.filter(x=>activas.some(z=>Number(z.idAsistencia)===Number(x.idAsistencia))).forEach(x=>{const f=mapaFallas.get(Number(x.idTipoFalla));const n=componenteEstandar(f);count[n]=(count[n]||0)+1});
 const top=Object.entries(count).sort((a,b)=>b[1]-a[1]);document.getElementById('fallasFrecuentes').innerHTML=top.length?`<div class="table-wrap"><table class="clean-table"><thead><tr><th>Componente / tipo de falla</th><th>Registros</th></tr></thead><tbody>${top.map(([n,v])=>`<tr><td>${e(n)}</td><td><strong>${v}</strong></td></tr>`).join('')}</tbody></table></div>`:'<p class="empty-state">Aún no hay fallas suficientes para mostrar tendencias.</p>';
 const mc=new Map(c.map(x=>[Number(x.idCliente),x])),mo=new Map(o.map(x=>[Number(x.idOrden),x]));const ult=[...atencionesVigentes].sort((x,y)=>Number(y.idAsistencia)-Number(x.idAsistencia)).slice(0,8);
 document.getElementById('seguimiento').innerHTML=ult.length?`<div class="table-wrap"><table class="clean-table"><thead><tr><th>Orden</th><th>Identificación</th><th>Usuario</th><th>Fecha</th><th>Estado de la visita</th></tr></thead><tbody>${ult.map(x=>{const ord=mo.get(Number(x.idOrden)),cli=ord?mc.get(Number(ord.idCliente)):null,est=normalizarEstado(x);return `<tr><td>${e(ord?.numeroOrden)}</td><td>${e(cli?.numeroDocumento)}</td><td>${e(n(cli))}</td><td>${e(fechaES(x.fechaAsistencia))}</td><td><span class="status-pill ${est==='RESUELTO'?'ok':'warn'}">${e(est)}</span></td></tr>`}).join('')}</tbody></table></div>`:'<p class="empty-state">Todavía no hay atenciones registradas.</p>';
}catch(err){console.error(err);document.getElementById('indicadores').innerHTML='<p>No fue posible cargar el reporte general.</p>'}}

async function limpiarDatosPrueba(){
 if(!admin)return;
 const aviso='¿Desea borrar TODOS los datos de prueba?\n\nSe eliminarán clientes, órdenes, asistencias e historial operativo.\n\nSe conservarán usuarios de acceso, técnicos, fallas, soluciones y materiales.\n\nEsta acción no se puede deshacer.';
 if(!confirm(aviso))return;
 const confirmacion=prompt('Para confirmar escriba exactamente: LIMPIAR');
 if(confirmacion!=='LIMPIAR')return alert('Limpieza cancelada.');
 const r=await fetch('/admin/ordenes/datos-prueba',{method:'DELETE',headers:{'X-User-Role':u.nombreRol||''}});
 if(!r.ok){let msg='No fue posible limpiar los datos.';try{const j=await r.json();if(j.error)msg=j.error}catch(_){}return alert(msg)}
 alert('Datos de prueba eliminados. Los catálogos, técnicos y usuarios de acceso se conservaron.');location.reload();
}
function normalizarEstado(x){const v=String(x?.resultadoServicio||x?.estadoServicio||'PENDIENTE').toUpperCase();return v==='FINALIZADO'?'RESUELTO':v}
function normalizarEstadoOrden(x){const v=String(x?.estado||'PENDIENTE').toUpperCase();return ['FINALIZADO','CERRADA'].includes(v)?'RESUELTO':v}
function card(t,n){return `<div class="metric-card"><span>${e(t)}</span><strong>${n}</strong></div>`}
function n(x){return x?`${x.nombres||''} ${x.apellidos||''}`.trim():'—'}
function fechaES(v){if(!v)return'—';const p=String(v).slice(0,10).split('-');return p.length===3?`${p[2]}/${p[1]}/${p[0]}`:String(v)}
function e(x){return String(x??'—').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
function mapaComponente(tipos,id){const f=tipos.find(x=>Number(x.idTipoFalla)===Number(id));return f?componenteEstandar(f):null}
function componenteEstandar(f){const c=String(f?.categoria||'').toLowerCase(),n=String(f?.nombreFalla||'').toLowerCase(),x=c+' '+n;if(x.includes('sin falla'))return 'Sin falla detectada';if(x.includes('tap')&&x.includes('ampl'))return 'TAP/Amplificador';if(x.includes('cable'))return 'Cableado';if(x.includes('conector'))return 'Conectores';if(x.includes('antena'))return 'Antena';if(x.includes('lnb'))return 'LNB';if(x.includes('decod')||x.includes('tarjeta')||x.includes('hdmi')||x.includes('video'))return 'Decodificador';if(x.includes('tap'))return 'TAP';if(x.includes('ampl')||x.includes('switch'))return 'Amplificador';return f?.categoria||'Otros'}
