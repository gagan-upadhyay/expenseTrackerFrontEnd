'use client';

import React, { useEffect, useState, useRef } from "react";
import { registerServiceWorker, promptSkipWaiting } from "../utils/registerServiceWorker";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export function PWARegister() {
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const [registration, setRegistration] = useState<ServiceWorkerRegistration | null>(null);
  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showInstallBanner, setShowInstallBanner] = useState(false);
  const [dismissedInstall, setDismissedInstall] = useState(false);
  const touchStartY = useRef(0);
  const bannerRef = useRef<HTMLDivElement>(null);
  const autoHideTimer = useRef<NodeJS.Timeout | null>(null);

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

  // Handle beforeinstallprompt event for Android PWA
  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      const event = e as BeforeInstallPromptEvent;
      e.preventDefault();
      console.log('[PWA] Install prompt event received');
      setInstallPrompt(event);
      setShowInstallBanner(true);
      setDismissedInstall(false);

      // Auto-hide after 4 seconds if not dismissed
      if (autoHideTimer.current) clearTimeout(autoHideTimer.current);
      autoHideTimer.current = setTimeout(() => {
        if (mounted) {
          setShowInstallBanner(false);
        }
      }, 4000);
    };

    let mounted = true;
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      mounted = false;
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      if (autoHideTimer.current) clearTimeout(autoHideTimer.current);
    };
  }, []);

  // Handle swipe-to-dismiss
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const touchEndY = e.changedTouches[0].clientY;
    const swipeDistance = touchStartY.current - touchEndY;

    // If swiped down by 50px or more, dismiss
    if (swipeDistance < -50) {
      dismissBanner();
    }
  };

  const handleInstall = async () => {
    if (!installPrompt) return;
    try {
      await installPrompt.prompt();
      const { outcome } = await installPrompt.userChoice;
      console.log(`[PWA] User response to install prompt: ${outcome}`);
      setInstallPrompt(null);
      setShowInstallBanner(false);
      setDismissedInstall(true);
    } catch (e) {
      console.error('[PWA] Install prompt failed:', e);
    }
  };

  const dismissBanner = () => {
    if (autoHideTimer.current) clearTimeout(autoHideTimer.current);
    setShowInstallBanner(false);
    setDismissedInstall(true);
  };

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

  // Don't show install banner if already dismissed or on non-Android devices
  const shouldShowInstallBanner = showInstallBanner && installPrompt && !dismissedInstall;

  return (
    <>
      {/* Update Available Banner */}
      {updateAvailable && (
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
              fontSize: '14px',
              fontWeight: '500',
            }}
          >
            New update available — click to refresh
          </button>
        </div>
      )}

      {/* Android PWA Install Banner */}
      {shouldShowInstallBanner && (
        <div
          ref={bannerRef}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          style={{
            position: 'fixed',
            bottom: 0,
            left: 0,
            right: 0,
            background: 'linear-gradient(135deg, var(--background) 0%, var(--background) 100%)',
            color: 'var(--foreground)',
            padding: '16px',
            paddingBottom: `max(16px, env(safe-area-inset-bottom))`,
            boxShadow: '0 -2px 8px rgba(0, 0, 0, 0.2)',
            zIndex: 9998,
            animation: 'slideUp 0.3s ease-out',
            borderTop: '1px solid var(--color-border)',
          }}
        >
          <style>{`
            @keyframes slideUp {
              from {
                transform: translateY(100%);
                opacity: 0;
              }
              to {
                transform: translateY(0);
                opacity: 1;
              }
            }
          `}</style>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '12px',
            }}
          >
            <div style={{ flex: 1, textAlign: 'left' }}>
              <p style={{ margin: 0, fontSize: '14px', fontWeight: '500', color: 'var(--foreground)' }}>
                Install Expense Tracker
              </p>
              <p style={{ margin: '4px 0 0 0', fontSize: '12px', opacity: 0.8, color: 'var(--color-text)' }}>
                Quick access to track your expenses
              </p>
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                onClick={handleInstall}
                style={{
                  background: '#10b981',
                  color: 'white',
                  border: 'none',
                  padding: '8px 16px',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '13px',
                  fontWeight: '600',
                  whiteSpace: 'nowrap',
                }}
              >
                Install
              </button>
              <button
                onClick={dismissBanner}
                style={{
                  background: 'var(--color-primary)',
                  color: 'var(--foreground)',
                  border: `1px solid var(--color-border)`,
                  padding: '8px 12px',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '13px',
                  whiteSpace: 'nowrap',
                }}
              >
                Dismiss
              </button>
            </div>
          </div>
          <p
            style={{
              margin: '8px 0 0 0',
              fontSize: '11px',
              opacity: 0.6,
              textAlign: 'center',
              color: 'var(--color-text)',
            }}
          >
            Swipe down to dismiss
          </p>
        </div>
      )}
    </>
  );
}
