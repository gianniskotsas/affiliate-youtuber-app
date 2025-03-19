import { cookies } from "next/headers";
import { getUserById } from "@/db/queries";
import DomainClient from "@/components/dashboard/DomainClient";
import { auth } from "@clerk/nextjs/server";
import BillingClient from "@/components/dashboard/BillingClient";
import VideoClient from "@/components/dashboard/VideoClient";

export default async function VideoPage() {

  const { userId } = await auth();

  const userDb = userId ? await getUserById(userId) : null;

  if (!userDb) {
    return <div>User not found</div>;
  }

  try {

    const videos = await fetch(`${process.env.APP_URL}/api/videos/fetch-videos`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId }),
    })

    console.log(videos);

    const videosData = await videos.json();

    console.log(videosData);

    return <VideoClient userDb={userDb} videosDb={videosData} />;
  } catch (error) {
    console.error("Error fetching video data:", error);
    return <div>Error loading video information</div>;
  }
} 
