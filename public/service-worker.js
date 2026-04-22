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

  // Cache navigation requests (HTML pages) with fallback to offline.html
  routing.registerRoute(
    ({ request }) => request.mode === 'navigate',
    new strategies.NetworkFirst({
      cacheName: 'pages',
      networkTimeoutSeconds: 3,
      plugins: [
        new expiration.ExpirationPlugin({
          maxEntries: 100,
          maxAgeSeconds: 60 * 60 * 24 * 30, // 30 days
        }),
      ],
    })
  );

  // Add a fallback for failed navigation requests to show offline page
  routing.setCatchHandler(({ event }) => {
    if (event.request.mode === 'navigate') {
      return caches.match(OFFLINE_URL);
    }
    return Response.error();
  });

  // Cache API requests with longer timeout for offline view
  routing.registerRoute(
    ({ url }) => url.pathname.startsWith('/api/'),
    new strategies.NetworkFirst({
      cacheName: 'api',
      networkTimeoutSeconds: 4,
      plugins: [
        new expiration.ExpirationPlugin({
          maxEntries: 100,
          maxAgeSeconds: 60 * 60, // 1 hour
        }),
      ],
    })
  );

  // Cache images with CacheFirst strategy (images rarely change)
  routing.registerRoute(
    ({ request }) => request.destination === 'image',
    new strategies.CacheFirst({
      cacheName: 'images',
      plugins: [
        new expiration.ExpirationPlugin({
          maxEntries: 60,
          maxAgeSeconds: 60 * 60 * 24 * 30, // 30 days
        }),
      ],
    })
  );

  // Cache static assets (JS, CSS, fonts) with StaleWhileRevalidate
  routing.registerRoute(
    ({ request }) =>
      request.destination === 'script' ||
      request.destination === 'style' ||
      request.destination === 'font',
    new strategies.StaleWhileRevalidate({
      cacheName: 'static-resources',
      plugins: [
        new expiration.ExpirationPlugin({
          maxEntries: 100,
          maxAgeSeconds: 60 * 60 * 24 * 7, // 7 days
        }),
      ],
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
        console.log('Push data is not JSON, treating as plain text:', e);
        data = {
          title: 'Expense Tracker',
          body: event.data.text(),
        };
      }
    }

    const title = data.title || 'Expense Tracker';
    const options = {
      body: data.body || 'New notification',
      icon: '/logo_192.png',
      badge: '/logo_192.png',
      vibrate: [100, 50, 100],
      data: {
        dateOfArrival: Date.now(),
        primaryKey: 1,
        ...data,
      },
    };

    event.waitUntil(
      (async () => {
        try {
          if (Notification.permission === 'granted') {
            await self.registration.showNotification(title, options);
          } else if (Notification.permission !== 'denied') {
            console.warn('Notification permission not granted.');
          }
        } catch (err) {
          console.error('Failed to show notification:', err);
        }
      })()
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

  // Install event - cache essential files immediately
  self.addEventListener('install', (event) => {
    console.log('Service worker installing...');
    self.skipWaiting();
  });

  // Activate event - clean up old caches
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
        console.log('Push data is not JSON, treating as plain text:', e);
        // If JSON parsing fails, treat the data as plain text
        data = {
          title: 'Expense Tracker',
          body: event.data.text(),
        };
      }
    }

    const title = data.title || 'Expense Tracker';
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

    // Only show notification if permission is granted
    event.waitUntil(
      (async () => {
        try {
          // Check if notification permission is granted
          if (Notification.permission === 'granted') {
            await self.registration.showNotification(title, options);
          } else if (Notification.permission !== 'denied') {
            console.warn('Notification permission not granted. User has not been asked.');
          }
        } catch (err) {
          console.error('Failed to show notification:', err);
        }
      })()
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
