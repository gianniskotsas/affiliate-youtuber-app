"use client";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ArrowRightIcon, Loader2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";


export default function NotPublishedPage() {
  const { user } = useUser();
  const userId = user?.id || "";
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleUpgrade = async () => {
    if (!userId) {
      router.push("/sign-up");
      return;
    }
    setLoading(true);

    const callbackUrl = window.location.href;
    const response = await fetch("/api/stripe/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        priceId: process.env.NEXT_PUBLIC_STRIPE_MONTHLY_PRICE_ID,
        userId,
        callbackUrl,
      }),
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
    <div className="flex bg-[#A8D9DD] flex-col items-center justify-center min-h-screen w-full px-4">
      <div className="relative w-32 h-32 md:w-64 md:h-64">
        <Image
          src="https://glhckkdhdbpinqmzpcqs.supabase.co/storage/v1/object/public/thumbnails/webapp/not-published/oops_person.png"
          alt="Not Published"
          fill
          className="object-contain"
          priority
        />
      </div>
      <div className="text-center flex flex-col items-center gap-2 mt-4">
        <h1 className="text-2xl font-bold">
          Oops! This page is not published yet.
        </h1>
        <p className="text-gray-600">
          Check whether you have an active subscription or if you have published
          the page.
        </p>
        <Button
          variant="default"
          onClick={handleUpgrade}
          className={cn("group mt-4 w-fit flex items-center gap-2 min-w-[150px] bg-black", loading && "opacity-50 cursor-not-allowed")}
        >
          {loading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <div className="flex items-center gap-2">
              {user ? (
                <div className="flex items-center gap-2">
                  Upgrade now
                  <ArrowRightIcon className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                </div>
              ) : (
                <div className="flex items-center gap-2.5 text-white">
                  <Image
                    src="/veevo_logo_circle.png"
                    alt="Veevo"
                    width={20}
                    height={20}
                  />
                  Veevo
                </div>
              )}
            </div>
          )}
        </Button>
      </div>
    </div>
  );
}
