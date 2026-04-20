"use client";

import { useState, useEffect } from "react";
import { WifiOff, Wifi, RefreshCw } from "lucide-react";

export default function OfflinePage() {
  const [isOnline, setIsOnline] = useState<boolean | null>(null);

  useEffect(() => {
    // Check initial online status
    setIsOnline(navigator.onLine);

    // Listen for online/offline events
    const handleOnline = () => {
      console.log("Connection restored");
      setIsOnline(true);
      setTimeout(() => {
        window.location.href = "/";
      }, 1000);
    };

    const handleOffline = () => {
      console.log("Connection lost");
      setIsOnline(false);
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    // Also listen to service worker messages
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.ready.then((registration) => {
        console.log("Service worker ready, listening for messages");
      });
    }

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  const handleRetry = () => {
    if (navigator.onLine) {
      window.location.href = "/";
    } else {
      alert("Still offline. Please check your connection.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 px-4">
      <div className="max-w-md w-full text-center">
        {/* Icon */}
        <div className="mb-6 flex justify-center">
          {isOnline === false ? (
            <div className="relative">
              <WifiOff className="w-24 h-24 text-red-500 animate-pulse" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-20 h-20 border-4 border-red-500 rounded-full opacity-25"></div>
              </div>
            </div>
          ) : isOnline === true ? (
            <div className="relative">
              <Wifi className="w-24 h-24 text-green-500 animate-pulse" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-20 h-20 border-4 border-green-500 rounded-full opacity-25"></div>
              </div>
            </div>
          ) : (
            <div className="w-24 h-24 bg-gray-700 rounded-full animate-pulse"></div>
          )}
        </div>

        {/* Status Text */}
        <h1 className="text-3xl font-bold text-white mb-2">
          {isOnline === false ? "You're Offline" : isOnline === true ? "Back Online!" : "Checking..."}
        </h1>

        <p className="text-gray-400 mb-8">
          {isOnline === false
            ? "It looks like you've lost your internet connection. Don't worry, some features may still work with cached data."
            : isOnline === true
            ? "Your connection has been restored. Redirecting you back..."
            : "Checking your connection status..."}
        </p>

        {/* Cached Data Info */}
        {isOnline === false && (
          <div className="mb-8 p-4 bg-gray-800 rounded-lg border border-gray-700">
            <p className="text-sm text-gray-300">
              💾 <span className="font-semibold">Tip:</span> Your recent data is cached and available offline. Changes will sync when you're back online.
            </p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col gap-3">
          {isOnline === false && (
            <>
              <button
                onClick={handleRetry}
                className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                <RefreshCw className="w-5 h-5" />
                Try Again
              </button>
              <button
                onClick={() => window.history.back()}
                className="w-full py-3 px-4 bg-gray-700 hover:bg-gray-600 text-white font-semibold rounded-lg transition-colors"
              >
                Go Back
              </button>
            </>
          )}

          {isOnline === true && (
            <button
              onClick={() => (window.location.href = "/")}
              className="w-full py-3 px-4 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              <Wifi className="w-5 h-5" />
              Return to App
            </button>
          )}

          {isOnline === null && (
            <div className="w-full py-3 px-4 bg-gray-700 text-gray-300 font-semibold rounded-lg">
              Loading...
            </div>
          )}
        </div>

        {/* Footer Info */}
        <div className="mt-8 text-xs text-gray-500">
          <p>
            Status: <span className="font-semibold">{navigator.onLine ? "Online" : "Offline"}</span>
          </p>
          <p className="mt-1">Service Worker: {isOnline !== null ? "Active" : "Initializing"}</p>
        </div>
      </div>
    </div>
  );
}
