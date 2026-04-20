/**
 * Push Notifications Utility for PWA
 * Handles subscribing to push notifications and managing permissions
 *
 * Required backend information:
 * - NEXT_PUBLIC_VAPID_PUBLIC_KEY: VAPID public key for push subscriptions
 * - NEXT_PUBLIC_PUSH_SUBSCRIBE_ENDPOINT: optional custom subscribe endpoint
 * - NEXT_PUBLIC_PUSH_UNSUBSCRIBE_ENDPOINT: optional custom unsubscribe endpoint
 *
 * Backend implementation must:
 * - persist push subscriptions per authenticated user
 * - verify/refresh auth tokens on the server
 * - use the VAPID secret key to send push notifications later
 */
export interface NotificationSubscription {
  endpoint: string;
  auth: string;
  p256dh: string;
}

const SUBSCRIPTION_STORE_KEY = "pwa_notification_subscription";
const VAPID_PUBLIC_KEY =
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY ||
  "<PASTE_YOUR_VAPID_PUBLIC_KEY_HERE>";
const NOTIFICATION_SUBSCRIBE_ENDPOINT =
  process.env.NEXT_PUBLIC_PUSH_SUBSCRIBE_ENDPOINT ||
  "/api/notifications/subscribe";
const NOTIFICATION_UNSUBSCRIBE_ENDPOINT =
  process.env.NEXT_PUBLIC_PUSH_UNSUBSCRIBE_ENDPOINT ||
  "/api/notifications/unsubscribe";

/**
 * Check if push notifications are supported
 */
export function isPushNotificationSupported(): boolean {
  return (
    typeof window !== "undefined" &&
    "serviceWorker" in navigator &&
    "PushManager" in window &&
    "Notification" in window
  );
}

/**
 * Get current notification permission status
 */
export function getNotificationPermission(): NotificationPermission {
  if (typeof window !== "undefined" && "Notification" in window) {
    return Notification.permission;
  }
  return "denied";
}

/**
 * Request notification permission from user
 */
export async function requestNotificationPermission(): Promise<boolean> {
  if (!isPushNotificationSupported()) {
    console.log("[Notifications] Push notifications not supported");
    return false;
  }

  try {
    const permission = await Notification.requestPermission();
    console.log("[Notifications] Permission requested:", permission);
    return permission === "granted";
  } catch (error) {
    console.error("[Notifications] Error requesting permission:", error);
    return false;
  }
}

/**
 * Subscribe to push notifications
 */
export async function subscribeToPushNotifications(): Promise<boolean> {
  if (!isPushNotificationSupported()) {
    console.log("[Notifications] Push notifications not supported");
    return false;
  }

  if (getNotificationPermission() !== "granted") {
    console.log("[Notifications] Notification permission not granted");
    return false;
  }

  if (!VAPID_PUBLIC_KEY || VAPID_PUBLIC_KEY.includes("<PASTE_")) {
    console.warn(
      "[Notifications] VAPID public key is missing. Set NEXT_PUBLIC_VAPID_PUBLIC_KEY in environment variables."
    );
    return false;
  }

  try {
    const registration = await navigator.serviceWorker.ready;

    if (!registration.pushManager) {
      console.log("[Notifications] Push Manager not available");
      return false;
    }

    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
    });

    console.log("[Notifications] Subscribed to push notifications");

    saveSubscription(subscription);
    await sendSubscriptionToBackend(subscription);

    return true;
  } catch (error) {
    console.error("[Notifications] Error subscribing to push:", error);
    return false;
  }
}

/**
 * Unsubscribe from push notifications
 */
export async function unsubscribeFromPushNotifications(): Promise<boolean> {
  if (!isPushNotificationSupported()) {
    return false;
  }

  try {
    const registration = await navigator.serviceWorker.ready;
    const subscription = await registration.pushManager.getSubscription();

    if (!subscription) {
      console.log("[Notifications] No subscription to unsubscribe from");
      return true;
    }

    const success = await subscription.unsubscribe();
    console.log("[Notifications] Subscription unsubscribe result:", success);

    await removeSubscriptionFromBackend(subscription);
    clearSubscription();

    return success;
  } catch (error) {
    console.error("[Notifications] Error unsubscribing:", error);
    return false;
  }
}

/**
 * Get current push subscription status
 */
export async function getPushSubscriptionStatus(): Promise<boolean> {
  if (!isPushNotificationSupported()) {
    return false;
  }

  try {
    const registration = await navigator.serviceWorker.ready;
    const subscription = await registration.pushManager.getSubscription();
    return subscription !== null;
  } catch (error) {
    console.error("[Notifications] Error getting subscription status:", error);
    return false;
  }
}

/**
 * Save subscription to local storage
 */
function saveSubscription(subscription: PushSubscription): void {
  try {
    const json = subscription.toJSON();
    const data: NotificationSubscription = {
      endpoint: subscription.endpoint,
      auth: (json.keys?.auth || "") as string,
      p256dh: (json.keys?.p256dh || "") as string,
    };
    localStorage.setItem(SUBSCRIPTION_STORE_KEY, JSON.stringify(data));
    console.log("[Notifications] Subscription saved to local storage");
  } catch (error) {
    console.error("[Notifications] Error saving subscription:", error);
  }
}

/**
 * Get saved subscription from local storage
 */
export function getSavedSubscription(): NotificationSubscription | null {
  try {
    const data = localStorage.getItem(SUBSCRIPTION_STORE_KEY);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error("[Notifications] Error retrieving saved subscription:", error);
    return null;
  }
}

/**
 * Clear saved subscription from local storage
 */
function clearSubscription(): void {
  try {
    localStorage.removeItem(SUBSCRIPTION_STORE_KEY);
    console.log("[Notifications] Subscription cleared from local storage");
  } catch (error) {
    console.error("[Notifications] Error clearing subscription:", error);
  }
}

/**
 * Send subscription to backend
 */
async function sendSubscriptionToBackend(
  subscription: PushSubscription
): Promise<void> {
  try {
    const response = await fetch(NOTIFICATION_SUBSCRIBE_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(subscription.toJSON()),
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error(`Backend returned status ${response.status}`);
    }

    console.log("[Notifications] Subscription sent to backend");
  } catch (error) {
    console.error("[Notifications] Error sending subscription to backend:", error);
    throw error;
  }
}

/**
 * Remove subscription from backend
 */
async function removeSubscriptionFromBackend(
  subscription: PushSubscription
): Promise<void> {
  try {
    const response = await fetch(NOTIFICATION_UNSUBSCRIBE_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ endpoint: subscription.endpoint }),
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error(`Backend returned status ${response.status}`);
    }

    console.log("[Notifications] Subscription removed from backend");
  } catch (error) {
    console.error("[Notifications] Error removing subscription from backend:", error);
    throw error;
  }
}

/**
 * Convert VAPID public key from base64 to Uint8Array
 */
function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, "+")
    .replace(/_/g, "/");

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }

  return outputArray;
}

/**
 * Show a local notification (for testing)
 */
export async function showLocalNotification(
  title: string,
  options?: NotificationOptions
): Promise<void> {
  if (!isPushNotificationSupported()) {
    console.log("[Notifications] Notifications not supported");
    return;
  }

  try {
    if (getNotificationPermission() !== "granted") {
      const granted = await requestNotificationPermission();
      if (!granted) return;
    }

    const registration = await navigator.serviceWorker.ready;
    await registration.showNotification(title, {
      icon: "/logo_192.png",
      badge: "/logo_192.png",
      ...options,
    });

    console.log("[Notifications] Local notification shown");
  } catch (error) {
    console.error("[Notifications] Error showing notification:", error);
  }
}

/**
 * Initialize push notification listeners
 */
export function initPushNotificationListeners(): void {
  if (!isPushNotificationSupported()) {
    return;
  }

  document.addEventListener("visibilitychange", () => {
    if (!document.hidden) {
      getPushSubscriptionStatus().then((isSubscribed) => {
        console.log("[Notifications] App foreground - subscription status:", isSubscribed);
      });
    }
  });

  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.addEventListener("message", (event) => {
      if (event.data && event.data.type === "PUSH_NOTIFICATION") {
        console.log("[Notifications] Push notification message received:", event.data);
      }
    });
  }

  console.log("[Notifications] Push notification listeners initialized");
}
