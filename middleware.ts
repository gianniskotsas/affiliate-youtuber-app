import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

const isProtectedRoute = createRouteMatcher(["/dashboard(.*)"]);

export default clerkMiddleware(async (auth, req) => {
  // 🔹 Protect dashboard routes
  if (isProtectedRoute(req)) await auth.protect();

  const host = req.headers.get("host") || "";
  const isCustomDomain = !host.endsWith("veevo.app") && !host.includes("localhost");

  if (!isCustomDomain) {
    return NextResponse.next();
  }

  try {
    // 🔹 Check if the custom domain is mapped to a user
    const res = await fetch(`${process.env.APP_URL}/api/domains/custom-domains?host=${host}`);

    if (!res.ok) {
      console.warn(`Custom domain not found or API error: ${host}`);
      return NextResponse.next();
    }

    const data = await res.json();

    if (data?.username && data?.verified) {
      const url = req.nextUrl.clone();

      // 🔹 Prepend the username to the pathname internally
      url.pathname = `/${data.username}${req.nextUrl.pathname}`;

      return NextResponse.rewrite(url);
    }
  } catch (error) {
    console.error("Middleware error:", error);
  }

  return NextResponse.next(); // Default behavior
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
