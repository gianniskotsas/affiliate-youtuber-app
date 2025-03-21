import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { db } from "@/db";
import { users, videos, products } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import VideoPage from "@/components/video/videopage";

export default async function Page({ params }: { params: { slug?: string[] } }) {
  const slugParts = params.slug || [];

  // Normalize host (remove potential port numbers)
  const hostHeader = headers().get("host") || "";
  const host = hostHeader.split(":")[0]; 
  const isCustomDomain = !host.endsWith("veevo.app") && !host.includes("localhost");

  let username: string | null = null;
  let videoSlug: string | null = null;

  if (isCustomDomain) {
    // For custom domains, lookup the user based on the host.
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.domain, host))
      .limit(1);

    if (!user || !user.stripeSubscriptionId) return notFound();

    // Use the user record from the custom domain
    username = user.username;
    // Because the middleware rewrote to `/vv/${username}${req.nextUrl.pathname}`,
    // the resulting params.slug should be [username, videoSlug].
    // However, since we already know the username, we take the video slug from index 1.
    videoSlug = slugParts[1];

    if (!videoSlug) return notFound();

    // Fetch the video for this user.
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
    // For the default domain (veevo.app), use URL params directly.
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
