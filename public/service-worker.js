// import { precacheAndRoute } from 'workbox-precaching';
// import { registerRoute } from 'workbox-routing';
// import { NetworkFirst, CacheFirst, StaleWhileRevalidate } from 'workbox-strategies';
// import { ExpirationPlugin } from 'workbox-expiration';

// const MANIFEST_URL = '/manifest.webmanifest';
// const OFFLINE_URL = '/offline.html';
// const STATIC_CACHE = 'static-assets-v1';
// const IMAGE_CACHE = 'images-cache-v1';
// const API_CACHE = 'api-cache-v1';
// const NEXT_CACHE = 'next-static-v1';

// self.__WB_MANIFEST = self.__WB_MANIFEST || [];
// precacheAndRoute(self.__WB_MANIFEST);
// precacheAndRoute([
//   { url: OFFLINE_URL, revision: 'v1' },
//   { url: '/logo_192.png', revision: 'v1' },
//   { url: '/logo_512.png', revision: 'v1' },
// ]);

// self.addEventListener('install', (event) => {
//   self.skipWaiting();
//   event.waitUntil(
//     caches.open(STATIC_CACHE).then((cache) => {
//       return cache.addAll([OFFLINE_URL]).catch((error) => {
//         console.error('[SW] Failed to cache offline resources during install:', error);
//       });
//     })
//   );
// });

// self.addEventListener('activate', (event) => {
//   event.waitUntil(self.clients.claim());
// });

// registerRoute(
//   ({ request }) => request.mode === 'navigate',
//   new NetworkFirst({
//     cacheName: STATIC_CACHE,
//     networkTimeoutSeconds: 4,
//     plugins: [
//       new ExpirationPlugin({
//         maxEntries: 50,
//         maxAgeSeconds: 60 * 60 * 24 * 7,
//       }),
//     ],
//   })
// );

// // Manifest is intentionally NOT cached by the service worker.
// // Manifest files can change between builds and may return 401 when served
// // behind auth; caching them can lead to stale or error responses being stored.
// // Let the browser fetch the manifest from network so it always receives the
// // most recent version. (No runtime caching for manifest)


// registerRoute(
//   ({ url }) => url.origin === self.location.origin && url.pathname.startsWith('/_next/static'),
//   new CacheFirst({
//     cacheName: NEXT_CACHE,
//     plugins: [
//       new ExpirationPlugin({
//         maxEntries: 60,
//         maxAgeSeconds: 60 * 60 * 24 * 365,
//       }),
//     ],
//   })
// );

// registerRoute(
//   ({ request }) => request.destination === 'image',
//   new CacheFirst({
//     cacheName: IMAGE_CACHE,
//     plugins: [
//       new ExpirationPlugin({
//         maxEntries: 100,
//         maxAgeSeconds: 60 * 60 * 24 * 30,
//       }),
//     ],
//   })
// );

// registerRoute(
//   ({ url }) => url.pathname.startsWith('/api/') || url.origin.includes('expensetrackerapi.duckdns.org'),
//   new NetworkFirst({
//     cacheName: API_CACHE,
//     plugins: [
//       new ExpirationPlugin({
//         maxEntries: 50,
//         maxAgeSeconds: 60 * 5,
//       }),
//     ],
//   })
// );

// self.addEventListener('fetch', (event) => {
//   if (event.request.mode === 'navigate') {
//     event.respondWith(
//       fetch(event.request).catch((error) => {
//         console.error('[SW] Fetch failed, returning offline page:', error);
//         return caches.match(OFFLINE_URL);
//       })
//     );
//   }
// });

// self.addEventListener('push', (event) => {
//   const payload = event.data?.json() || {};
//   const title = payload.title || 'ExpenseTracker Notification';
//   const options = {
//     body: payload.body || 'You have a new notification.',
//     icon: '/logo_192.png',
//     badge: '/logo_192.png',
//     data: {
//       url: payload.url || '/',
//       ...payload.data,
//     },
//   };

//   event.waitUntil(self.registration.showNotification(title, options));
// });

// self.addEventListener('notificationclick', (event) => {
//   event.notification.close();
//   const url = event.notification.data?.url || '/';

//   event.waitUntil(
//     self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientsArr) => {
//       const existingClient = clientsArr.find((client) => client.url === url && 'focus' in client);
//       if (existingClient) {
//         return existingClient.focus();
//       }
//       if (self.clients.openWindow) {
//         return self.clients.openWindow(url);
//       }
//       return null;
//     })
//   );
// });

// self.addEventListener('message', (event) => {
//   if (event.data && event.data.type === 'SKIP_WAITING') {
//     self.skipWaiting();
//   }
// });


// 1. Load Workbox from CDN
importScripts('https://googleapis.com');

if (workbox) {
  console.log('Workbox is loaded! 🎉');
  const { precaching, routing, strategies, expiration } = workbox;

  const OFFLINE_URL = '/offline.html';
  const STATIC_CACHE = 'static-assets-v1';
  const IMAGE_CACHE = 'images-cache-v1';
  const API_CACHE = 'api-cache-v1';
  const NEXT_CACHE = 'next-static-v1';

  // 2. Precaching
  // Note: self.__WB_MANIFEST is usually injected by a build tool (like next-pwa).
  // If you aren't using a build tool, this will just be an empty array.
  precaching.precacheAndRoute(self.__WB_MANIFEST || []);
  precaching.precacheAndRoute([
    { url: OFFLINE_URL, revision: 'v1' },
    { url: '/logo_192.png', revision: 'v1' },
    { url: '/logo_512.png', revision: 'v1' },
  ]);

  // 3. Routing Logic using the 'routing' and 'strategies' objects
  routing.registerRoute(
    ({ request }) => request.mode === 'navigate',
    new strategies.NetworkFirst({
      cacheName: STATIC_CACHE,
      networkTimeoutSeconds: 4,
      plugins: [
        new expiration.ExpirationPlugin({
          maxEntries: 50,
          maxAgeSeconds: 60 * 60 * 24 * 7,
        }),
      ],
    })
  );

  routing.registerRoute(
    ({ url }) => url.origin === self.location.origin && url.pathname.startsWith('/_next/static'),
    new strategies.CacheFirst({
      cacheName: NEXT_CACHE,
      plugins: [
        new expiration.ExpirationPlugin({
          maxEntries: 60,
          maxAgeSeconds: 60 * 60 * 24 * 365,
        }),
      ],
    })
  );

  routing.registerRoute(
    ({ request }) => request.destination === 'image',
    new strategies.CacheFirst({
      cacheName: IMAGE_CACHE,
      plugins: [
        new expiration.ExpirationPlugin({
          maxEntries: 100,
          maxAgeSeconds: 60 * 60 * 24 * 30,
        }),
      ],
    })
  );

  routing.registerRoute(
    ({ url }) => url.pathname.startsWith('/api/') || url.origin.includes('expensetrackerapi.duckdns.org'),
    new strategies.NetworkFirst({
      cacheName: API_CACHE,
      plugins: [
        new expiration.ExpirationPlugin({
          maxEntries: 50,
          maxAgeSeconds: 60 * 5,
        }),
      ],
    })
  );
}else{
  console.log('Workbox failed to load.');
}

// --- Standard Event Listeners (Keep these as they are) ---

self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open('static-assets-v1').then((cache) => {
      return cache.addAll(['/offline.html']).catch((error) => {
        console.error('[SW] Failed to cache offline resources:', error);
      });
    })
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', (event) => {
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request).catch((error) => {
        console.error('[SW] Fetch failed, returning offline page:', error);
        return caches.match('/offline.html');
      })
    );
  }
});

self.addEventListener('push', (event) => {
  const payload = event.data?.json() || {};
  const title = payload.title || 'ExpenseTracker Notification';
  const options = {
    body: payload.body || 'You have a new notification.',
    icon: '/logo_192.png',
    badge: '/logo_192.png',
    data: { url: payload.url || '/', ...payload.data },
  };
  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const url = event.notification.data?.url || '/';
  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientsArr) => {
      const existingClient = clientsArr.find((client) => client.url === url && 'focus' in client);
      if (existingClient) return existingClient.focus();
      if (self.clients.openWindow) return self.clients.openWindow(url);
    })
  );
});

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
