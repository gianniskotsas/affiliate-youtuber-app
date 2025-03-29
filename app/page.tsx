import Link from "next/link";
import Image from "next/image";

import {
  Search,
  Users,
  Settings,
  Bell,
  ChevronDown,
  Mic,
  Video,
  ExternalLink,
  MoreVertical,
  Plus,
} from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import AppleCardsCarouselDemo from "@/components/apple-cards-carousel-demo";
import HeroSection from "@/components/landing/heroSection";
export default function Home() {
  return (
    <div className="min-h-screen w-full overflow-x-hidden">
      {/* Navigation */}

      {/* Hero Section */}
      <main className="text-center">
        <div className="bg-sidebar mx-auto px-4 py-4">
          <header className="container mx-auto px-4 py-4">
            <nav className="flex items-center justify-between">
              <div className="flex flex-row items-center gap-2">
                <Image
                  src="/veevo_logo_circle.png"
                  alt="logo"
                  width={32}
                  height={32}
                />
                <span className="text-xl font-semibold">Veevo</span>
              </div>

              <div className="hidden md:flex items-center gap-6">
                <Link href="#" className="text-gray-800 hover:text-black">
                  Home
                </Link>
                <Link href="#" className="text-gray-800 hover:text-black">
                  About
                </Link>
                <Link href="#" className="text-gray-800 hover:text-black">
                  Support
                </Link>
                <Link href="#" className="text-gray-800 hover:text-black">
                  Download
                </Link>
              </div>

              <Link
                href="/sign-in"
                className="bg-white rounded-full px-6 py-2 font-medium shadow-sm hover:shadow-md transition-shadow"
              >
                Login
              </Link>
            </nav>
          </header>

          <div className="flex flex-col gap-4 sm:gap-8 items-center justify-center min-h-[300px] sm:min-h-[500px]">
            <h1 className="text-4xl md:text-6xl lg:text-8xl font-400 max-w-5xl mx-auto leading-tight font-kavivanar">
              Elevate your affiliate revenue with short links
            </h1>

            <p className="text-gray-700 max-w-2xl mx-auto text-lg sm:text-2xl">
              Provide instant access to your affiliate products via a QR code
              placed on your content or showcase all your products in a
              dedicated page.
            </p>

            <Link
              href="sign-up"
              className={cn(
                buttonVariants({ variant: "default" }),
                "rounded-full px-8 py-3 font-medium shadow-md hover:shadow-lg transition-shadow"
              )}
            >
              Get Started
            </Link>
          </div>

          <HeroSection />

          {/* Dashboard Preview */}
          {/* <div className="w-full max-w-7xl mx-auto mt-12 h-1/4 sm:h-1/2 p-1.5 bg-neutral-500/10 rounded-2xl">
            <Image
              src="https://glhckkdhdbpinqmzpcqs.supabase.co/storage/v1/object/public/thumbnails/webapp/Screenshot%202025-02-26%20at%2019.38.00.png"
              alt="Affilify"
              width={1920}
              height={1080}
              className="rounded-2xl"
            />
          </div> */}
        </div>
      </main>


      {/* Logos */}
      <div className="container mx-auto px-4 py-16 flex flex-wrap justify-center items-center gap-8 md:gap-16">
        <div className="text-gray-500 font-bold text-xl">amazon</div>
        <div className="text-gray-500 font-bold text-xl">ATLASSIAN</div>
        <div className="text-gray-500 font-bold text-xl">GitHub</div>
        <div className="text-gray-500 font-bold text-xl">LaunchDarkly</div>
        <div className="text-gray-500 font-bold text-xl">NETFLIX</div>
        <div className="text-gray-500 font-bold text-xl">Medium</div>
      </div>
    </div>
  );
}
