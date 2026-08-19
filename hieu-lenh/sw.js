const CACHE_NAME = 'hieulenh-audio-v26';
const ASSETS_TO_CACHE = [
  './index.html',
  './hieulenh.css',
  './hieulenh.js',
  './audio/00_NHAC_MO_DON_SAN_KHAU.mp3',
  './audio/01_CHO_SUA.mp3',
  './audio/03_RAN_GIAT_MINH.mp3?v=20260819-7s',
  './audio/04_SAM_CHOP.mp3',
  './audio/05_NHAC_KET.mp3'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[SW] Pre-caching audio assets and app files...');
      return cache.addAll(ASSETS_TO_CACHE);
    }).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((name) => {
          if (name !== CACHE_NAME) {
            console.log('[SW] Deleting old cache:', name);
            return caches.delete(name);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // Nếu request là URL hiệu lệnh thì map về index.html trong cache
  if (url.pathname.endsWith('/hieulenh') || url.pathname.endsWith('/hieu-lenh')) {
    const htmlUrl = new URL('./index.html', self.registration.scope);
    const htmlRequest = new Request(htmlUrl);
    event.respondWith(
      caches.match(htmlRequest).then((response) => {
        return response || fetch(event.request);
      })
    );
    return;
  }

  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});
