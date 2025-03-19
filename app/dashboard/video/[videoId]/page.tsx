import { getProductsByVideoId, getUserById, getVideoById } from "@/db/queries";
import { auth } from "@clerk/nextjs/server";

import VideoPageClient from "@/components/dashboard/VideoPageClient";

export default async function VideoPage({ params }: { params: { videoId: string } }) {

  const { userId } = await auth();
  const { videoId } = params;


  const [userDb, videoDb, productsDb] = await Promise.all([
    userId ? getUserById(userId) : null,
    getVideoById(videoId),
    getProductsByVideoId(videoId)
  ]);

  if (!userDb) {
    return <div>User not found</div>;
  }

  if (!videoDb) {
    return <div>Video not found</div>;
  }

  if (!productsDb) {
    return <div>Products not found</div>;
  }

  return <VideoPageClient userDb={userDb} videoDb={videoDb} productsDb={productsDb} />;
}
