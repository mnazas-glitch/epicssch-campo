// EPICSSCH Campo: deja la página guardada en el equipo para abrirla sin internet.
// Cambie VERSION en cada publicación: así el equipo toma la página nueva.
const VERSION = "campo-1.1.0";
const ARCHIVOS = ["./", "index.html", "manifest.webmanifest", "icono-180.png", "icono-192.png", "icono-512.png"];
self.addEventListener("install", e => { e.waitUntil(caches.open(VERSION).then(c => c.addAll(ARCHIVOS)).then(() => self.skipWaiting())); });
self.addEventListener("activate", e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== VERSION).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
// Primero la red (para tomar la versión nueva si hay señal) y, sin señal, la copia guardada.
self.addEventListener("fetch", e => {
  if (e.request.method !== "GET" || new URL(e.request.url).origin !== location.origin) return;
  e.respondWith(fetch(e.request).then(r => { const c = r.clone(); caches.open(VERSION).then(k => k.put(e.request, c)); return r; })
    .catch(() => caches.match(e.request).then(r => r || caches.match("index.html"))));
});
