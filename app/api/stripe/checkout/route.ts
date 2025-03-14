import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { eq } from 'drizzle-orm';
import { db } from '@/db';
import { users } from '@/db/schema';

export async function POST(request: NextRequest) {
  try {
    const { priceId, userId } = await request.json(); 

    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${process.env.APP_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.APP_URL}/checkout/cancel`,
      metadata: { userId },
    });

    if (session.payment_status === 'paid') {
      const subscriptionId = session.subscription;
      const customerId = session.customer;

      // Update user in the database
      await db.update(users).set({
        stripeSubscriptionId: subscriptionId as string,
        stripeCustomerId: customerId as string,
      }).where(eq(users.id, userId));

    }

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error('[STRIPE_CHECKOUT_ERROR]', error);
    return new NextResponse(JSON.stringify({ error: 'Failed to create checkout session' }), { status: 500 });
  }
}
