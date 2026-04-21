import { NextRequest, NextResponse } from "next/server";
import { jwtDecode } from "jwt-decode";

/**
 * Required backend configuration:
 * - Ensure `accessToken` cookie is set securely from your auth service
 * - Persist push subscriptions tied to authenticated users
 * - Use the stored subscriptions to send pushes from a server-side worker
 */

interface PushSubscriptionPayload {
  endpoint: string;
  expirationTime?: number | null;
  keys: {
    p256dh: string;
    auth: string;
  };
}

interface TokenPayload {
  sub?: string;
  userId?: string;
  exp?: number;
}

async function getUserIdFromRequest(request: NextRequest): Promise<string | null> {
  const accessToken = request.cookies.get("accessToken")?.value;
  if (!accessToken) return null;

  try {
    const decoded = jwtDecode<TokenPayload>(accessToken);
    return decoded.sub || decoded.userId || null;
  } catch (error) {
    console.warn("[API] Unable to decode access token:", error);
    return null;
  }
}

export async function POST(request: NextRequest) {
  try {
    const subscription: PushSubscriptionPayload = await request.json();

    if (!subscription?.endpoint || !subscription?.keys?.p256dh || !subscription?.keys?.auth) {
      return NextResponse.json(
        { error: "Invalid push subscription payload" },
        { status: 400 }
      );
    }

    const userId = await getUserIdFromRequest(request);
    if (!userId) {
      return NextResponse.json(
        { error: "Authentication required for push subscription" },
        { status: 401 }
      );
    }

    console.log("[API] Push notification subscription received for user:", {
      userId,
      endpoint: subscription.endpoint,
      timestamp: new Date().toISOString(),
    });

    // TODO: Persist this subscription using your preferred storage solution.
    // Example:
    // await pushSubscriptionStore.save({
    //   userId,
    //   endpoint: subscription.endpoint,
    //   p256dh: subscription.keys.p256dh,
    //   auth: subscription.keys.auth,
    //   createdAt: new Date(),
    // });

    return NextResponse.json(
      {
        success: true,
        message: "Push subscription recorded successfully",
        userId,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("[API] Error handling push subscription:", error);
    return NextResponse.json(
      { error: "Failed to save push subscription" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const userId = await getUserIdFromRequest(request);
    if (!userId) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    // TODO: Query the user's subscription status from your storage.
    // Example:
    // const subscription = await pushSubscriptionStore.findOne({ userId });

    return NextResponse.json(
      {
        subscribed: false,
        message: "Push subscription status endpoint configured but not implemented",
        userId,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("[API] Error getting subscription status:", error);
    return NextResponse.json(
      { error: "Failed to get subscription status" },
      { status: 500 }
    );
  }
}
