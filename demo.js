// Modo demostración de la app Frutimóvil: se activa abriendo la app con ?demo
// Usa datos inventados y NO toca el servidor ni la hoja. Sirve para mostrar la app y para grabar el video.
(function () {
  const iso = d => new Date(d.getTime() - d.getTimezoneOffset() * 6e4).toISOString().slice(0, 10);
  const dia = n => { const d = new Date(); d.setDate(d.getDate() + n); return iso(d); };
  const hora = (n, h) => dia(n) + ' ' + h;
  const espera = ms => new Promise(r => setTimeout(r, ms));
  const $$ = n => '$' + n.toFixed(2);
  const DL = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'], ML = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
  const bonita = f => { const d = new Date(f + 'T12:00:00'); return DL[d.getDay()][0].toUpperCase() + DL[d.getDay()].slice(1) + ' ' + d.getDate() + ' de ' + ML[d.getMonth()]; };
  const PRECIO = { 'FRE-GR': 2.8, 'FRE-DP': 3.2, 'MOR-01': 4.5, 'FRA-PR': 12, 'FRA-MD': 9, 'ARA-01': 11, 'MIX-20': 6 };
  const productos = [['FRE-GR', 'Fresa Grande', 'kg'], ['FRE-DP', 'Fresa Despistonada', 'kg'], ['MOR-01', 'Mora', 'kg'], ['FRA-PR', 'Frambuesa Primera', 'kg'], ['FRA-MD', 'Frambuesa Madura', 'kg'], ['ARA-01', 'Arándano', 'kg'], ['MIX-20', 'Mix Congelado', 'funda']].map(p => ({ codigo: p[0], nombre: p[1], unidad: p[2] }));
  const nombreDe = c => (productos.find(p => p.codigo === c) || {}).nombre || c;
  const st = (codigo, kg, minimo, lotes, diasViejo, vence, estado, piden) => ({ codigo, nombre: nombreDe(codigo), unidad: codigo === 'MIX-20' ? 'funda' : 'kg', kg, minimo, lotes, diasViejo, vence: vence == null ? null : dia(vence), diasVence: vence, estado, piden, comprar: Math.max(0, Math.round((piden - kg) * 100) / 100) });
  const ped = (id, cliente, tipo, entrega, items) => ({ id, cliente, tipo, entrega: dia(entrega), items: items.map(i => ({ producto: nombreDe(i[0]), cantidad: i[1], unidad: i[2] || 'kg', presentacion: i[3] || 'kg' })), total: Math.round(items.reduce((s, i) => s + i[1] * (i[4] || PRECIO[i[0]]), 0) * 100) / 100 });
  const res = (cab, lineas, total) => cab + '\n' + lineas.join('\n') + (total != null ? '\nTotal: ' + $$(total) : '');
  const stock = [st('FRE-GR', 18.5, 5, 2, 1, 3, 'fresco', 30), st('FRE-DP', 6, 3, 1, 0, 3, 'fresco', 0), st('MOR-01', 4, 3, 1, 2, 1, 'manana', 3), st('FRA-PR', 2, 3, 1, 3, 0, 'hoy', 10), st('FRA-MD', 0, 2, 0, null, null, 'sin', 0), st('ARA-01', 9, 3, 1, 4, 8, 'fresco', 7), st('MIX-20', 12, 4, 1, 6, null, 'fresco', 0)];
  const pedidos = [
    ped('P-0009', 'Uko', 'MAYORISTA', -1, [['FRE-GR', 6, 'kg', 'kg', 2.4]]),
    ped('P-0010', 'Hotel', 'MAYORISTA', 0, [['FRE-GR', 20, 'kg', 'kg', 2.2], ['FRA-PR', 8], ['ARA-01', 7]]),
    ped('P-0011', 'Datu Deli', 'MAYORISTA', 0, [['FRE-GR', 4, 'kg', 'kg', 4], ['MOR-01', 3]]),
    ped('P-0012', 'Círculo Militar', 'MAYORISTA', 1, [['FRA-PR', 2]]),
  ];
  const mov = (numero, d, h, usuario, tipo, resumen) => ({ numero, op_id: 'OP-DEMO' + numero, fecha: hora(d, h), usuario, tipo, texto: resumen.split('\n')[0], resumen });
  const actividad = [
    mov(48, 0, '09:12', 'Sandra', 'entrega', res('🚚 Entrega P-0008 — Chorigol', ['• 5 kg Fresa Grande × $2.80 = $14.00', '• 3 kg Mora × $4.50 = $13.50', '• 2 kg Arándano × $11.00 = $22.00'], 49.5)),
    mov(47, 0, '08:40', 'Esteban', 'pedido', res('📝 Pedido P-0012 — Círculo Militar', ['Entrega: ' + bonita(dia(1)), '• 2 kg Frambuesa Primera × $12.00 = $24.00'], 24)),
    mov(46, -1, '19:05', 'Esteban', 'compra', res('🧾 Compra a Fabricio', ['• 20 kg Fresa Grande × $1.40 = $28.00', '• 6 kg Fresa Despistonada × $1.60 = $9.60'], 37.6)),
    mov(45, -1, '16:30', 'Sandra', 'cobro', res('💵 Cobro a HPG', ['Transferencia', 'Saldo anterior: $64.00'], 64)),
    mov(44, -1, '11:20', 'Sandra', 'venta', res('💰 Venta — Cliente final', ['• 3 × 500 g Fresa Grande × $2.50 = $7.50'], 7.5)),
    mov(43, -2, '18:10', 'Esteban', 'pedido', res('📝 Pedido P-0010 — Hotel', ['Entrega: ' + bonita(dia(0)), '• 20 kg Fresa Grande × $2.20 = $44.00', '• 8 kg Frambuesa Primera × $12.00 = $96.00', '• 7 kg Arándano × $11.00 = $77.00'], 217)),
  ];
  const vend = [142, 196.5, 88, 231, 174.5, 266.5, 186];
  const TB = {
    ahora: hora(0, '09:30'),
    numeros: { hoy: { vendido: 186, ganancia: 61.4 }, semana: { vendido: 1284.5, ganancia: 412.3 }, semanaPasada: { vendido: 1105 }, mes: { vendido: 4920.75, ganancia: 1580.2, botado: 14.4, compras: 3100 }, teDeben: 306.9, debes: 156, dias: vend.map((v, i) => ({ fecha: dia(i - 6), vendido: v })) },
    stock, pedidos,
    deudas: [{ cliente: 'Hotel', debe: 186.4, ventas: 2, desde: dia(-9), dias: 9 }, { cliente: 'Uko', debe: 72, ventas: 1, desde: dia(-3), dias: 3 }, { cliente: 'Chorigol', debe: 48.5, ventas: 1, desde: dia(-1), dias: 1 }],
    debesA: [{ proveedor: 'Fabricio', debe: 96 }, { proveedor: 'Lidia', debe: 60 }],
    actividad,
    listas: {
      productos,
      clientes: ['Hotel', 'HPG', 'Uko', 'Club', 'Datu Deli', 'Chorigol', 'Círculo Militar'].map(n => ({ nombre: n, tipo: 'MAYORISTA', sedes: n === 'Datu Deli' ? ['Cumbayá', 'Quito'] : n === 'Uko' ? ['República', 'Irlanda'] : [] })),
      proveedores: ['Fabricio', 'Lidia', 'Dario', 'Lili', 'Mercado'],
      presentaciones: [{ codigo: 'FRE-GR', presentacion: '500 g' }, { codigo: 'FRE-GR', presentacion: '1 kg' }, { codigo: 'FRA-PR', presentacion: '250 g' }, { codigo: 'ARA-01', presentacion: '125 g' }],
    },
  };
  const derivar = () => { TB.alertas = TB.stock.filter(s => s.estado === 'hoy' || s.estado === 'manana'); TB.comprar = TB.stock.filter(s => s.comprar > 0); };
  derivar();
  // Catálogo de demostración: precios, costos y gastos (pantallas "Precios y costos" y "Gastos").
  const COSTO = { 'FRE-GR': 1.4, 'FRE-DP': 1, 'MOR-01': 1.67, 'FRA-PR': 8, 'FRA-MD': 7.5, 'ARA-01': 8, 'MIX-20': 9.54 };
  TB.catalogo = {
    productos: productos.map(p => ({ codigo: p.codigo, nombre: p.nombre, unidad: p.unidad, activo: true })),
    precios: productos.flatMap(p => [{ codigo: p.codigo, lista: 'COSTO', presentacion: p.unidad, precio: COSTO[p.codigo], nota: '' }, { codigo: p.codigo, lista: 'GENERAL', presentacion: p.unidad, precio: PRECIO[p.codigo], nota: '' }]).concat([{ codigo: 'FRE-GR', lista: 'Hotel', presentacion: 'kg', precio: 2.2, nota: '' }, { codigo: 'OTRO:Naranja', lista: 'COSTO', presentacion: 'kg', precio: 2.33, nota: '' }, { codigo: 'OTRO:Naranja', lista: 'Datu', presentacion: 'kg', precio: 4.5, nota: '' }]),
    listas: ['Hotel', 'HPG', 'Uko', 'Club', 'Datu'],
    gastos: [{ id: 'G-0002', fecha: hora(0, '08:10'), categoria: 'Gasolina', monto: 10, nota: '', usuario: 'Esteban' }, { id: 'G-0001', fecha: hora(-2, '17:30'), categoria: 'Empaques', monto: 24.5, nota: 'tarrinas 500 g', usuario: 'Sandra' }],
    categorias: ['Gasolina', 'Empaques', 'Transporte', 'Otro'],
  };
  const recalcGastos = () => { const t = TB.catalogo.gastos.reduce((s, g) => s + g.monto, 0), N = TB.numeros; N.hoy.gastos = 10; N.semana.gastos = t; N.mes.gastos = t; N.hoy.neta = N.hoy.ganancia - 10; N.semana.neta = N.semana.ganancia - t; N.mes.neta = N.mes.ganancia - t - N.mes.botado; };
  recalcGastos();
  function demoGuardar(b) {
    const c = TB.catalogo;
    if (b.op === 'precio') { const f = c.precios.find(p => p.codigo === b.codigo && p.lista === b.lista && p.presentacion === b.presentacion); const v = b.precio === '' ? null : Number(b.precio); if (f) f.precio = v; else c.precios.push({ codigo: b.codigo, lista: b.lista, presentacion: b.presentacion || 'kg', precio: v, nota: '' }); return { ok: true, mensaje: b.lista === 'COSTO' ? 'Costo guardado' : 'Precio guardado' }; }
    if (b.op === 'producto') { const nombre = b.nombre.charAt(0).toUpperCase() + b.nombre.slice(1), codigo = nombre.slice(0, 3).toUpperCase() + '-01'; if (c.productos.some(p => p.nombre.toLowerCase() === nombre.toLowerCase())) return { ok: false, error: 'Ya existe: ' + nombre + '.' }; c.productos.push({ codigo, nombre, unidad: b.unidad, activo: true }); TB.listas.productos.push({ codigo, nombre, unidad: b.unidad }); TB.stock.push({ codigo, nombre, unidad: b.unidad, kg: 0, minimo: 0, lotes: 0, diasViejo: null, vence: null, diasVence: null, estado: 'sin', piden: 0, comprar: 0 }); if (b.costo != null) c.precios.push({ codigo, lista: 'COSTO', presentacion: b.unidad, precio: b.costo, nota: '' }); if (b.precio != null) c.precios.push({ codigo, lista: 'GENERAL', presentacion: b.unidad, precio: b.precio, nota: '' }); return { ok: true, mensaje: nombre + ' ya está en el catálogo' }; }
    if (b.op === 'producto_activo') { const f = c.productos.find(p => p.codigo === b.codigo); if (f) f.activo = !!b.activo; return { ok: true, mensaje: b.activo ? 'Producto activado' : 'Producto oculto' }; }
    if (b.op === 'cliente') { TB.listas.clientes.push({ nombre: b.nombre, tipo: b.tipo, sedes: [] }); return { ok: true, mensaje: b.nombre + ' guardado como cliente' }; }
    if (b.op === 'gasto') { c.gastos.unshift({ id: 'G-' + Date.now(), fecha: (b.fecha || dia(0)) + ' 12:00', categoria: b.categoria, monto: Number(b.monto), nota: b.nota || '', usuario: 'Esteban' }); recalcGastos(); return { ok: true, mensaje: 'Gasto anotado' }; }
    if (b.op === 'gasto_borrar') { c.gastos = c.gastos.filter(g => g.id !== b.id); recalcGastos(); return { ok: true, mensaje: 'Gasto borrado' }; }
    return { ok: false, error: 'No entendí qué guardar.' };
  }

  let pend = null, n = 12;
  const confirmar = texto => ({ texto: texto + '\n\n¿Lo registro?', botones: [{ id: 'si', titulo: '✅ Sí' }, { id: 'no', titulo: '✏️ Corregir' }] });
  function armar(I) {
    const items = (I.items || []).map(i => { const cod = (productos.find(p => p.codigo === i.producto || p.nombre === i.producto) || {}).codigo || i.producto; const precio = i.precio_unitario != null ? Number(i.precio_unitario) : PRECIO[cod] || 0; return { cod, cant: Number(i.cantidad), precio, linea: '• ' + (i.unidad === 'tarrina' ? i.cantidad + ' × ' + i.presentacion : i.cantidad + ' kg') + ' ' + nombreDe(cod) + ' × ' + $$(precio) + ' = ' + $$(i.cantidad * precio) }; });
    const total = items.reduce((s, i) => s + i.cant * i.precio, 0);
    if (I.intencion === 'pedido') { const id = 'P-00' + (++n); const ent = I.fecha_entrega || dia(1); return { tipo: 'pedido', pedido: ped(id, I.cliente, 'MAYORISTA', 0, []), items, total, ent, texto: '📝 *Pedido ' + id + ' — ' + I.cliente + '*\nEntrega: ' + bonita(ent) + '\n' + items.map(i => i.linea).join('\n') + '\n*Total: ' + $$(total) + '*' }; }
    if (I.intencion === 'compra') return { tipo: 'compra', items, total, texto: '🧾 *Compra a ' + (I.proveedor || 'proveedor') + '*\n' + items.map(i => i.linea).join('\n') + '\n*Total: ' + $$(total) + '*' };
    if (I.intencion === 'venta') return { tipo: 'venta', items, total, texto: '💰 *Venta — ' + (I.cliente || 'Cliente final') + '*\n' + items.map(i => i.linea).join('\n') + '\n*Total: ' + $$(total) + '*' };
    if (I.intencion === 'entrega') { const p = TB.pedidos.find(x => x.id === I.pedido_ref); return { tipo: 'entrega', ref: I.pedido_ref, total: p ? p.total : 0, items: [], texto: '🚚 *Entrega ' + I.pedido_ref + ' — ' + (p ? p.cliente : '') + '*\n' + (p ? p.items.map(i => '• ' + i.cantidad + ' kg ' + i.producto).join('\n') : '') + '\n*Total: ' + $$(p ? p.total : 0) + '*' }; }
    if (I.intencion === 'cobro') return { tipo: 'cobro', items: [], total: I.monto, texto: '💵 *Cobro a ' + I.cliente + '*\n' + (I.medio === 'efectivo' ? 'Efectivo' : 'Transferencia') + '\n*Total: ' + $$(I.monto) + '*' };
    if (I.intencion === 'pago_proveedor') return { tipo: 'pago', items: [], total: I.monto, texto: '🤝 *Pago a ' + I.proveedor + '*\n' + (I.medio === 'efectivo' ? 'Efectivo' : 'Transferencia') + '\n*Total: ' + $$(I.monto) + '*' };
    return { tipo: 'merma', items, total: 0, texto: '🗑️ *Fruta botada*\n' + items.map(i => '• ' + i.cant + ' kg ' + nombreDe(i.cod)).join('\n') };
  }
  function registrar(p) {
    const numero = TB.actividad[0].numero + 1;
    TB.actividad.unshift(mov(numero, 0, new Date().toTimeString().slice(0, 5), 'Esteban', p.tipo, p.texto.replace(/[*_]/g, '').replace('\nTotal', '\nTotal')));
    if (p.tipo === 'pedido') { p.pedido.entrega = p.ent; p.pedido.total = Math.round(p.total * 100) / 100; p.pedido.items = p.items.map(i => ({ producto: nombreDe(i.cod), cantidad: i.cant, unidad: 'kg', presentacion: 'kg' })); TB.pedidos.push(p.pedido); TB.pedidos.sort((a, b) => a.entrega.localeCompare(b.entrega)); p.items.forEach(i => { const s = TB.stock.find(x => x.codigo === i.cod); if (s) { s.piden += i.cant; s.comprar = Math.max(0, Math.round((s.piden - s.kg) * 100) / 100); } }); }
    if (p.tipo === 'entrega') { TB.pedidos = TB.pedidos.filter(x => x.id !== p.ref); TB.numeros.hoy.vendido += p.total; TB.numeros.semana.vendido += p.total; TB.numeros.dias[6].vendido += p.total; }
    if (p.tipo === 'compra') p.items.forEach(i => { const s = TB.stock.find(x => x.codigo === i.cod); if (s) { s.kg += i.cant; s.lotes++; s.estado = s.estado === 'sin' ? 'fresco' : s.estado; s.diasViejo = s.diasViejo == null ? 0 : s.diasViejo; s.comprar = Math.max(0, Math.round((s.piden - s.kg) * 100) / 100); } });
    derivar();
  }
  window.FM_DEMO = {
    TB,
    async api(b) {
      if (b.accion === 'hola') return { nombre: 'Esteban' };
      if (b.accion === 'guardar') { await espera(300); return demoGuardar(b); }
      if (b.accion === 'tablero') { await espera(350); return JSON.parse(JSON.stringify(TB)); }
      if (b.accion === 'documento') {
        await espera(6200);
        pend = armar({ intencion: 'pedido', cliente: 'Club', fecha_entrega: dia(2), items: [{ producto: 'FRE-GR', cantidad: 10, unidad: 'kg', precio_unitario: 2.8 }, { producto: 'FRA-PR', cantidad: 2, unidad: 'kg', precio_unitario: 12 }] });
        return Object.assign(confirmar(pend.texto), { documento: { tipo: 'pedido', referencia: '11237', total: 52, quien: 'Club', fecha: dia(-1), fecha_entrega: dia(2), duda: '', items: [{ producto: 'Fresa Grande', cantidad: 10, unidad: 'kg', precio_unitario: 2.8 }, { producto: 'Frambuesa Primera', cantidad: 2, unidad: 'kg', precio_unitario: 12 }] } });
      }
      if (b.accion === 'mensaje') {
        await espera(900);
        if (b.interpretacion) { pend = armar(b.interpretacion); return confirmar(pend.texto); }
        if (b.boton_id === 'si' && pend) { const p = pend; pend = null; registrar(p); return { texto: '✅ Registrado.\n' + p.texto, botones: [] }; }
        if (b.boton_id) { pend = null; return { texto: 'Listo, no registré nada.', botones: [] }; }
        const t = String(b.texto || '').toLowerCase();
        if (/stock|hay en/.test(t)) return { texto: '📦 *Stock ahora*\n' + TB.stock.filter(s => s.kg > 0).map(s => '• ' + s.nombre + ': ' + s.kg + (s.unidad === 'funda' ? ' fundas' : ' kg')).join('\n'), botones: [] };
        if (/debe/.test(t)) return { texto: '💳 *Te deben ' + $$(TB.numeros.teDeben) + '*\n' + TB.deudas.map(d => '• ' + d.cliente + ': ' + $$(d.debe) + ' (hace ' + d.dias + ' días)').join('\n'), botones: [] };
        if (/comprar/.test(t)) return { texto: '🛒 *Hay que comprar*\n' + TB.comprar.map(c => '• ' + c.comprar + ' kg de ' + c.nombre).join('\n'), botones: [] };
        if (/semana|vendi/.test(t)) return { texto: '📈 Esta semana vendimos *' + $$(TB.numeros.semana.vendido) + '* y ganamos *' + $$(TB.numeros.semana.ganancia) + '*.', botones: [] };
        pend = armar({ intencion: 'pedido', cliente: 'Hotel', fecha_entrega: dia(1), items: [{ producto: 'FRE-GR', cantidad: 20, unidad: 'kg', precio_unitario: 2.2 }, { producto: 'FRA-PR', cantidad: 8, unidad: 'kg' }] });
        return confirmar(pend.texto);
      }
      return {};
    },
  };
})();
