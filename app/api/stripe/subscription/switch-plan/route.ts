import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";

export async function POST(request: NextRequest) {
  try {
    const { stripeCustomerId, priceId, returnUrl } = await request.json();


    if (!stripeCustomerId || !priceId || !returnUrl) {
      return new NextResponse(JSON.stringify({ error: "Missing required parameters" }), { status: 400 });
    }

    // Create a new Stripe Checkout session
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      customer: stripeCustomerId, // Attach existing Stripe customer
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${returnUrl}?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${returnUrl}?stripe_error=true`,
      metadata: { stripeCustomerId, newPriceId: priceId },
      subscription_data: { metadata: { stripeCustomerId, newPriceId: priceId } },
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("[STRIPE_SWITCH_PLAN_ERROR]", error);
    return new NextResponse(JSON.stringify({ error: "Failed to initiate plan switch" }), { status: 500 });
  }
}
