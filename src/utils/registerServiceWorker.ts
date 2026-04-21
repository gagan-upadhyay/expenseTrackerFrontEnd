type RegistrationOptions = {
  onSuccess?: (registration: ServiceWorkerRegistration) => void;
  onUpdate?: (registration: ServiceWorkerRegistration) => void;
};

function isLocalhost() {
  return typeof window !== 'undefined' && Boolean(
    window.location.hostname === 'localhost' ||
    // [::1] is the IPv6 localhost address.
    window.location.hostname === '[::1]' ||
    // 127.0.0.0/8 are considered localhost for IPv4.
    window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4]\d|[01]?\d?\d)){3}$/)
  );
}

export async function registerServiceWorker(options: RegistrationOptions = {}) {
  if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
    console.log('[SW] Service workers are not supported in this environment');
    return;
  }

  const swUrl = '/service-worker.js';

  try {
    const registration = await navigator.serviceWorker.register(swUrl, {type:'module'});
    console.log('[SW] Registered service worker at', swUrl);

    // Listen for updates
    if (registration.waiting) {
      // There's an updated SW waiting to activate
      options.onUpdate?.(registration);
    }

    registration.addEventListener('updatefound', () => {
      const newWorker = registration.installing;
      if (!newWorker) return;
      newWorker.addEventListener('statechange', () => {
        if (newWorker.state === 'installed') {
          if (navigator.serviceWorker.controller) {
            // New update available
            console.log('[SW] New content is available; please refresh.');
            options.onUpdate?.(registration);
          } else {
            // Content cached for offline use
            console.log('[SW] Content is cached for offline use.');
            options.onSuccess?.(registration);
          }
        }
      });
    });

    // Optional: listen for controllingchange
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      console.log('[SW] Controller changed');
    });

    return registration;
  } catch (err) {
    console.error('[SW] Registration failed:', err);
    throw err;
  }
}

export async function unregisterServiceWorker() {
  if (typeof window === 'undefined' || !('serviceWorker' in navigator)) return;
  try {
    const regs = await navigator.serviceWorker.getRegistrations();
    for (const reg of regs) {
      await reg.unregister();
    }
    console.log('[SW] Unregistered all service workers');
  } catch (err) {
    console.error('[SW] Failed to unregister service workers:', err);
  }
}

export function promptSkipWaiting(registration: ServiceWorkerRegistration) {
  if (!registration || !registration.waiting) return;
  registration.waiting.postMessage({ type: 'SKIP_WAITING' });
}
