"use client";

import React, { useEffect, useState } from "react";
import { AppSidebar } from "@/components/dashboard/app-sidebar";
import { useAuth, useUser } from "@clerk/nextjs";
import Image from "next/image";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import AddVideoModal from "@/components/dashboard/create-video-button";
import { SelectVideo } from "@/db/schema";

export default function Page() {
  const { isLoaded, userId } = useAuth();
  const { user } = useUser();
  const [videos, setVideos] = useState<SelectVideo[]>([]);

  useEffect(() => {
    if (isLoaded && userId && user) {
      fetch("/api/user/check-user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          email: user.primaryEmailAddress?.emailAddress,
          username: user.username ?? user.firstName,
        }),
      }).catch((error) => {
        console.error("Failed to ensure user is in DB:", error);
      });
    }
  }, [isLoaded, userId, user]);

  useEffect(() => {
    if (userId) {
      fetch("/api/videos/fetch-videos")
        .then((res) => res.json())
        .then((data) => setVideos(data))
        .catch((error) => console.error("Failed to fetch videos:", error));
    }
  }, [userId]);

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
                <AddVideoModal isOpen={false} onClose={() => {}} />
                <div>
                  <div className="flex items-center gap-2">
                    <h1 className="text-xl font-semibold leading-7 text-neutral-900 md:text-2xl">
                      Videos
                    </h1>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4 mt-6">
                {videos.length > 0 ? (
                  videos.map((video) => (
                    <div
                      key={video.id}
                      className="rounded-lg border bg-card text-card-foreground shadow-sm relative overflow-hidden"
                      style={{ aspectRatio: "16/9" }}
                    >
                      <Image
                        src={video.videoThumbnail}
                        alt={video.videoTitle}
                        fill
                        className="object-cover"
                      />
                      <div className="absolute inset-0 bg-black/40"></div>
                      <div className="absolute bottom-0 p-6 w-full">
                        <h3 className="text-lg font-semibold text-white">
                          {video.videoTitle}
                        </h3>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-gray-500">No videos found.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
