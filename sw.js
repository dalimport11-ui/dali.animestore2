// sw.js — Cache estático + dinámico para ANIMESTORE
const CACHE_NAME = 'animestore-cache-v1';
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/public/catalogo.html',
  '/css/styles.css',
  '/css/catalogo.css',
  '/js/products.js',
  '/js/seed.js',
  '/assets/img/placeholder.png',
];

// Instalación del SW y cacheo inicial
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(STATIC_ASSETS);
    })
  );
  self.skipWaiting();
});

// Activación (limpiar versiones viejas)
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.map(key => key !== CACHE_NAME && caches.delete(key))
      );
    })
  );
  self.clients.claim();
});

// Interceptar peticiones (Cache First, luego red)
self.addEventListener('fetch', event => {
  const request = event.request;
  
  // Evitar cache de llamadas POST o API dinámicas
  if (request.method !== 'GET') return;

  event.respondWith(
    caches.match(request).then(cachedResponse => {
      if (cachedResponse) {
        return cachedResponse; // servir desde cache
      }

      return fetch(request).then(networkResponse => {
        // guardar en cache si es imagen o gif
        if (networkResponse.ok && /\.(gif|jpg|jpeg|png|webp|js|css)$/.test(request.url)) {
          caches.open(CACHE_NAME).then(cache => {
            cache.put(request, networkResponse.clone());
          });
        }
        return networkResponse;
      }).catch(() => {
        // fallback si no hay conexión
        return caches.match('/assets/img/placeholder.png');
      });
    })
  );
});