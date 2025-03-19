import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";

export async function POST(request: NextRequest) {
  try {
    const { subscriptionId } = await request.json();

    console.log("[STRIPE_FETCH_PLAN_REQUEST]", subscriptionId);

    if (!subscriptionId) {
      return new NextResponse(JSON.stringify({ error: "Missing subscriptionId" }), { status: 400 });
    }

    // Fetch subscription from Stripe
    const subscription = await stripe.subscriptions.retrieve(subscriptionId);
    if (!subscription) {
      return new NextResponse(JSON.stringify({ error: "Subscription not found" }), { status: 404 });
    }

    // Extract the price ID
    const priceId = subscription?.items?.data[0]?.price?.id || null;

    return NextResponse.json({ priceId });
  } catch (error) {
    console.error("[STRIPE_FETCH_PLAN_ERROR]", error);
    return new NextResponse(JSON.stringify({ error: "Failed to fetch subscription plan" }), { status: 500 });
  }
}
