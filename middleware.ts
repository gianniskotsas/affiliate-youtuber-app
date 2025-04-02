import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

const isProtectedRoute = createRouteMatcher(["/dashboard(.*)"]);

// Define paths that should bypass all middleware processing
const bypassPaths = [
  "/api/webhooks/clerk",
  "/api/webhooks/",
  "/ingest/",
  "/ingest/e",
  "/ingest/e/",
  "/favicon.ico",
  "/",
];

export default clerkMiddleware(async (auth, req) => {
  const { pathname } = req.nextUrl;
  const host = req.headers.get("host") || "";

  // Skip middleware completely for webhook and PostHog paths
  if (pathname.startsWith("/api/webhooks/") || pathname.startsWith("/ingest/")) {
    return NextResponse.next();
  }

  // Handle trailing slashes for non-API routes
  if (!pathname.startsWith("/api/") && pathname.endsWith("/") && pathname !== "/") {
    const newPathname = pathname.slice(0, -1);
    const newUrl = req.nextUrl.clone();
    newUrl.pathname = newPathname;
    console.log(`Redirecting from ${pathname} to ${newPathname}`);
    return NextResponse.redirect(newUrl);
  }

  // Skip middleware for API routes
  if (pathname.startsWith("/api/")) {
    return NextResponse.next();
  }

  console.log('pathname', pathname);

  if (isProtectedRoute(req)) await auth.protect();

  if (host.includes("localhost")) return NextResponse.next();

  const protocol = req.headers.get("x-forwarded-proto") || "https";
  const isCustomDomain = !host.endsWith("veevo.app");

  console.log("🌐 Middleware triggered for host:", host);
  console.log("🛣️ Original pathname:", pathname);

  if (!isCustomDomain) {
    return NextResponse.next(); // skip for veevo.app
  }

  try {
    const domainLookupUrl = `${protocol}://${host}/api/domains/custom-domains?host=${host}`;
    console.log("🔍 Fetching domain info from:", domainLookupUrl);

    const res = await fetch(domainLookupUrl);

    if (!res.ok) {
      console.warn(`⚠️ Custom domain not found or API error: ${host}`);
      return NextResponse.next();
    }

    const data = await res.json();
    console.log("✅ API returned:", data);

    if (data?.username && data?.verified) {
      const url = req.nextUrl.clone();
      url.pathname = `/vv/${data.username}${pathname}`;
      console.log("🔁 Rewriting to:", url.pathname);
      return NextResponse.rewrite(url);
    }
  } catch (error) {
    console.error("🔥 Middleware error:", error);
  }

  return NextResponse.next(); // fallback
});

export const config = {
  matcher: [
    // Match all routes except static files and Next.js internals
    "/((?!_next|.*\\..*|favicon.ico).*)",
    "/(api|trpc)(.*)",
  ],
};