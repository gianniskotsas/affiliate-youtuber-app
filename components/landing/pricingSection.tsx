import { Check, Loader2 } from "lucide-react";
import { Button, buttonVariants } from "../ui/button";
import { useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function PricingSection() {
  return (
    <div className="container mx-auto px-4 py-2 flex flex-wrap justify-center items-center mb-16">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:gap-8 items-center justify-center min-h-[150px] py-8 text-center sm:min-h-[300px]">
        <h1 className="text-4xl md:text-6xl lg:text-6xl font-400 max-w-5xl mx-auto leading-tight font-kavivanar">
          Pricing
        </h1>

        <p className="text-muted-foreground max-w-2xl mx-auto text-lg sm:text-xl">
          Prices so low our accountant thinks we made a typo.
        </p>
      </div>

      {/* Content */}
      <div className="gap-6 w-full">
        {/* Left side - Features */}
        <div className="grid grid-rows md:grid-cols-2 gap-8 md:gap-4 border-2 shadow-md rounded-xl p-6 min-h-[450px]">
          {/* Features */}
          <div>
            <h2 className="text-2xl font-bold mb-6">Get more benefits</h2>

            {/* Features */}
            <ul className="space-y-4">
              <Feature text="Get detailed analytics" />
              <Feature text="Customize your landing page" />
              <Feature text="Custom domain" />
              <Feature text="30 new links per month" />
              <Feature text="10,000 tracked clicks per month" />
              <Feature text="Unlimited product showcases" />
            </ul>
          </div>

          {/* Right side - Pricing */}
          <div className="grid md:grid-cols-2 gap-4">
            {/* Monthly Pass */}
            <div className="border-2 shadow-md rounded-xl p-6 flex flex-col justify-center">
              <h3 className="text-xl text-neutral-800 font-bold text-center">
                Monthly plan
              </h3>
              <p className="w-full text-center text-sm text-muted-foreground mb-10">
                For curious starters
              </p>
              <div className="text-center mb-4">
                {/* <span className="text-gray-500 line-through text-lg">$15</span> */}
                <div className="flex items-center justify-center">
                  <span className="text-5xl font-bold">$9</span>
                  <span className="text-gray-500 ml-1">USD</span>
                </div>
              </div>
              <p className="text-gray-500 text-center text-sm mb-6">
                Per month
              </p>
              <Link
                href={`/dashboard`}
                className={cn(buttonVariants({ variant: "default" }))}
              >
                Get started
              </Link>
            </div>

            {/* 1-Year Pass */}
            <div className="rounded-xl p-6 mt-6 text-[#065985] sm:mt-0 flex flex-col relative border-2 border-[#065985] justify-center">
              <div className="absolute -top-3 right-6 bg-[#065985] text-white text-xs font-bold px-3 py-1 rounded-full">
                40% OFF
              </div>
              <h3 className="text-xl text-neutral-800 font-bold text-center">
                1-Year Pass
              </h3>
              <p className="w-full text-center text-sm text-muted-foreground mb-4">
                For commited creators
              </p>
              <div className="text-center mb-4">
                <span className="text-gray-500 line-through text-lg">$99</span>
                <div className="flex items-center justify-center">
                  <span className="text-5xl font-bold">$59</span>
                  <span className="text-gray-500 ml-1">USD</span>
                </div>
              </div>
              <p className="text-gray-500 text-center text-sm mb-6">
                One-time payment.
              </p>
              <Link
                href={`/dashboard`}
                className={cn(buttonVariants({ variant: "default" }))}
              >
                Get started
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Feature({ text, highlight }: { text: string; highlight?: string }) {
  if (highlight) {
    const parts = text.split(highlight);
    return (
      <li className="flex">
        <Check className="h-5 w-5 text-[#065985] mr-2 flex-shrink-0 mt-0.5" />
        <span>
          {parts[0]}
          <span className="underline decoration-dotted decoration-[#065985]">
            {highlight}
          </span>
          {parts[1]}
        </span>
      </li>
    );
  }

  return (
    <li className="flex">
      <Check className="h-5 w-5 text-[#065985] mr-2 flex-shrink-0 mt-0.5" />
      <span>{text}</span>
    </li>
  );
}
