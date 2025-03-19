import { db } from "@/db";
import { users, videos, products, SelectVideo, SelectProduct } from "@/db/schema";
import { eq } from "drizzle-orm";


export async function getUserById(userId: string) {
  try {
    const user = await db
      .select()
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);
    return user.length > 0 ? user[0] : null;
  } catch (error) {
    console.error("Error fetching user by ID:", error);
    return null;
  }
}

export async function getVideoById(videoId: string) {
  try {
    const video: SelectVideo[] = await db
      .select()
      .from(videos)
      .where(eq(videos.id, videoId))
      .limit(1);
    return video.length > 0 ? video[0] : null;
  } catch (error) {
    console.error("Error fetching video by ID:", error);
    return null;
  }
}

export async function getProductsByVideoId(videoId: string) {
  try {
    const productsData: SelectProduct[] = await db
      .select()
      .from(products)
      .where(eq(products.videoId, videoId));
    return productsData;
  } catch (error) {
    console.error("Error fetching products by video ID:", error);
    return [];
  }
}
