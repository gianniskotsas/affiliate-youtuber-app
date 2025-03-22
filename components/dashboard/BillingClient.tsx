"use client";

import { useEffect, useState } from "react";
import { AppSidebar } from "@/components/dashboard/app-sidebar";
import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Settings, Loader2 } from "lucide-react";
import InvoicesPage from "@/components/invoices/invoice-list";
import { SelectUser } from "@/db/schema";

interface BillingPageProps {
  userDb: SelectUser;
  invoices: {
    id: string;
    amount: number;
    created: number;
    currency: string;
    status: string;
  }[];
  priceId: string | null;
}

export default function BillingPage({
  userDb,
  invoices,
  priceId,
}: BillingPageProps) {
  const [manageSubscriptionLoading, setManageSubscriptionLoading] =
    useState(false);
  const [monthlyPlanLoading, setMonthlyPlanLoading] = useState(false);
  const [yearlyPlanLoading, setYearlyPlanLoading] = useState(false);
  const [loadingPrice, setLoadingPrice] = useState(true);
  const [loadingInvoices, setLoadingInvoices] = useState(true);

  // Determine if the user is on the Monthly or Yearly plan
  const isMonthly = priceId === process.env.NEXT_PUBLIC_STRIPE_MONTHLY_PRICE_ID; // Replace with actual Stripe price ID for monthly plan
  const isYearly = priceId === process.env.NEXT_PUBLIC_STRIPE_YEARLY_PRICE_ID; // Replace with actual Stripe price ID for yearly plan

  const handleSwitchPlan = async (priceId: string, isMonthly: boolean) => {
    try {
      if (isMonthly) {
        setMonthlyPlanLoading(true);
      } else {
        setYearlyPlanLoading(true);
      }
      const returnUrl = `${window.location.origin}/dashboard/billing`;
      const response = await fetch("/api/stripe/subscription/switch-plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          stripeCustomerId: userDb?.stripeCustomerId,
          priceId,
          returnUrl,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to switch plan");
      }

      const data = await response.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert("Failed to redirect. Please try again.");
      }
    } catch (error) {
      console.error("Error switching plan:", error);
    } finally {
      if (isMonthly) {
        setMonthlyPlanLoading(false);
      } else {
        setYearlyPlanLoading(false);
      }
    }
  };

  return (
    <SidebarProvider>
      <AppSidebar userDb={userDb} />
      <div className="flex flex-col w-full bg-sidebar">
        <SidebarTrigger className="sm:hidden p-6" />
        <SidebarInset className="bg-sidebar md:pt-1.5">
          <div className="relative min-h-full bg-sidebar pt-px md:rounded-tl-2xl md:border md:border-b-0 md:border-r-0 md:border-neutral-200/80 md:bg-white">
            <div className="bg-sidebar md:bg-white">
              <div className="mx-auto w-full max-w-screen-xl px-3 lg:px-10 mt-3 md:mt-6 md:py-3">
                <div className="flex justify-between items-center">
                  <h1 className="text-xl font-semibold leading-7 text-neutral-900 md:text-2xl">
                    Billing
                  </h1>
                  <Button
                    variant="outline"
                    disabled={!userDb?.stripeCustomerId}
                    onClick={(e) => {
                      e.preventDefault();
                      setManageSubscriptionLoading(true);
                      const returnUrl = `${window.location.origin}/dashboard/billing`;
                      fetch("/api/stripe/portal", {
                        method: "POST",
                        body: JSON.stringify({ userId: userDb?.id, returnUrl }),
                      })
                        .then(async (response) => {
                          const data = await response.json();
                          if (data.url) {
                            window.location.href = data.url;
                          } else {
                            alert("Failed to redirect. Please try again.");
                          }
                        })
                        .finally(() => {
                          setManageSubscriptionLoading(false);
                        });
                    }}
                  >
                    {manageSubscriptionLoading ? (
                      <div className="flex flex-row items-center gap-2">
                        <Loader2 className="w-4 h-4 animate-spin" /> Loading...
                      </div>
                    ) : (
                      <div className="flex flex-row items-center gap-2">
                        <Settings className="w-4 h-4" />
                        Manage subscription
                      </div>
                    )}
                  </Button>
                </div>

                <div className="grid md:grid-cols-2 gap-6 mt-8">
                  {/* Monthly Plan */}
                  {isYearly ? (
                    ""
                  ) : (
                    <div className="border border-gray-200 rounded-xl p-8 relative">
                      <div className="space-y-2">
                        <h2 className="text-2xl font-bold text-black">
                          Monthly plan
                        </h2>
                        <p className="text-gray-600">
                          Everything to get you started.
                        </p>
                      </div>
                      <div className="mt-8 flex items-baseline">
                        <span className="text-5xl font-bold text-black">
                          $9
                        </span>
                        <span className="ml-2 text-gray-600">per month</span>
                      </div>

                      <div className="mt-12">
                        <Button
                          disabled={isMonthly || loadingPrice}
                          variant={!isMonthly ? "default" : "outline"}
                          className={`w-full py-6 border border-gray-200 rounded-lg text-center font-medium `}
                          onClick={() =>
                            handleSwitchPlan(
                              process.env.NEXT_PUBLIC_STRIPE_MONTHLY_PRICE_ID ??
                                "",
                              true
                            )
                          }
                        >
                          {isMonthly ? "Current plan" : "Switch to this plan"}
                        </Button>
                      </div>
                    </div>
                  )}

                  {/* Yearly Plan */}
                  <div className="border border-gray-200 rounded-xl p-8">
                    <div className="space-y-2">
                      <h2 className="text-2xl font-bold text-black">
                        Yearly plan
                      </h2>
                      <p className="text-gray-600">For committed creators.</p>
                    </div>
                    <div className="mt-8 flex items-baseline">
                      <span className="text-5xl font-bold text-black">$59</span>
                      <span className="ml-2 text-gray-600"> per year</span>
                    </div>
                    <div className="mt-12">
                      <Button
                        disabled={isYearly || loadingPrice}
                        variant={!isYearly ? "default" : "outline"}
                        className={`w-full py-6 border border-gray-200 rounded-lg text-center font-medium `}
                        onClick={() =>
                          handleSwitchPlan(
                            process.env.NEXT_PUBLIC_STRIPE_YEARLY_PRICE_ID ??
                              "",
                            false
                          )
                        }
                      >
                        {isYearly ? "Current plan" : "Switch to this plan"}
                      </Button>
                    </div>
                  </div>
                </div>

                <InvoicesPage invoices={invoices} />
              </div>
            </div>
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
