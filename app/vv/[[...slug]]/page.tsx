import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { db } from "@/db";
import { users, videos, products } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import VideoPage from "@/components/video/videopage";

export default async function Page({ params }: { params: { slug?: string[] } }) {
  const slugParts = params.slug || [];

  const host = headers().get("host") || "";
  const isCustomDomain = !host.endsWith("veevo.app") && !host.includes("localhost");

  let username: string | null = null;
  let videoSlug: string | null = null;

  if (isCustomDomain) {
    // 🔍 First get the user from the custom domain
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.domain, host))
      .limit(1);

    if (!user || !user.stripeSubscriptionId) return notFound();

    username = user.username;
    videoSlug = slugParts[1]; // Because middleware rewrote it to /vv/[username]/[videoSlug]

    if (!videoSlug) return notFound();

    // 🔍 Now fetch the video for this user
    const [video] = await db
      .select()
      .from(videos)
      .where(and(eq(videos.userId, user.id), eq(videos.videoSlug, videoSlug)))
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
  } else {
    // ✅ veevo.app/[username]/[videoSlug]
    username = slugParts[0];
    videoSlug = slugParts[1];

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
      .where(and(eq(videos.userId, user.id), eq(videos.videoSlug, videoSlug)))
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
}
