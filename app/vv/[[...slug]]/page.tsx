import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { db } from "@/db";
import { users, videos, products } from "@/db/schema";
import { eq } from "drizzle-orm";
import VideoPage from "@/components/video/videopage";

export default async function Page({ params }: { params: { slug?: string[] } }) {
  const slugParts = params.slug || [];

  const host = headers().get("host") || "";
  let username: string | null = null;
  let videoSlug: string | null = null;

  if (host.endsWith("veevo.app") || host.includes("localhost")) {
    // Expecting /[username]/[videoSlug]
    username = slugParts[0];
    videoSlug = slugParts[1];
  } else {
    // Custom domain → /vv/[username]/[videoSlug]
    username = slugParts[0];
    videoSlug = slugParts[1];
  }

  if (!username || !videoSlug) return notFound();

  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.username, username))
    .limit(1);

  if (!user || !user.stripeSubscriptionId) return notFound();

  const [video] = await db
    .select()
    .from(videos)
    .where(eq(videos.videoSlug, videoSlug))
    .limit(1);

  if (!video || !video.active) return notFound();

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
