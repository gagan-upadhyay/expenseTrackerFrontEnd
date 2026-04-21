importScripts('https://storage.googleapis.com/workbox-cdn/releases/6.5.4/workbox-sw.js');

if (workbox) {
  console.log('Workbox is loaded! 🎉');

  const { precaching, routing, strategies, expiration } = workbox;

  const MANIFEST_URL = '/manifest.webmanifest';
  const OFFLINE_URL = '/offline.html';

  // Precache the manifest and offline page
  precaching.precacheAndRoute([
    { url: MANIFEST_URL, revision: null },
    { url: OFFLINE_URL, revision: null },
  ]);

  // Cache navigation requests
  routing.registerRoute(
    ({ request }) => request.mode === 'navigate',
    new strategies.NetworkFirst({
      cacheName: 'pages',
      plugins: [
        new expiration.ExpirationPlugin({
          maxEntries: 50,
          maxAgeSeconds: 60 * 60 * 24 * 30,
        }),
      ],
    })
  );

  // Cache API requests
  routing.registerRoute(
    ({ url }) => url.pathname.startsWith('/api/'),
    new strategies.NetworkFirst({
      cacheName: 'api',
      plugins: [
        new expiration.ExpirationPlugin({
          maxEntries: 100,
          maxAgeSeconds: 60 * 60,
        }),
      ],
    })
  );

  // Cache images
  routing.registerRoute(
    ({ request }) => request.destination === 'image',
    new strategies.CacheFirst({
      cacheName: 'images',
      plugins: [
        new expiration.ExpirationPlugin({
          maxEntries: 60,
          maxAgeSeconds: 60 * 60 * 24 * 30,
        }),
      ],
    })
  );

  // Cache static assets
  routing.registerRoute(
    ({ request }) =>
      request.destination === 'script' ||
      request.destination === 'style' ||
      request.destination === 'font',
    new strategies.StaleWhileRevalidate({
      cacheName: 'static-resources',
    })
  );

  // Handle push notifications
  self.addEventListener('push', (event) => {
    console.log('Push received:', event);
    let data = {};
    if (event.data) {
      try {
        data = event.data.json();
      } catch (e) {
        console.error('Failed to parse push data:', e);
      }
    }

    const options = {
      body: data.body || 'New notification',
      icon: '/icon-192x192.png',
      badge: '/icon-192x192.png',
      vibrate: [100, 50, 100],
      data: {
        dateOfArrival: Date.now(),
        primaryKey: 1,
        ...data,
      },
    };

    event.waitUntil(
      self.registration.showNotification(
        data.title || 'Expense Tracker',
        options
      )
    );
  });

  // Handle notification clicks
  self.addEventListener('notificationclick', (event) => {
    console.log('Notification click received:', event);
    event.notification.close();
    event.waitUntil(
      clients.openWindow(event.notification.data.url || '/dashboard')
    );
  });

  // Install event
  self.addEventListener('install', (event) => {
    console.log('Service worker installing...');
    self.skipWaiting();
  });

  // Activate event
  self.addEventListener('activate', (event) => {
    console.log('Service worker activating...');
    event.waitUntil(clients.claim());
  });

  // Message listener for skip waiting
  self.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'SKIP_WAITING') {
      self.skipWaiting();
    }
  });

} else {
  console.log('Workbox could not be loaded. No offline support.');
}
