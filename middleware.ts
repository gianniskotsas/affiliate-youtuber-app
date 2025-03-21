import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

const isProtectedRoute = createRouteMatcher(["/dashboard(.*)"]);

export default clerkMiddleware(async (auth, req) => {
  // 🔒 Protect /dashboard routes
  if (isProtectedRoute(req)) await auth.protect();

  const host = req.headers.get("host") || "";
  const isCustomDomain = !host.endsWith("veevo.app") && !host.includes("localhost");

  if (!isCustomDomain) {
    return NextResponse.next(); // Not a custom domain — skip rewrite
  }

  try {
    // 🔍 Resolve custom domain to username
    const res = await fetch(`${process.env.APP_URL}/api/domains/custom-domains?host=${host}`);

    if (!res.ok) {
      console.warn(`Custom domain not found or API error: ${host}`);
      return NextResponse.next();
    }

    const data = await res.json();

    if (data?.username && data?.verified) {
      const url = req.nextUrl.clone();

      // 🔁 Rewrite to /vv/[username]/...
      url.pathname = `/vv/${data.username}${req.nextUrl.pathname}`;

      return NextResponse.rewrite(url);
    }
  } catch (error) {
    console.error("Middleware error:", error);
  }

  return NextResponse.next(); // Fallback: continue as normal
});

export const config = {
  matcher: [
    // Match all routes except static files and Next.js internals
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always match API routes
    "/(api|trpc)(.*)",
  ],
};
