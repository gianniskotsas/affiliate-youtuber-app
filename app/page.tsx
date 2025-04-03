"use client";

import Link from "next/link";
import Image from "next/image";

import { ArrowRight, MoveUpRight } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import HeroSection from "@/components/landing/heroSection";
import FeatureSection from "@/components/landing/featureSection";
import PricingSection from "@/components/landing/pricingSection";

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
                <Link
                  href="#features"
                  className="text-gray-800 hover:underline hover:text-black transition-colors duration-300"
                  onClick={(e) => {
                    e.preventDefault();
                    document
                      .getElementById("features")
                      ?.scrollIntoView({ behavior: "smooth" });
                  }}
                >
                  Features
                </Link>
                <Link
                  href="#pricing"
                  className="text-gray-800 hover:text-black hover:underline transition-colors duration-300"
                  onClick={(e) => {
                    e.preventDefault();
                    document
                      .getElementById("pricing")
                      ?.scrollIntoView({ behavior: "smooth" });
                  }}
                >
                  Pricing
                </Link>
                <Link
                  href="/blog"
                  target="_blank"
                  className="text-gray-800 hover:text-black hover:underline transition-colors duration-300 group"
                >
                  <div className="flex flex-row gap-0 items-center">
                    Blog{" "}
                    <MoveUpRight className="w-4 h-4 ml-1 text-gray-800 group-hover:block group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                  </div>
                </Link>
              </div>

              <Link
                href="/sign-in"
                className="bg-white rounded-full px-6 py-2 font-medium shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex flex-row items-center gap-2 group">
                  Login{" "}
                  <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            </nav>
          </header>

          <div className="flex flex-col gap-4 sm:gap-8 items-center justify-center min-h-[300px] sm:min-h-[500px]">
            <h1 className="text-4xl md:text-6xl lg:text-8xl font-400 max-w-5xl mx-auto leading-tight font-kavivanar">
              Elevate your affiliate revenue with short links
            </h1>

            <p className="text-muted-foreground max-w-2xl mx-auto text-lg sm:text-xl">
              Provide instant access to your affiliate products via a QR code
              placed on your content or showcase all your products in a
              dedicated page.
            </p>

            <Link
              href="sign-up"
              className={cn(
                buttonVariants({ variant: "default", size: "lg" }),
                "rounded-full px-8 py-3 font-medium shadow-md hover:shadow-lg transition-shadow group"
              )}
            >
              Get Started{" "}
              <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <HeroSection />

          {/* Features Preview */}
        </div>
      </main>

      {/* Logos */}
      <div id="features">
        <FeatureSection />
      </div>

      <div id="pricing">
        <PricingSection />
      </div>

      {/* Footer */}
      <footer className=" border-t">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <Image
                  src="/veevo_logo_circle.png"
                  alt="Veevo logo"
                  width={32}
                  height={32}
                />
                <span className="text-xl font-semibold">Veevo</span>
              </div>
              <p className="text-gray-600 max-w-md">
                Boost affiliate revenue with short links and QR codes for your
                products.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="#features"
                    onClick={(e) => {
                      e.preventDefault();
                      document
                        .getElementById("features")
                        ?.scrollIntoView({ behavior: "smooth" });
                    }}
                    className="text-gray-600 hover:text-gray-900"
                  >
                    Features
                  </Link>
                </li>
                <li>
                  <Link
                    href="#pricing"
                    onClick={(e) => {
                      e.preventDefault();
                      document
                        .getElementById("pricing")
                        ?.scrollIntoView({ behavior: "smooth" });
                    }}
                    className="text-gray-600 hover:text-gray-900"
                  >
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link
                    href="/blog"
                    className="text-gray-600 hover:text-gray-900"
                  >
                    Blog
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Boring stuff</h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/privacy"
                    className="text-gray-600 hover:text-gray-900"
                  >
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link
                    href="/terms"
                    className="text-gray-600 hover:text-gray-900"
                  >
                    Terms of Service
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t sm:border-none mt-12 pt-8">
            <p className="text-center text-gray-600">
              © {new Date().getFullYear()} Veevo. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
