import { cookies } from "next/headers";
import { getUserById } from "@/db/queries";
import DomainClient from "@/components/dashboard/DomainClient";
import { auth } from "@clerk/nextjs/server";
import BillingClient from "@/components/dashboard/BillingClient";
import AnalyticsClient from "@/components/dashboard/AnalyticsClient";
export default async function AnalyticsPage() {
  const { userId } = await auth();

  const userDb = userId ? await getUserById(userId) : null;

  if (!userDb) {
    return <div>User not found</div>;
  }

  

    return <AnalyticsClient userDb={userDb} />;
  } 
