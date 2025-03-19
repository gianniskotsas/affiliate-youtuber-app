import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { mapStripeInvoice } from "@/lib/utils";

export async function POST(request: NextRequest) {
  try {
    const { userId } = await request.json();

    if (!userId) {
      return NextResponse.json({ error: "Missing userId" }, { status: 400 });
    }

    // Fetch user from the database
    const user = await db.select().from(users).where(eq(users.id, userId)).limit(1);

    if (!user.length || !user[0].stripeCustomerId) {
      return NextResponse.json({ error: "User not found or no Stripe customer ID" }, { status: 404 });
    }

    const stripeCustomerId = user[0].stripeCustomerId;

    // Fetch invoices from Stripe
    const invoices = await stripe.invoices.list({ customer: stripeCustomerId });

    // Convert Stripe invoices to our Invoice type
    const formattedInvoices = invoices.data.map(mapStripeInvoice);

    return NextResponse.json({ invoices: formattedInvoices });
  } catch (error) {
    console.error("[STRIPE_FETCH_INVOICES_ERROR]", error);
    return NextResponse.json({ error: "Failed to fetch invoices" }, { status: 500 });
  }
}
