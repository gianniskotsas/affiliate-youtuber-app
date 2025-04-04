import { cookies } from "next/headers";
import { getUserById } from "@/db/queries";
import DomainClient from "@/components/dashboard/DomainClient";
import { auth } from "@clerk/nextjs/server";
import BillingClient from "@/components/dashboard/BillingClient";
import VideoClient from "@/components/dashboard/VideoClient";

export default async function VideoPage() {
  const { userId } = await auth();

  // If no userId from Clerk, show error/login prompt
  if (!userId) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <p>Please sign in to access the dashboard</p>
      </div>
    );
  }

  try {
    // Try to get user from database
    const userDb = await getUserById(userId);
    
    // Attempt to fetch videos regardless of whether user exists in DB yet
    // The API will handle the case where the user doesn't exist
    const videosResponse = await fetch(
      `${process.env.APP_URL}/api/videos/fetch-videos`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      }
    );

    const videosData = await videosResponse.json();

    // Pass both the userId from Clerk and the userDb (which might be null for new users)
    // The client component will handle this case
    return <VideoClient userDb={userDb} videosDb={videosData} clerkUserId={userId} />;
  } catch (error) {
    console.error("Error fetching data:", error);
    return <div>Error loading dashboard. Please refresh the page.</div>;
  }
}
