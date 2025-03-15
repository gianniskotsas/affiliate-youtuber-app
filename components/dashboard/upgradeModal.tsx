"use client";

import { useState } from "react";
import { Check, Loader2 } from "lucide-react";
import { Button } from "../ui/button";
import {
  ResponsiveModal,
  ResponsiveModalContent,
} from "@/components/ui/responsive-modal";

export default function UpgradeModal({
  open,
  setOpen,
  userId,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
  userId: string;
}) {
  const [loading, setLoading] = useState(false);

  const handleUpgrade = async (priceId: string) => {
    setLoading(true);

    console.log('[USER_ID]', userId);

    const callbackUrl = window.location.href;
    const response = await fetch("/api/stripe/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ priceId, userId, callbackUrl }),
    });

    const data = await response.json();
    if (data.url) {
      window.location.href = data.url; // Redirect to Stripe checkout
    } else {
      alert("Error redirecting to checkout");
    }
    setLoading(false);
  };

  return (
    <ResponsiveModal open={open} onOpenChange={setOpen}>
      <ResponsiveModalContent
        className="items-center justify-center p-0 border-none"
        side="bottom"
      >
        <div className="bg-white text-[#0F0F0F] flex flex-col w-fullrounded-xl overflow-hidden shadow-xl">
          {/* Header */}
          <div className="text-center pt-16 pb-8 px-4">
            <h1 className="text-2xl md:text-4xl font-bold mb-6 max-w-4xl mx-auto leading-tight">
              Deploy your landing page, grow your affiliate link traffic.
            </h1>
          </div>

          {/* Content */}
          <div className="gap-6 p-6">
            {/* Left side - Features */}
            <div className="grid grid-rows md:grid-cols-2 gap-8 md:gap-4 border-2 shadow-md rounded-xl p-6">
              {/* Features */}
              <div>
                <h2 className="text-2xl font-bold mb-6">Get more benefits</h2>

                {/* Features */}
                <ul className="space-y-4">
                  <Feature text="Get detailed analytics" />
                  <Feature text="Customize your landing page" />
                  <Feature text="Custom domain" />
                  <Feature text="Custom short links" />
                  <Feature text="300 new links per month" />
                  <Feature text="10,000 tracked clicks per month" />
                  <Feature text="Unlimited product showcases" />
                </ul>
              </div>

              {/* Right side - Pricing */}
              <div className="grid md:grid-cols-2 gap-4">
                {/* Monthly Pass */}
                <div className="border-2 shadow-md rounded-xl p-6 flex flex-col">
                  <h3 className="text-xl font-bold mb-4 text-center">
                    Monthly Pass
                  </h3>
                  <div className="text-center mb-4">
                    <span className="text-gray-500 line-through text-lg">
                      $15
                    </span>
                    <div className="flex items-center justify-center">
                      <span className="text-5xl font-bold">$9</span>
                      <span className="text-gray-500 ml-1">USD</span>
                    </div>
                  </div>
                  <p className="text-gray-500 text-center text-sm mb-6">
                    Per month
                  </p>
                  <Button
                    variant="outline"
                    onClick={() =>
                      handleUpgrade(
                        process.env.NEXT_PUBLIC_STRIPE_MONTHLY_PRICE_ID!
                      )
                    }
                    className="mt-auto py-3 rounded-xl border border-[#065985] text-[#065985] font-medium"
                  >
                    {loading ? (
                      <span className="flex items-center justify-center">
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />{" "}
                        DEPLOYING
                      </span>
                    ) : (
                      "DEPLOY NOW"
                    )}
                  </Button>
                </div>

                {/* 1-Year Pass */}
                <div className="bg-[#E1F2FE] rounded-xl p-6 flex flex-col relative border border-[#065985]">
                  <div className="absolute -top-3 right-6 bg-[#065985] text-white text-xs font-bold px-3 py-1 rounded-full">
                    POPULAR
                  </div>
                  <h3 className="text-xl font-bold mb-4 text-center">
                    1-Year Pass
                  </h3>
                  <div className="text-center mb-4">
                    <span className="text-gray-500 line-through text-lg">
                      $99
                    </span>
                    <div className="flex items-center justify-center">
                      <span className="text-5xl font-bold">$59</span>
                      <span className="text-gray-500 ml-1">USD</span>
                    </div>
                  </div>
                  <p className="text-gray-500 text-center text-sm mb-6">
                    One-time payment. 40% off
                  </p>
                  <Button
                    onClick={() =>
                      handleUpgrade(
                        process.env.NEXT_PUBLIC_STRIPE_YEARLY_PRICE_ID!
                      )
                    }
                    className="mt-auto bg-[#065985] hover:bg-[#054b6f] text-white py-3 rounded-xl font-medium"
                  >
                    {loading ? (
                      <span className="flex items-center justify-center">
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />{" "}
                        DEPLOYING
                      </span>
                    ) : (
                      "DEPLOY NOW"
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </ResponsiveModalContent>
    </ResponsiveModal>
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
