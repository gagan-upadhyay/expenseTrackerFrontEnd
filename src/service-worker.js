import { precacheAndRoute } from 'workbox-precaching';
import { registerRoute } from 'workbox-routing';
import { NetworkFirst, CacheFirst, StaleWhileRevalidate } from 'workbox-strategies';
import { ExpirationPlugin } from 'workbox-expiration';

const MANIFEST_URL = '/manifest.webmanifest';
const OFFLINE_URL = '/offline.html';
const STATIC_CACHE = 'static-assets-v1';
const IMAGE_CACHE = 'images-cache-v1';
const API_CACHE = 'api-cache-v1';
const NEXT_CACHE = 'next-static-v1';

self.__WB_MANIFEST = self.__WB_MANIFEST || [];
precacheAndRoute(self.__WB_MANIFEST);
precacheAndRoute([
  { url: MANIFEST_URL, revision: 'v1' },
  { url: OFFLINE_URL, revision: 'v1' },
  { url: '/logo_192.png', revision: 'v1' },
  { url: '/logo_512.png', revision: 'v1' },
]);

self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => cache.addAll([OFFLINE_URL, MANIFEST_URL]))
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

registerRoute(
  ({ request }) => request.mode === 'navigate',
  new NetworkFirst({
    cacheName: STATIC_CACHE,
    networkTimeoutSeconds: 4,
    plugins: [
      new ExpirationPlugin({
        maxEntries: 50,
        maxAgeSeconds: 60 * 60 * 24 * 7,
      }),
    ],
  })
);

registerRoute(
  ({ url }) => url.pathname === MANIFEST_URL,
  new CacheFirst({
    cacheName: 'manifest-cache-v1',
    plugins: [
      new ExpirationPlugin({
        maxEntries: 1,
        maxAgeSeconds: 60 * 60 * 24 * 30,
      }),
    ],
  })
);

registerRoute(
  ({ url }) => url.origin === self.location.origin && url.pathname.startsWith('/_next/static'),
  new CacheFirst({
    cacheName: NEXT_CACHE,
    plugins: [
      new ExpirationPlugin({
        maxEntries: 60,
        maxAgeSeconds: 60 * 60 * 24 * 365,
      }),
    ],
  })
);

registerRoute(
  ({ request }) => request.destination === 'image',
  new CacheFirst({
    cacheName: IMAGE_CACHE,
    plugins: [
      new ExpirationPlugin({
        maxEntries: 100,
        maxAgeSeconds: 60 * 60 * 24 * 30,
      }),
    ],
  })
);

registerRoute(
  ({ url }) => url.pathname.startsWith('/api/') || url.origin.includes('expensetrackerapi.duckdns.org'),
  new NetworkFirst({
    cacheName: API_CACHE,
    plugins: [
      new ExpirationPlugin({
        maxEntries: 50,
        maxAgeSeconds: 60 * 5,
      }),
    ],
  })
);

self.addEventListener('fetch', (event) => {
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request).catch(() => caches.match(OFFLINE_URL))
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
    data: {
      url: payload.url || '/',
      ...payload.data,
    },
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const url = event.notification.data?.url || '/';

  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientsArr) => {
      const existingClient = clientsArr.find((client) => client.url === url && 'focus' in client);
      if (existingClient) {
        return existingClient.focus();
      }
      if (self.clients.openWindow) {
        return self.clients.openWindow(url);
      }
      return null;
    })
  );
});

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
