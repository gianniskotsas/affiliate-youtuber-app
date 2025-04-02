import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

const isProtectedRoute = createRouteMatcher(["/dashboard(.*)"]);

export default clerkMiddleware(async (auth, req) => {
  const { pathname } = req.nextUrl;
  const host = req.headers.get("host") || "";

  // Exclude API routes and specifically the Clerk webhook from the custom domain logic
  if (
    pathname.startsWith("/api/webhooks/clerk") ||
    pathname.startsWith("/api/") ||
    pathname.startsWith("/ingest/") ||
    pathname === "/favicon.ico" ||
    pathname === "/"
  ) {
    console.log("Skipping middleware for API route:", pathname);
    return NextResponse.next();
  }

  console.log('pathname', pathname)

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