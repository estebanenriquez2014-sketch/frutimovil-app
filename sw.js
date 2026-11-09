// Service worker de la app Frutimóvil: recibe notificaciones push (sin contenido) y busca el aviso en el servidor.
const TOKEN = new URL(self.location.href).searchParams.get('t') || '';
const API = 'https://frutimovil.duckdns.org/webhook/fm-app-api';
const INICIO = './?t=' + encodeURIComponent(TOKEN);
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', e => e.waitUntil(self.clients.claim()));
self.addEventListener('push', e => {
  e.waitUntil((async () => {
    let d = {};
    try { if (e.data) d = e.data.json(); } catch (err) {}
    if (!d.titulo) {
      try {
        const r = await fetch(API, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ accion: 'avisos', token: TOKEN }) });
        d = await r.json();
      } catch (err) {}
    }
    await self.registration.showNotification(d.titulo || 'Frutimóvil', {
      body: d.cuerpo || 'Tienes un aviso nuevo',
      icon: 'icono-192.png',
      badge: 'icono-192.png',
      tag: 'fm-' + Date.now(),
      data: { url: INICIO },
    });
  })());
});
self.addEventListener('notificationclick', e => {
  e.notification.close();
  e.waitUntil((async () => {
    const ventanas = await self.clients.matchAll({ type: 'window', includeUncontrolled: true });
    for (const v of ventanas) if ('focus' in v) return v.focus();
    return self.clients.openWindow(e.notification.data.url);
  })());
});
