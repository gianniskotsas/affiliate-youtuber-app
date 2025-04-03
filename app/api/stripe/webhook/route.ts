import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { users, videos } from "@/db/schema";
import { eq } from "drizzle-orm";
import { db } from "@/db";

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(req: NextRequest) {
  const sig = req.headers.get("stripe-signature");
  const rawBody = await req.text();

  if (!sig || !endpointSecret) {
    console.error("❌ Missing signature or secret");
    return new NextResponse("Webhook signature error", { status: 400 });
  }

  let event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, sig, endpointSecret);
  } catch (err: any) {
    console.error("❌ Webhook Error:", err.message);
    return new NextResponse(`Webhook Error: ${err.message}`, { status: 400 });
  }

  try {
    switch (event.type) {
      /**
       * ✅ Handle new checkout session completed (User just subscribed)
       */
      case "checkout.session.completed": {
        const session = event.data.object;

        if (
          !session.customer ||
          !session.subscription ||
          !session.metadata?.userId
        ) {
          console.error("❌ Missing required Stripe metadata");
          return new NextResponse("Missing required Stripe metadata", {
            status: 400,
          });
        }

        const userId = session.metadata.userId;
        const stripeCustomerId = session.customer as string;
        const stripeSubscriptionId = session.subscription as string;

        console.log(`[STRIPE] Checkout completed for user ${userId}`);

        const user = await db
          .select()
          .from(users)
          .where(eq(users.id, userId))
          .limit(1);

        if (!user.length) {
          console.warn(`[STRIPE] User not found: ${userId}`);
          return new NextResponse("User not found", { status: 404 });
        }

        await db
          .update(users)
          .set({
            stripeCustomerId,
            stripeSubscriptionId,
            stripeSubscriptionStatus: true, // Set to active (true)
          })
          .where(eq(users.id, userId));

        console.log(
          `[STRIPE] User ${userId} updated with active subscription.`
        );
        break;
      }

      /**
       * ✅ Handle subscription updates (Renewal, status change, etc.)
       */
      case "customer.subscription.updated": {
        const subscription = event.data.object;
        const subscriptionId = subscription.id;
        const status = subscription.status; // "active", "canceled", "past_due"

        console.log(
          `[STRIPE] Subscription updated: ${subscriptionId} - Status: ${status}`
        );

        const user = await db
          .select()
          .from(users)
          .where(eq(users.stripeSubscriptionId, subscriptionId))
          .limit(1);

        if (!user.length) {
          console.warn(
            `[STRIPE] User not found for subscription update: ${subscriptionId}`
          );
          return new NextResponse("User not found", { status: 404 });
        }

        await db
          .update(users)
          .set({ stripeSubscriptionStatus: status === "active" }) // true if active, false otherwise
          .where(eq(users.stripeSubscriptionId, subscriptionId));

        console.log(
          `[STRIPE] Updated user ${user[0].id} subscription status to: ${
            status === "active"
          }`
        );
        break;
      }

      /**
       * ✅ Handle subscription cancellations
       */
      case "customer.subscription.deleted": {
        const subscription = event.data.object;
        const subscriptionId = subscription.id;

        console.log(`[STRIPE] Subscription canceled: ${subscriptionId}`);

        const user = await db
          .select()
          .from(users)
          .where(eq(users.stripeSubscriptionId, subscriptionId))
          .limit(1);

        if (!user.length) {
          console.warn(
            `[STRIPE] User not found for canceled subscription: ${subscriptionId}`
          );
          return new NextResponse("User not found", { status: 404 });
        }

        await db
          .update(users)
          .set({ 
            stripeSubscriptionStatus: false, // Set to false (canceled)
            stripeSubscriptionId: "" // Clear the subscription ID
          })
          .where(eq(users.stripeSubscriptionId, subscriptionId));

        // Set all videos from that user from active true to false
        const userId = user[0].id;
        await db
          .update(videos)
          .set({ active: false })
          .where(eq(videos.userId, userId));
        break;
      }

      default:
        console.log(`⚠️ Unhandled event type: ${event.type}`);
    }

    return new NextResponse("Success", { status: 200 });
  } catch (err: any) {
    console.error("❌ Webhook Handler Error:", err.message);
    return new NextResponse(`Webhook Error: ${err.message}`, { status: 500 });
  }
}
