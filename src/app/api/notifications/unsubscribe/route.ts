import { NextRequest, NextResponse } from "next/server";
import { jwtDecode } from "jwt-decode";

/**
 * Required backend configuration:
 * - Ensure `accessToken` cookie is set securely from your auth service
 * - Remove persisted push subscriptions when a user unsubscribes
 * - Sync subscription removal with any push sender or queue system
 */

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
    const { endpoint } = await request.json();

    if (!endpoint) {
      return NextResponse.json(
        { error: "Endpoint is required" },
        { status: 400 }
      );
    }

    const userId = await getUserIdFromRequest(request);
    if (!userId) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    console.log("[API] Push notification unsubscribe received:", {
      userId,
      endpoint: endpoint.substring(0, 50) + "...",
      timestamp: new Date().toISOString(),
    });

    // TODO: Remove the subscription from your persistence layer.
    // Example:
    // await pushSubscriptionStore.delete({ userId, endpoint });

    return NextResponse.json(
      {
        success: true,
        message: "Push subscription removed",
        userId,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("[API] Error handling unsubscribe:", error);
    return NextResponse.json(
      { error: "Failed to unsubscribe" },
      { status: 500 }
    );
  }
}
