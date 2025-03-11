import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { db } from "@/db";
export async function POST(request: NextRequest) {
  const { userId } = await request.json();

  if (!userId) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  // Get the user's Stripe Customer ID
  const user = await db
    .select({ stripeCustomerId: users.stripeCustomerId })
    .from(users)
    .where(eq(users.id, userId))
    .limit(1);

  if (!user.length || !user[0].stripeCustomerId) {
    return new NextResponse("User not found or no Stripe customer ID", { status: 404 });
  }

  // Create a Stripe Customer Portal session
  const portalSession = await stripe.billingPortal.sessions.create({
    customer: user[0].stripeCustomerId,
    return_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard`, // Redirect back after user manages subscription
  });

  return NextResponse.json({ url: portalSession.url });
}
