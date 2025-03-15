import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { eq } from 'drizzle-orm';
import { db } from '@/db';
import { users } from '@/db/schema';

export async function POST(request: NextRequest) {
  try {
    const { priceId, userId, callbackUrl } = await request.json(); 

    // Validate required parameters
    if (!priceId || !userId || !callbackUrl) {
      return new NextResponse(JSON.stringify({ error: 'Missing required parameters' }), { status: 400 });
    }

    // Fetch the user from the database
    const user = await db.select().from(users).where(eq(users.id, userId)).limit(1);

    console.log('user', user);

    if (!user.length) {
      return new NextResponse(JSON.stringify({ error: 'User not found' }), { status: 404 });
    }

    let stripeCustomerId = user[0].stripeCustomerId;

    console.log('stripeCustomerId', stripeCustomerId);

    // If user doesn't have a Stripe customer ID, create one
    if (!stripeCustomerId) {
      const customer = await stripe.customers.create({
        email: user[0].email, // Ensure the user has an email field in your DB
        metadata: { userId },
      });

      console.log('customer', customer);

      stripeCustomerId = customer.id;

      console.log('stripeCustomerId', stripeCustomerId);

      // Save the new Stripe customer ID to the database
      await db.update(users)
        .set({ stripeCustomerId })
        .where(eq(users.id, userId));
    }

    // Create a checkout session
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      customer: stripeCustomerId, // Attach customer to session
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${callbackUrl}?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${callbackUrl}?stripe_error=true`,
      metadata: { userId },
      subscription_data: { metadata: { userId } },
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error('[STRIPE_CHECKOUT_ERROR]', error);
    return new NextResponse(JSON.stringify({ error: 'Failed to create checkout session' }), { status: 500 });
  }
}
