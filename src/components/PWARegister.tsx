'use client';

import React, { useEffect, useState } from "react";
import { registerServiceWorker, promptSkipWaiting } from "../utils/registerServiceWorker";

export function PWARegister() {
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const [registration, setRegistration] = useState<ServiceWorkerRegistration | null>(null);

  useEffect(() => {
    let mounted = true;
    registerServiceWorker({
      onUpdate: (reg) => {
        if (!mounted) return;
        setRegistration(reg);
        setUpdateAvailable(true);
      },
      onSuccess: (reg) => {
        if (!mounted) return;
        setRegistration(reg);
      },
    }).catch(() => {
      /* ignore */
    });

    return () => {
      mounted = false;
    };
  }, []);

  const applyUpdate = async () => {
    if (!registration) return;
    try {
      promptSkipWaiting(registration);
      setTimeout(() => window.location.reload(), 700);
    } catch (e) {
      console.error('[PWA] Failed to apply update', e);
      window.location.reload();
    }
  };

  if (!updateAvailable) return null;

  return (
    <div style={{ position: 'fixed', right: 12, bottom: 12, zIndex: 9999 }}>
      <button
        onClick={applyUpdate}
        style={{
          background: '#111827',
          color: 'white',
          padding: '8px 12px',
          borderRadius: 8,
          border: 'none',
          cursor: 'pointer',
        }}
      >
        New update available — click to refresh
      </button>
    </div>
  );
}
