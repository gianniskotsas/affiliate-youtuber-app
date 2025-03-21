import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url); // ✅ Edge-compatible
    const host = url.searchParams.get("host");

    if (!host) {
      return new Response(JSON.stringify({ error: "Missing host parameter" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Fetch user by custom domain
    const user = await db
      .select({
        username: users.username,
        domain: users.domain,
      })
      .from(users)
      .where(eq(users.domain, host))
      .limit(1);

    if (user.length > 0) {
      return new Response(
        JSON.stringify({ username: user[0].username, verified: true }),
        {
          status: 200,
          headers: { "Content-Type": "application/json" },
        }
      );
    } else {
      return new Response(JSON.stringify({ error: "Domain not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }
  } catch (error) {
    console.error("API Error:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
