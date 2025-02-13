'use client'
import type { JSX } from "react";
import React, { useEffect, useState } from "react";
import { AppSidebar } from "@/components/dashboard/app-sidebar";
import { useAuth, useUser } from "@clerk/nextjs";
import Image from "next/image";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import AddVideoModal from "@/components/dashboard/create-video-button";

export default function Page() {
  const { isLoaded, userId } = useAuth();
  const { user } = useUser();

  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  if (!userId) {
    return <div>Sign in to view this page</div>;
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="bg-sidebar md:pt-1.5">
        <div className="relative min-h-full bg-sidebar pt-px md:rounded-tl-2xl md:border md:border-b-0 md:border-r-0 md:border-neutral-200/80 md:bg-white">
          <div className="bg-sidebar md:bg-white">
            <div className="mx-auto w-full max-w-screen-xl px-3 lg:px-10 mt-3 md:mt-6 md:py-3">
              <div className="flex flex-row-reverse items-center justify-between  gap-4">
                <AddVideoModal isOpen={true} onClose={() => {}} />
                <div>
                  <div className="flex items-center gap-2">
                    <h1 className="text-xl font-semibold leading-7 text-neutral-900 md:text-2xl">
                      Videos
                    </h1>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4 mt-6">
                {/* Need to import Image from 'next/image' at the top of the file */}
                <div
                  className="rounded-lg border bg-card text-card-foreground shadow-sm relative overflow-hidden"
                  style={{ aspectRatio: "16/9" }}
                >
                  <Image
                    src="/placeholder.jpg"
                    alt="Video title 1"
                    fill
                    className="object-cover"
                    priority
                  />
                  <div className="absolute inset-0 bg-black/40"></div>
                  <div className="absolute bottom-0 p-6 w-full">
                    <h3 className="text-lg font-semibold text-white">
                      Video Title 1
                    </h3>
                    <p className="text-sm text-white/80">Duration: 12:34</p>
                  </div>
                </div>

                <div
                  className="rounded-lg border bg-card text-card-foreground shadow-sm relative overflow-hidden"
                  style={{ aspectRatio: "16/9" }}
                >
                  <Image
                    src="/placeholder.jpg"
                    alt="Video title 2"
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40"></div>
                  <div className="absolute bottom-0 p-6 w-full">
                    <h3 className="text-lg font-semibold text-white">
                      Video Title 2
                    </h3>
                    <p className="text-sm text-white/80">Duration: 8:45</p>
                  </div>
                </div>

                <div
                  className="rounded-lg border bg-card text-card-foreground shadow-sm relative overflow-hidden"
                  style={{ aspectRatio: "16/9" }}
                >
                  <Image
                    src="/placeholder.jpg"
                    alt="Video title 3"
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40"></div>
                  <div className="absolute bottom-0 p-6 w-full">
                    <h3 className="text-lg font-semibold text-white">
                      Video Title 3
                    </h3>
                    <p className="text-sm text-white/80">Duration: 15:20</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
