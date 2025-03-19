import { cookies } from "next/headers";
import { getUserById } from "@/db/queries";
import DomainClient from "@/components/dashboard/DomainClient";
import { auth } from "@clerk/nextjs/server";
import BillingClient from "@/components/dashboard/BillingClient";

export default async function BillingPage() {
  const { userId } = await auth();

  const userDb = userId ? await getUserById(userId) : null;

  if (!userDb) {
    return <div>User not found</div>;
  }

  try {
    const [planResponse, invoicesResponse] = await Promise.all([
      fetch(`${process.env.APP_URL}/api/stripe/subscription/fetch-plan`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subscriptionId: userDb.stripeSubscriptionId }),
      }),
      fetch(`${process.env.APP_URL}/api/stripe/invoices`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      }),
    ]);

    console.log(planResponse, invoicesResponse);
    if (!planResponse.ok || !invoicesResponse.ok) {
      throw new Error("Failed to fetch billing data");
    }

    const planData = await planResponse.json();
    const invoicesData = await invoicesResponse.json();

    return <BillingClient userDb={userDb} invoices={invoicesData.invoices} priceId={planData.priceId} />;
  } catch (error) {
    console.error("Error fetching billing data:", error);
    return <div>Error loading billing information</div>;
  }
} 
