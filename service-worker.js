// ── VERSIÓN — cambia esto cada vez que hagas cambios ──────────────────────
const APP_VERSION = 'v1.0.3';
// ──────────────────────────────────────────────────────────────────────────

const CACHE_STATIC  = `custompad-static-${APP_VERSION}`;
const CACHE_DYNAMIC = `custompad-dynamic-${APP_VERSION}`;
const CACHE_IMAGES  = `custompad-images-${APP_VERSION}`;

// Archivos que se precargan en la instalación (shell de la app)
const PRECACHE = [
  './',
  './index.html',
  './product.html',
  './offline.html',
  './manifest.json',
  './products.json',
  './icon-192.png',
  './icon-512.png'
];

// ── INSTALL: precachear shell ─────────────────────────────────────────────
self.addEventListener('install', event => {
  console.log(`[SW] Instalando ${APP_VERSION}`);
  event.waitUntil(
    caches.open(CACHE_STATIC)
      .then(cache => cache.addAll(PRECACHE))
      .then(() => {
        console.log('[SW] Shell cacheado');
        // Activar inmediatamente sin esperar a que se cierren las tabs viejas
        return self.skipWaiting();
      })
  );
});

// ── ACTIVATE: limpiar caches viejas ──────────────────────────────────────
self.addEventListener('activate', event => {
  console.log(`[SW] Activando ${APP_VERSION}`);
  event.waitUntil(
    caches.keys().then(keys => {
      const toDelete = keys.filter(k =>
        (k.startsWith('custompad-static-')  && k !== CACHE_STATIC)  ||
        (k.startsWith('custompad-dynamic-') && k !== CACHE_DYNAMIC) ||
        (k.startsWith('custompad-images-')  && k !== CACHE_IMAGES)
      );
      return Promise.all(toDelete.map(k => {
        console.log(`[SW] Eliminando cache antigua: ${k}`);
        return caches.delete(k);
      }));
    }).then(() => {
      // Tomar control de todas las tabs abiertas inmediatamente
      return self.clients.claim();
    }).then(() => {
      // Notificar a todas las tabs que hay una nueva versión
      return self.clients.matchAll({ type: 'window' });
    }).then(clients => {
      clients.forEach(client => {
        client.postMessage({ type: 'SW_UPDATED', version: APP_VERSION });
      });
    })
  );
});

// ── FETCH: estrategia por tipo de recurso ────────────────────────────────
self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);

  // Ignorar peticiones que no sean GET o que no sean del mismo origen
  if (request.method !== 'GET') return;
  if (!url.origin === location.origin && !request.url.startsWith('http')) return;

  // ── Fuentes de Google: cache-first ──────────────────────────────────
  if (url.hostname === 'fonts.googleapis.com' || url.hostname === 'fonts.gstatic.com') {
    event.respondWith(cacheFirst(request, CACHE_DYNAMIC));
    return;
  }

  // ── Imágenes de productos: cache-first (pesan mucho, cambian poco) ──
  if (request.url.includes('/images/')) {
    event.respondWith(cacheFirst(request, CACHE_IMAGES));
    return;
  }

  // ── products.json: network-first (datos siempre frescos) ────────────
  if (request.url.endsWith('products.json')) {
    event.respondWith(networkFirst(request, CACHE_STATIC));
    return;
  }

  // ── HTML y demás: network-first con fallback offline ────────────────
  if (request.headers.get('accept')?.includes('text/html')) {
    event.respondWith(networkFirstHtml(request));
    return;
  }

  // ── Resto (CSS en línea, etc.): cache-first ─────────────────────────
  event.respondWith(cacheFirst(request, CACHE_DYNAMIC));
});

// ── ESTRATEGIAS ──────────────────────────────────────────────────────────

// Cache-first: sirve del cache, si no existe va a red y lo guarda
async function cacheFirst(request, cacheName) {
  const cached = await caches.match(request);
  if (cached) return cached;
  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(cacheName);
      cache.put(request, response.clone());
    }
    return response;
  } catch {
    return new Response('Recurso no disponible offline', { status: 503 });
  }
}

// Network-first: intenta red, si falla usa cache
async function networkFirst(request, cacheName) {
  try {
    const response = await fetch(request, { cache: 'no-store' });
    if (response.ok) {
      const cache = await caches.open(cacheName);
      cache.put(request, response.clone());
    }
    return response;
  } catch {
    const cached = await caches.match(request);
    return cached || new Response('{}', { status: 503, headers: { 'Content-Type': 'application/json' } });
  }
}

// Network-first para HTML con fallback a offline.html
async function networkFirstHtml(request) {
  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(CACHE_STATIC);
      cache.put(request, response.clone());
    }
    return response;
  } catch {
    const cached = await caches.match(request);
    if (cached) return cached;
    return caches.match('./offline.html');
  }
}

// ── MENSAJES desde la página ─────────────────────────────────────────────
self.addEventListener('message', event => {
  if (event.data?.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
