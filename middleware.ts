import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

const isProtectedRoute = createRouteMatcher(["/dashboard(.*)"]);

export default clerkMiddleware(async (auth, req) => {
  // 🔹 Protect dashboard routes
  if (isProtectedRoute(req)) await auth.protect();

  const host = req.headers.get("host") || "";

  try {
    // 🔹 Fetch user details for the custom domain
    const res = await fetch(`${req.nextUrl.origin}/api/domains/custom-domains?host=${host}`);

    // 🔹 If the API response is not OK or domain is not found, continue normally
    if (!res.ok) {
      console.warn(`Custom domain not found or API error: ${host}`);
      return NextResponse.next();
    }

    const data = await res.json();

    // 🔹 Ensure the domain is verified before rewriting
    if (data.username && data.verified) {
      const url = req.nextUrl.clone();
      if (host.endsWith("veevo.app")) {
        url.pathname = `/${data.username}${req.nextUrl.pathname}`;
      } else {
        url.hostname = host;
        url.pathname = req.nextUrl.pathname.replace(`/${data.username}`, "");
      }
      return NextResponse.rewrite(url);
    }
  } catch (error) {
    console.error("Middleware error:", error);
  }

  return NextResponse.next(); // Default behavior
});

export const config = {
  matcher: [
    // 🔹 Skip Next.js internals and static files
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // 🔹 Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
