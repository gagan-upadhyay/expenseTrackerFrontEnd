"use client";

import { useEffect } from "react";

export function PWARegister() {
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/sw.js", { scope: "/" })
        .then((registration) => {
          console.log("[PWA] Service worker registered:", registration);

          // Listen for updates
          registration.onupdatefound = () => {
            const newWorker = registration.installing;
            if (newWorker) {
              newWorker.onstatechange = () => {
                if (newWorker.state === "installed" && navigator.serviceWorker.controller) {
                  console.log("[PWA] New service worker available - app can be updated");
                  // Dispatch custom event for UI to show update prompt
                  window.dispatchEvent(new CustomEvent("sw-update-available"));
                }
              };
            }
          };

          // Check for updates periodically
          setInterval(() => {
            registration.update().catch((err) => {
              console.log("[PWA] Error checking for updates:", err);
            });
          }, 60000); // Check every minute
        })
        .catch((error) => {
          console.error("[PWA] Service worker registration failed:", error);
        });

      // Listen for online/offline events
      const handleOnline = () => {
        console.log("[PWA] App is online");
        window.dispatchEvent(new CustomEvent("app-online"));
      };

      const handleOffline = () => {
        console.log("[PWA] App is offline");
        window.dispatchEvent(new CustomEvent("app-offline"));
      };

      window.addEventListener("online", handleOnline);
      window.addEventListener("offline", handleOffline);

      return () => {
        window.removeEventListener("online", handleOnline);
        window.removeEventListener("offline", handleOffline);
      };
    }
  }, []);

  return null;
}
