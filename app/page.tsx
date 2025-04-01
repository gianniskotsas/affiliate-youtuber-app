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
import FeatureSection from "@/components/landing/featureSection";

export default function Home() {
  return (
    <div className="min-h-screen w-full overflow-x-hidden">
      {/* Navigation */}

      {/* Hero Section */}
      <main className="text-center">
        <div className="bg-sidebar mx-auto px-4 pt-4">
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

          {/* Features Preview */}
        </div>
      </main>


      {/* Logos */}
      <FeatureSection />

    </div>
  );
}
