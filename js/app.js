/* js/app.js - lógica simple para demo (sin backend) */

/* --- Datos demo (catálogo) --- */
const CATALOG = [
  { id:1, nombre:'Cajas corrugadas', categoria:'Cajas', unidad:'unidad', stock:500 },
  { id:2, nombre:'Bolsas plásticas', categoria:'Bolsas', unidad:'unidad', stock:1000 },
  { id:3, nombre:'Etiquetas adhesivas', categoria:'Etiquetas', unidad:'rollo', stock:300 },
  { id:4, nombre:'Cloro', categoria:'Limpieza', unidad:'litro', stock:150 },
  { id:5, nombre:'Harina (materia prima)', categoria:'Materia prima', unidad:'kg', stock:1200 }
];

/* --- Storage helpers --- */
function saveHistory(arr){ localStorage.setItem('ntr_history', JSON.stringify(arr)); }
function loadHistory(){ const r = localStorage.getItem('ntr_history'); return r?JSON.parse(r):[]; }

/* --- LOGIN (login.html) --- */
if(document.getElementById('loginBtn')){
  document.getElementById('demoFill').addEventListener('click', e=>{
    e.preventDefault();
    document.getElementById('id').value='1001';
    document.getElementById('name').value='Luisa González';
    // si select existe
    const sel = document.getElementById('seccion');
    if(sel) sel.value = 'Producción';
    const turno = document.getElementById('turno');
    if(turno) turno.value = 'Mañana';
  });

  document.getElementById('loginBtn').addEventListener('click', e=>{
    e.preventDefault();
    const id = document.getElementById('id').value.trim();
    const name = document.getElementById('name').value.trim();
    const seccion = document.getElementById('seccion').value || document.getElementById('seccion').textContent || '';
    const turno = document.getElementById('turno').value || 'Mañana';
    if(!id || !name || !seccion){ alert('Por favor diligencia tu ID, nombre y sección'); return; }
    sessionStorage.setItem('ntr_user', JSON.stringify({ id, name, seccion, turno }));
    // ir a página principal
    window.location.href = 'index.html';
  });
}

/* --- Mostrar usuario en cabeceras --- */
function putUserHeaders(){
  const user = JSON.parse(sessionStorage.getItem('ntr_user') || '{}');
  if (user && user.name) {
    // Mostrar nombre, ID y sección
    document.querySelectorAll('#hdrUser').forEach(el => el.textContent = user.name);
    document.querySelectorAll('#hdrSeccion').forEach(el => el.textContent = user.seccion);
    document.querySelectorAll('#userId').forEach(el => el.textContent = user.id);

    // Botón cerrar sesión
    const logoutBtn = document.getElementById('logoutTop');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', () => {
        sessionStorage.removeItem('ntr_user');
        window.location.href = 'login.html';
      });
    }
  }
}

/* --- Catalogo desplegable por categoria --- */
function renderCatalog(){
  const box = document.getElementById('catalogo');
  if(!box) return;
  box.innerHTML = '';

  const categorias = {};
  CATALOG.forEach(item => {
    if(!categorias[item.categoria]) categorias[item.categoria] = [];
    categorias[item.categoria].push(item);
  });

  Object.keys(categorias).forEach(cat => {
    const catBox = document.createElement('div');
    catBox.className = 'categoria-box';

    const header = document.createElement('div');
    header.className = 'categoria-header';
    header.innerHTML = `<span class="arrow">▶</span> <strong>${cat}</strong>`;

    const list = document.createElement('div');
    list.className = 'categoria-items';
    list.style.display = 'none';

    categorias[cat].forEach(it => {
      const item = document.createElement('div');
      item.className = 'catalog-item';
      item.innerHTML = `<div>• ${it.nombre}</div><small style="color:var(--muted)">Stock: ${it.stock} ${it.unidad}</small>`;
      list.appendChild(item);
    });

    header.addEventListener('click', () => {
      const visible = list.style.display === 'block';
      list.style.display = visible ? 'none' : 'block';
      header.querySelector('.arrow').textContent = visible ? '▶' : '▼';
    });

    catBox.appendChild(header);
    catBox.appendChild(list);
    box.appendChild(catBox);
  });
}

/* --- Solicitudes (solicitudes.html) --- */
function initSolicitudes(){
  putUserHeaders();
  // generar número solicitud
  const user = JSON.parse(sessionStorage.getItem('ntr_user')||'{}');
  const now = new Date();
  const code = 'S' + now.getFullYear().toString().slice(-2) + (now.getMonth()+1).toString().padStart(2,'0') + now.getDate().toString().padStart(2,'0') + '-' + (user.id || '0');
  const numEl = document.getElementById('numSolicitud2'); if(numEl) numEl.value = code;

  document.getElementById('btnAddProduct2')?.addEventListener('click', e=>{ e.preventDefault(); addRowToList('itemsList2'); });
  document.getElementById('btnSubmit2')?.addEventListener('click', e=>{ e.preventDefault(); submitForm2(); });
  document.getElementById('btnCancel2')?.addEventListener('click', e=>{ e.preventDefault(); if(confirm('Cancelar solicitud actual?')) location.reload(); });
  document.getElementById('btnDownloadWeek')?.addEventListener('click', e=>{ e.preventDefault(); downloadThisWeekPDF(); });
  document.getElementById('btnClearHistory')?.addEventListener('click', e=>{ e.preventDefault(); if(confirm('Borrar historial demo?')){ localStorage.removeItem('ntr_history'); renderHistoryArea(); alert('Historial borrado.'); } });

  renderHistoryArea();
}

/* agrega fila producto al form */
function addRowToList(listId){
  const box = document.getElementById(listId);
  if(!box) return;
  const row = document.createElement('div'); row.className='item-row'; row.style.display='flex'; row.style.gap='8px'; row.style.alignItems='center'; row.style.marginBottom='8px';

  const sel = document.createElement('select'); sel.style.flex='1';
  CATALOG.forEach(it=>{ const o=document.createElement('option'); o.value=it.id; o.textContent = `${it.nombre} (${it.categoria}) — stock: ${it.stock}`; sel.appendChild(o); });

  const size = document.createElement('input'); size.type='text'; size.placeholder='Tamaño (opcional)'; size.style.flex='0.9';
  const qty = document.createElement('input'); qty.type='number'; qty.min=1; qty.value=1; qty.style.width='80px';
  const btnDel = document.createElement('button'); btnDel.className='btn ghost'; btnDel.textContent='Eliminar';
  btnDel.addEventListener('click', ev=>{ ev.preventDefault(); row.remove(); });

  const stockInfo = document.createElement('div'); stockInfo.style.color='var(--muted)'; stockInfo.textContent='Stock: ' + (CATALOG[0].stock);
  sel.addEventListener('change', ()=>{ const it = CATALOG.find(x=>x.id==sel.value); stockInfo.textContent='Stock: ' + (it?it.stock:'N/A'); });

  const left = document.createElement('div'); left.style.flex='1'; left.appendChild(sel); left.appendChild(size);
  const right = document.createElement('div'); right.style.display='flex'; right.style.alignItems='center'; right.style.gap='8px';
  right.appendChild(qty); right.appendChild(stockInfo); right.appendChild(btnDel);

  row.appendChild(left); row.appendChild(right);
  box.appendChild(row);
}

/* Submit demo para solicitudes */
function submitForm2(){
  const items = document.querySelectorAll('#itemsList2 .item-row');
  if(items.length===0){ alert('Agrega al menos un producto'); return; }
  const user = JSON.parse(sessionStorage.getItem('ntr_user')||'{}');
  const solicitud = { idSolicitud: document.getElementById('numSolicitud2').value, fecha: new Date().toISOString(), idTrabajador: user.id||'0', trabajador: user.name||'Anónimo', prioridad: document.getElementById('prioridad2').value==='true', destino: document.getElementById('destino2').value || '', items:[], estado:'Pendiente' };
  for(const r of items){
    const sel = r.querySelector('select');
    const qty = r.querySelector('input[type="number"]');
    const size = r.querySelector('input[type="text"]');
    const it = CATALOG.find(x=>x.id==sel.value);
    if(!it){ alert('Insumo no válido'); return; }
    const q = Number(qty.value); if(q<=0){ alert('Cantidad inválida'); return; }
    if(q>it.stock){ alert(`Stock insuficiente para ${it.nombre}. Disponible: ${it.stock}`); return; }
    solicitud.items.push({ idInsumo: it.id, nombre: it.nombre, cantidad: q, tamaño: size.value||''});
    it.stock -= q; //  restar stock
  }
  const hist = loadHistory(); hist.unshift(solicitud); saveHistory(hist);
  alert('Solicitud enviada: ' + solicitud.idSolicitud);
  document.getElementById('itemsList2').innerHTML=''; renderHistoryArea(); renderInventoryTable(); renderCatalog();
}

/* render historial */
function renderHistoryArea(){
  const area = document.getElementById('historyArea');
  if(!area) return;
  const hist = loadHistory();
  if(hist.length===0){ area.innerHTML='<div style="color:var(--muted)">No hay solicitudes.</div>'; return; }
  area.innerHTML = '';
  hist.forEach(s=>{
    const d = document.createElement('div'); d.className='history-card card'; d.style.marginBottom='8px';
    d.innerHTML = `<div style="font-weight:700">${s.idSolicitud} • ${s.trabajador} • ${s.estado}</div><div style="font-size:13px;color:var(--muted)">${new Date(s.fecha).toLocaleString()}</div><div style="margin-top:6px">${s.items.map(i=>`${i.nombre} x${i.cantidad}`).join(' · ')}</div>`;
    area.appendChild(d);
  });
}

/* --- Inventario: tabla y PDF --- */
function renderInventoryTable(){
  const el = document.getElementById('inventoryTable');
  if(!el) return;
  let html = '<table style="width:100%;border-collapse:collapse"><thead><tr><th style="text-align:left;padding:8px">ID</th><th style="text-align:left;padding:8px">Nombre</th><th style="text-align:left;padding:8px">Categoria</th><th style="text-align:left;padding:8px">Unidad</th><th style="text-align:right;padding:8px">Stock</th></tr></thead><tbody>';
  CATALOG.forEach(it=>{
    html += `<tr><td style="padding:8px">${it.id}</td><td style="padding:8px">${it.nombre}</td><td style="padding:8px">${it.categoria}</td><td style="padding:8px">${it.unidad}</td><td style="padding:8px;text-align:right">${it.stock}</td></tr>`;
  });
  html += '</tbody></table>';
  el.innerHTML = html;
}

/* Descargar inventario (usa html2canvas + jsPDF, disponibles en páginas que lo incluyan) */
async function downloadInventoryPDF(){
  const wrap = document.createElement('div'); wrap.style.padding='12px'; wrap.innerHTML = '<h3>Inventario</h3>' + (document.getElementById('inventoryTable')?.innerHTML || '');
  const canvas = await html2canvas(wrap);
  const imgData = canvas.toDataURL('image/png');
  const { jsPDF } = window.jspdf;
  const pdf = new jsPDF('p','pt','a4');
  const imgProps = pdf.getImageProperties(imgData);
  const pdfWidth = pdf.internal.pageSize.getWidth();
  const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
  pdf.addImage(imgData,'PNG',0,0,pdfWidth,pdfHeight);
  pdf.save('inventario.pdf');
}

/* Descarga solicitudes */
async function downloadThisWeekPDF(){
  const hist = loadHistory();
  if(hist.length===0){ alert('No hay solicitudes en historial'); return; }
  const oneWeekAgo = Date.now() - (7*24*60*60*1000);
  const sel = hist.filter(h=> new Date(h.fecha).getTime() >= oneWeekAgo);
  if(sel.length===0){ alert('No hay solicitudes en la última semana'); return; }
  const content = document.createElement('div'); content.style.padding='12px';
  content.innerHTML = `<h3>Solicitudes (última semana)</h3>` + sel.map(s=>`<div style="margin-bottom:8px"><strong>${s.idSolicitud}</strong> ${s.trabajador} • ${new Date(s.fecha).toLocaleString()}<div>${s.items.map(i=>`${i.nombre} x${i.cantidad}`).join(', ')}</div></div>`).join('');
  const canvas = await html2canvas(content);
  const imgData = canvas.toDataURL('image/png');
  const { jsPDF } = window.jspdf;
  const pdf = new jsPDF('p','pt','a4');
  const imgProps = pdf.getImageProperties(imgData);
  const pdfWidth = pdf.internal.pageSize.getWidth();
  const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
  pdf.addImage(imgData,'PNG',0,0,pdfWidth,pdfHeight);
  pdf.save('solicitudes_semana.pdf');
}

/* Buscar (buscar.html) */
if(document.getElementById('searchInput')){
  document.getElementById('searchInput').addEventListener('input', e=>{
    const q = e.target.value.trim().toLowerCase();
    const results = CATALOG.filter(it=> it.nombre.toLowerCase().includes(q) || it.categoria.toLowerCase().includes(q));
    const box = document.getElementById('searchResults'); box.innerHTML='';
    if(results.length===0){ box.innerHTML = '<div style="color:var(--muted)">No se encontraron resultados</div>'; return; }
    results.forEach(r=>{
      const d = document.createElement('div'); d.className='card'; d.style.marginBottom='8px';
      d.innerHTML = `<div style="font-weight:700">${r.nombre}</div><div style="font-size:13px;color:var(--muted)">${r.categoria} • ${r.unidad}</div><div style="margin-top:6px">Stock: <strong>${r.stock}</strong></div>`;
      box.appendChild(d);
    });
  });
}

/* --- Agregar insumo demo (en catalogo.html) --- */
if(document.getElementById('btnAddInsumo')){
  document.getElementById('btnAddInsumo').addEventListener('click', ()=>{
    const nombre = prompt("Nombre del nuevo insumo:");
    const categoria = prompt("Categoría del insumo (Ej: Cajas, Bolsas, etc.):");
    const unidad = prompt("Unidad de medida (Ej: unidad, kg, litro):");
    const stock = prompt("Stock inicial (número):");
    if(nombre && categoria && unidad && stock){
      CATALOG.push({ id: CATALOG.length + 1, nombre, categoria, unidad, stock: parseInt(stock) });
      alert("Insumo agregado correctamente (solo visual, no guardado permanente).");
      renderCatalog();
      renderInventoryTable();
    } else {
      alert("Debe completar todos los campos para agregar un insumo.");
    }
  });
}

/* run on load */
window.addEventListener('load', ()=>{
  putUserHeaders();
  if(document.getElementById('catalogo')) renderCatalog();
  if(document.getElementById('inventoryTable')) renderInventoryTable();
  if(document.getElementById('btnDownloadInv')) document.getElementById('btnDownloadInv').addEventListener('click', e=>{ e.preventDefault(); downloadInventoryPDF(); });
  if(document.getElementById('btnGenerateReport')) document.getElementById('btnGenerateReport').addEventListener('click', async e=>{
    e.preventDefault();
    // reutiliza descarga de semana como demo para cualquier rango: filtrado simple
    const from = document.getElementById('repFrom').value;
    const to = document.getElementById('repTo').value;
    const hist = loadHistory();
    const sel = hist.filter(h=>{
      if(!from && !to) return true;
      const d = new Date(h.fecha);
      if(from && d < new Date(from)) return false;
      if(to && d > new Date(to + 'T23:59:59')) return false;
      return true;
    });
    if(sel.length===0){ alert('No hay registros en ese rango'); return; }
    const content = document.createElement('div'); content.style.padding='12px';
    content.innerHTML = '<h3>Reporte (rango)</h3>' + sel.map(s=>`<div style="margin-bottom:8px"><strong>${s.idSolicitud}</strong> ${s.trabajador} • ${new Date(s.fecha).toLocaleString()}<div>${s.items.map(i=>`${i.nombre} x${i.cantidad}`).join(', ')}</div></div>`).join('');
    const canvas = await html2canvas(content);
    const imgData = canvas.toDataURL('image/png');
    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF('p','pt','a4');
    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
    pdf.addImage(imgData,'PNG',0,0,pdfWidth,pdfHeight);
    pdf.save('reporte.pdf');
  });

  // si estamos en solicitudes page inicializar
  if(document.getElementById('btnAddProduct2')) initSolicitudes();
});
/* --- Marcar opción activa en verde del menú superior --- */
function marcarMenuActivo(){
  const links = document.querySelectorAll('.menu a');
  const actual = window.location.pathname.split('/').pop();

  links.forEach(link => {
    const href = link.getAttribute('href');
    if(href === actual){
      link.classList.add('accent');
    } else {
      link.classList.remove('accent');
    }
  });
}

window.addEventListener('load', marcarMenuActivo);
