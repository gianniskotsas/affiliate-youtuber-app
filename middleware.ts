import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { users } from "./db/schema";
import { db } from "./db";

const isProtectedRoute = createRouteMatcher(["/dashboard(.*)"]);

export default clerkMiddleware(async (auth, req) => {
  if (isProtectedRoute(req)) await auth.protect();
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};

// export async function middleware(req: NextRequest) {
//   const host = req.headers.get("host") || "";

//   // 🔹 If request is for the main domain, continue normally
//   if (host.endsWith("veevo.app")) {
//     return NextResponse.next();
//   }

//   try {
//     // 🔹 Select only the necessary fields from the database
//     const user = await db
//       .select({
//         username: users.username,
//         domain: users.domain,
//       })
//       .from(users)
//       .where(eq(users.domain, host))
//       .limit(1);

//     if (user.length > 0) {
//       // 🔹 Rewrite request to match [username]/[video-slug]
//       const url = req.nextUrl.clone();
//       url.pathname = `/${user[0].username}${req.nextUrl.pathname}`;

//       return NextResponse.rewrite(url);
//     }
//   } catch (error) {
//     console.error("Middleware error:", error);
//   }

//   return NextResponse.next(); // Default behavior
// }
