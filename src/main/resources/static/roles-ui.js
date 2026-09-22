const sesionActual=JSON.parse(localStorage.getItem('usuario')||'null');
if(!sesionActual){location.href='/';}
const esAdmin=()=>String(sesionActual?.nombreRol||'').toUpperCase()==='ADMINISTRADOR';
document.addEventListener('DOMContentLoaded',()=>{
 document.querySelectorAll('[data-admin-only]').forEach(x=>x.style.display=esAdmin()?'':'none');
 document.querySelectorAll('[data-tecnico-hide]').forEach(x=>x.style.display=esAdmin()?'':'none');
});
