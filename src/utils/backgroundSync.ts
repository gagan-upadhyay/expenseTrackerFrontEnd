/**
 * Background Sync Utility for PWA
 * Handles retrying failed operations when the app comes back online
 */

export interface SyncData {
  id: string;
  type: "transaction" | "account" | "category";
  action: "create" | "update" | "delete";
  payload: Record<string, any>;
  timestamp: number;
  retries: number;
}

const SYNC_STORE_KEY = "pwa_sync_queue";
const MAX_RETRIES = 3;

/**
 * Initialize background sync - call this when app starts
 */
export async function initBackgroundSync() {
  if (!("serviceWorker" in navigator)) {
    console.log("[Sync] Service Worker not supported");
    return;
  }

  try {
    const registration = await navigator.serviceWorker.ready;
    console.log("[Sync] Service worker ready for background sync");

    // Listen for sync completion messages from the service worker
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.addEventListener("message", (event) => {
        if (event.data.type === "BACKGROUND_SYNC") {
          console.log(`[Sync] Background sync completed:`, event.data);
          // Clear synced items from queue
          if (event.data.tag === "sync-transactions") {
            clearSyncQueue();
          }
        }
      });
    }
  } catch (error) {
    console.error("[Sync] Error initializing background sync:", error);
  }
}

/**
 * Add an operation to the sync queue
 */
export function addToSyncQueue(data: SyncData): void {
  try {
    const queue = getSyncQueue();
    queue.push(data);
    localStorage.setItem(SYNC_STORE_KEY, JSON.stringify(queue));
    console.log(`[Sync] Added to queue:`, data);

    // Request background sync from service worker
    triggerBackgroundSync("sync-transactions");
  } catch (error) {
    console.error("[Sync] Error adding to sync queue:", error);
  }
}

/**
 * Get the current sync queue
 */
export function getSyncQueue(): SyncData[] {
  try {
    const queue = localStorage.getItem(SYNC_STORE_KEY);
    return queue ? JSON.parse(queue) : [];
  } catch (error) {
    console.error("[Sync] Error retrieving sync queue:", error);
    return [];
  }
}

/**
 * Remove an item from the sync queue
 */
export function removeFromSyncQueue(id: string): void {
  try {
    const queue = getSyncQueue();
    const filtered = queue.filter((item) => item.id !== id);
    localStorage.setItem(SYNC_STORE_KEY, JSON.stringify(filtered));
    console.log(`[Sync] Removed from queue: ${id}`);
  } catch (error) {
    console.error("[Sync] Error removing from sync queue:", error);
  }
}

/**
 * Clear the entire sync queue
 */
export function clearSyncQueue(): void {
  try {
    localStorage.removeItem(SYNC_STORE_KEY);
    console.log("[Sync] Sync queue cleared");
  } catch (error) {
    console.error("[Sync] Error clearing sync queue:", error);
  }
}

/**
 * Update retry count for a sync item
 */
export function updateSyncRetry(id: string): void {
  try {
    const queue = getSyncQueue();
    const item = queue.find((i) => i.id === id);
    if (item) {
      item.retries += 1;
      if (item.retries > MAX_RETRIES) {
        console.warn(`[Sync] Max retries exceeded for ${id}, removing from queue`);
        removeFromSyncQueue(id);
      } else {
        localStorage.setItem(SYNC_STORE_KEY, JSON.stringify(queue));
      }
    }
  } catch (error) {
    console.error("[Sync] Error updating sync retry:", error);
  }
}

/**
 * Trigger background sync from client
 */
export async function triggerBackgroundSync(tag: string): Promise<void> {
  if (!("serviceWorker" in navigator)) {
    console.log("[Sync] Service Worker not supported for background sync");
    return;
  }

  try {
    const registration = await navigator.serviceWorker.ready;
    const swRegistration = registration as unknown as {
      sync?: {
        register: (tag: string) => Promise<void>;
      };
    };

    if (!swRegistration.sync) {
      console.warn("[Sync] Background Sync API not available");
      // Fallback: Try to sync immediately if online
      if (navigator.onLine) {
        await syncNow();
      }
      return;
    }

    await swRegistration.sync.register(tag);
    console.log(`[Sync] Background sync registered for tag: ${tag}`);
  } catch (error) {
    console.error(`[Sync] Error triggering background sync:`, error);
    // Fallback: sync immediately if online
    if (navigator.onLine) {
      await syncNow();
    }
  }
}

/**
 * Manually trigger sync immediately (for online fallback)
 */
export async function syncNow(): Promise<void> {
  const queue = getSyncQueue();
  if (queue.length === 0) {
    console.log("[Sync] No items to sync");
    return;
  }

  console.log("[Sync] Starting manual sync for", queue.length, "items");

  for (const item of queue) {
    try {
      // Example: Send to your API
      const response = await fetch("/api/sync", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(item),
      });

      if (response.ok) {
        console.log(`[Sync] Successfully synced:`, item.id);
        removeFromSyncQueue(item.id);
      } else {
        console.warn(`[Sync] Failed to sync ${item.id}:`, response.status);
        updateSyncRetry(item.id);
      }
    } catch (error) {
      console.error(`[Sync] Error syncing ${item.id}:`, error);
      updateSyncRetry(item.id);
    }
  }
}

/**
 * Handle online event - trigger sync
 */
export function onAppOnline(): void {
  console.log("[Sync] App came online, triggering sync");
  triggerBackgroundSync("sync-transactions");
}

/**
 * Handle offline event - notify user
 */
export function onAppOffline(): void {
  console.log("[Sync] App is offline");
  // Dispatch custom event so UI can notify user
  window.dispatchEvent(
    new CustomEvent("app-sync-status", { detail: { status: "offline" } })
  );
}
