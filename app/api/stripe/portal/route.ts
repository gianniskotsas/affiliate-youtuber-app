import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { users } from "@/db/schema";

export async function POST(request: NextRequest) {
  try {
    const { userId, returnUrl } = await request.json();

    if (!userId || !returnUrl) {
      return new NextResponse(JSON.stringify({ error: "Missing required parameters" }), { status: 400 });
    }

    // Fetch user from the database
    const user = await db.select().from(users).where(eq(users.id, userId)).limit(1);

    if (!user.length || !user[0].stripeCustomerId) {
      return new NextResponse(JSON.stringify({ error: "User not found or no Stripe customer ID" }), { status: 404 });
    }

    // Create a Stripe billing portal session
    const portalSession = await stripe.billingPortal.sessions.create({
      customer: user[0].stripeCustomerId,
      return_url: returnUrl, // Where the user goes after managing their subscription
    });

    return NextResponse.json({ url: portalSession.url });
  } catch (error) {
    console.error("[STRIPE_MANAGE_SUBSCRIPTION_ERROR]", error);
    return new NextResponse(JSON.stringify({ error: "Failed to create billing portal session" }), { status: 500 });
  }
}
