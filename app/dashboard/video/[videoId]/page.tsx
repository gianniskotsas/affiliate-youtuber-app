"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { AppSidebar } from "@/components/dashboard/app-sidebar";
import { useAuth, useUser } from "@clerk/nextjs";
import Image from "next/image";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import AddVideoModal from "@/components/dashboard/create-video-button";
import { SelectVideo } from "@/db/schema";
import MockupPage from "@/components/dashboard/iphone-mockup";


export default function EditVideoPage() {
  const router = useRouter();
  const { videoId } = useParams();
  const [video, setVideo] = useState(null);
  const { isLoaded, userId } = useAuth();
  const { user } = useUser();

  useEffect(() => {
    if (videoId) {
      fetch(`/api/videos/fetch-video`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ videoId }),
      })
        .then((res) => res.json())
        .then((data) => setVideo(data))
        .catch((error) => console.error("Failed to fetch video:", error));
    }
  }, [videoId]);

  if (!videoId) {
    return <div>Invalid video ID</div>;
  }

  if (!userId) {
    // router.push("/sign-in");
    return null;
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="bg-sidebar md:pt-1.5">
        <div className="relative min-h-full bg-sidebar pt-px md:rounded-tl-2xl md:border md:border-b-0 md:border-r-0 md:border-neutral-200/80 md:bg-white">
          <div className="bg-sidebar md:bg-white">
            <div className="mx-auto w-full max-w-screen-xl px-3 lg:px-10 mt-3 md:mt-6 md:py-3">
              <h1 className="text-xl font-semibold leading-7 text-neutral-900 md:text-2xl">
                Edit Video Page
              </h1>
              <div className="flex flex-row gap-4 h-full mt-8">
                <div className="w-full">
                  <div className="flex items-center gap-2">f</div>
                </div>
                <MockupPage />
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
