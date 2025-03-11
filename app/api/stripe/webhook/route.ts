import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { db } from "@/db";

export async function POST(request: NextRequest) {
  const sig = request.headers.get("stripe-signature");
  const rawBody = await request.text();

  try {
    if (!sig || !process.env.STRIPE_WEBHOOK_SECRET) {
      throw new Error("Missing webhook signature or secret.");
    }

    // Verify the webhook event
    const event = stripe.webhooks.constructEvent(
      rawBody,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );

    switch (event.type) {
      /**
       * ✅ Handle new checkout session completed (User just subscribed)
       */
      case "checkout.session.completed": {
        const session = event.data.object;

        if (!session.customer || !session.subscription || !session.metadata?.userId) {
          return new NextResponse("Missing required Stripe metadata", { status: 400 });
        }

        // Update the user with Stripe customer and subscription details
        await db
          .update(users)
          .set({
            stripeCustomerId: session.customer as string,
            stripeSubscriptionId: session.subscription as string,
            stripeSubscriptionStatus: true, // Mark subscription as active
          })
          .where(eq(users.id, session.metadata.userId));

        break;
      }

      /**
       * ✅ Handle subscription updates (Renewal, status change, etc.)
       */
      case "customer.subscription.updated":
      case "customer.subscription.deleted": {
        const subscription = event.data.object;
        const user = await db
          .select()
          .from(users)
          .where(eq(users.stripeSubscriptionId, subscription.id))
          .limit(1);

        if (!user.length) {
          console.warn("User not found for subscription update");
          return new NextResponse("User not found", { status: 404 });
        }

        await db
          .update(users)
          .set({
            stripeSubscriptionStatus: subscription.status === "active",
          })
          .where(eq(users.stripeSubscriptionId, subscription.id));

        break;
      }

      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (err: any) {
    console.error("Webhook Error:", err.message);
    return new NextResponse(`Webhook Error: ${err.message}`, { status: 400 });
  }
}
