"use client";

import { AppSidebar } from "@/components/dashboard/app-sidebar";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
export default function BillingPage() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="bg-sidebar md:pt-1.5">
        <div className="relative min-h-full bg-sidebar pt-px md:rounded-tl-2xl md:border md:border-b-0 md:border-r-0 md:border-neutral-200/80 md:bg-white">
          <div className="bg-sidebar md:bg-white">
            <div className="mx-auto w-full max-w-screen-xl px-3 lg:px-10 mt-3 md:mt-6 md:py-3">
              <h1 className="text-xl font-semibold leading-7 text-neutral-900 md:text-2xl">
                Billing
              </h1>
              <div className="grid md:grid-cols-2 gap-6 mt-8">
          {/* Basic Plan */}
          <div className="border border-gray-200 rounded-xl p-8 relative">
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-black">Basic plan</h2>
              <p className="text-gray-600">Everything to get you started.</p>
            </div>

            <div className="mt-8 flex items-baseline">
              <span className="text-5xl font-bold text-black">$9</span>
              <span className="ml-2 text-gray-600">per month</span>
            </div>

            <div className="absolute top-8 right-8 bg-gray-100 px-3 py-1 rounded-full text-sm">Renews in 14 days</div>

            <div className="mt-12">
              <Button disabled={true} className="w-full py-6 border border-gray-200 rounded-lg text-center font-medium bg-white text-black">
                Current plan
              </Button>
            </div>
          </div>

          {/* Business Plan */}
          <div className="border border-gray-200 rounded-xl p-8">
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-black">Business plan</h2>
              <p className="text-gray-600">For committed creators.</p>
            </div>

            <div className="mt-8 flex items-baseline">
              <span className="text-5xl font-bold text-black">$59</span>
              <span className="ml-2 text-gray-600"> per year</span>
            </div>

            <div className="mt-12">
              <button className="w-full py-3 bg-black text-white rounded-lg text-center font-medium">
                Upgrade plan
              </button>
            </div>
          </div>
        </div>

              <div className="mt-6 flex flex-col gap-4">

              </div>


            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
