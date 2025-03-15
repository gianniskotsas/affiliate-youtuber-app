import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";

// Define Invoice Type
export type Invoice = {
  id: string;
  invoiceNumber: string | null;
  date: Date;
  paid: boolean;
  amount_paid: number;
  url: string;
};

// Function to map Stripe invoice to our Invoice type
export function mapStripeInvoice(stripeInvoice: any): Invoice {
  return {
    id: stripeInvoice.id,
    invoiceNumber: stripeInvoice.number ?? null, // Can be null
    date: new Date(stripeInvoice.created * 1000), // Convert Unix timestamp
    paid: stripeInvoice.paid,
    amount_paid: stripeInvoice.amount_paid / 100, // Convert cents to dollars
    url: stripeInvoice.invoice_pdf,
  };
}

export async function POST(request: NextRequest) {
  try {
    const { userId } = await request.json();

    if (!userId) {
      return new NextResponse(JSON.stringify({ error: "Missing userId" }), { status: 400 });
    }

    // Fetch user from the database
    const user = await db.select().from(users).where(eq(users.id, userId)).limit(1);

    if (!user.length || !user[0].stripeCustomerId) {
      return new NextResponse(JSON.stringify({ error: "User not found or no Stripe customer ID" }), { status: 404 });
    }

    const stripeCustomerId = user[0].stripeCustomerId;

    // Fetch invoices from Stripe
    const invoices = await stripe.invoices.list({ customer: stripeCustomerId });

    // Convert Stripe invoices to our Invoice type
    const formattedInvoices = invoices.data.map(mapStripeInvoice);

    return NextResponse.json({ invoices: formattedInvoices });
  } catch (error) {
    console.error("[STRIPE_FETCH_INVOICES_ERROR]", error);
    return new NextResponse(JSON.stringify({ error: "Failed to fetch invoices" }), { status: 500 });
  }
}
