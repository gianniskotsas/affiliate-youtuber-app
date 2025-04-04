"use client";

import React, { useState, useEffect } from "react";
import { AppSidebar } from "@/components/dashboard/app-sidebar";
import Image from "next/image";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import AddVideoModal from "@/components/dashboard/create-video-button";
import { SelectVideo, SelectUser } from "@/db/schema";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";

export default function VideoClient({
  userDb,
  videosDb,
  clerkUserId,
}: {
  userDb: SelectUser | null;
  videosDb: SelectVideo[];
  clerkUserId: string;
}) {
  const [videos, setVideos] = useState<SelectVideo[]>(videosDb);
  const [user, setUser] = useState<SelectUser | null>(userDb);
  const { toast } = useToast();

  // Poll for user data if it doesn't exist yet
  useEffect(() => {
    if (!user && clerkUserId) {
      const checkForUser = async () => {
        try {
          const response = await fetch('/api/users/get-user', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId: clerkUserId }),
          });
          
          if (response.ok) {
            const userData = await response.json();
            if (userData) {
              setUser(userData);
            }
          }
        } catch (error) {
          console.error('Error fetching user:', error);
        }
      };
      
      // Check immediately
      checkForUser();
      
      // Then poll every 2 seconds until we get the user
      const interval = setInterval(checkForUser, 2000);
      
      // Clean up on component unmount
      return () => clearInterval(interval);
    }
  }, [user, clerkUserId]);

  return (
    <SidebarProvider>
      <AppSidebar userDb={user} clerkUserId={clerkUserId} />
      <div className="flex flex-col w-full bg-sidebar">
        <SidebarTrigger className="sm:hidden p-6" />
        <SidebarInset className="bg-sidebar md:pt-1.5">
          <div className="relative min-h-full bg-sidebar pt-px md:rounded-tl-2xl md:border md:border-b-0 md:border-r-0 md:border-neutral-200/80 md:bg-white">
            <div className="bg-sidebar md:bg-white">
              <div className="mx-auto w-full max-w-screen-xl px-3 lg:px-10 mt-3 md:mt-6 md:py-3">
                <h1 className="text-xl font-semibold leading-7 text-neutral-900 md:text-2xl">
                  Videos
                </h1>
                <div className="flex flex-row-reverse items-center justify-between gap-4">
                  <AddVideoModal isOpen={false} onClose={() => {}} />
                  <div>
                    <div className="flex items-center gap-2"></div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4 mt-6">
                  {!user && (
                    <div className="col-span-3 text-center py-10">
                      <p className="text-gray-500 mb-2">Setting up your account...</p>
                      <div className="flex justify-center">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900"></div>
                      </div>
                    </div>
                  )}
                  
                  {user && videos.length > 0 ? (
                    videos.map((video) => (
                      <div key={video.id} className="flex flex-col gap-2 mt-4">
                        <Link
                          href={`/dashboard/video/${video.id}`}
                          key={video.id}
                          className="group rounded-lg border bg-card text-card-foreground shadow-sm relative overflow-hidden border-opacity-10 border-primary"
                          style={{ aspectRatio: "16/9" }}
                        >
                          <Image
                            src={video.videoThumbnail}
                            alt={video.videoTitle}
                            quality={20}
                            fill
                            className="object-cover"
                          />
                          <div className="absolute top-0 right-0 p-2 inset-0 group-hover:bg-black/40 transition-all duration-200"></div>
                          <div className="absolute group-hover:block hidden top-0 right-0 bg-neutral-50 rounded-bl-xl border-neutral-50/60 border-l-4 border-b-4 z-50 p-1.5">
                            {" "}
                            <span className="text-neutral-60/90">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={2.5}
                                stroke="currentColor"
                                className="size-3"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="m4.5 19.5 15-15m0 0H8.25m11.25 0v11.25"
                                />
                              </svg>
                            </span>
                          </div>
                        </Link>
                        <div className="flex flex-col gap-0.5">
                          <p className="text-sm font-bold">
                            {video.videoTitle}
                          </p>
                          <p className="text-xs text-neutral-500">
                            {video.videoSlug}
                          </p>
                        </div>
                      </div>
                    ))
                  ) : user && videos.length === 0 ? (
                    <p className="col-span-3 text-center text-gray-500">
                      No videos found.
                    </p>
                  ) : null}
                </div>
              </div>
            </div>
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
