import { db } from "@/db";
import { users, videos, products, SelectUser, SelectVideo } from "@/db/schema";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import VideoPage from "@/components/video/videopage";
interface VideoPageProps {
  params: {
    username: string;
    videoSlug: string;
  };
}

export default async function Page({ params }: VideoPageProps) {
  const { username, videoSlug } = params;


  // Fetch the user based on the username
  const [user]: SelectUser[] = await db
    .select()
    .from(users)
    .where(eq(users.username, username))
    .limit(1);

  if (!user || !user.stripeSubscriptionId) {
    return notFound(); // User not found or doesn't have an active subscription
  }

  // Fetch the video based on the videoSlug and userId
  const [video]: SelectVideo[] = await db
    .select()
    .from(videos)
    .where(eq(videos.videoSlug, videoSlug))
    .limit(1);

  if (!video || !video.active) {
    return notFound(); // Video not found or not active
  }

  // Fetch products associated with the video
  const productsArray = await db
    .select()
    .from(products)
    .where(eq(products.videoId, video.id));

  return (
    <section>
      <VideoPage products={productsArray} userDb={user} />
    </section>
  );
}
