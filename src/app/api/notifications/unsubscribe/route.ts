import { NextRequest, NextResponse } from "next/server";

/**
 * POST /api/notifications/unsubscribe
 * Unsubscribe a user from push notifications
 *
 * Request body:
 * {
 *   endpoint: string
 * }
 */
export async function POST(request: NextRequest) {
  try {
    const { endpoint } = await request.json();

    if (!endpoint) {
      return NextResponse.json(
        { error: "Endpoint is required" },
        { status: 400 }
      );
    }

    console.log("[API] Push notification unsubscribe received:", {
      endpoint: endpoint.substring(0, 50) + "...",
      timestamp: new Date().toISOString(),
    });

    // TODO: Remove subscription from database
    // This is where you would:
    // 1. Get the authenticated user's ID from the request
    // 2. Remove the subscription from your database

    // Example of what you might do:
    // const userId = await getUserIdFromToken(request);
    // await db.push_subscriptions.deleteOne({
    //   user_id: userId,
    //   endpoint: endpoint,
    // });

    return NextResponse.json(
      {
        success: true,
        message: "Unsubscribed successfully",
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
