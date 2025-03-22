"use client";

import React, { useState } from "react";
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

export default function VideoClient({
  userDb,
  videosDb,
}: {
  userDb: SelectUser;
  videosDb: SelectVideo[];
}) {
  const [videos, setVideos] = useState<SelectVideo[]>(videosDb);

  return (
    <SidebarProvider>
      <AppSidebar userDb={userDb} />
      <div className="flex flex-col w-full bg-sidebar">
        <SidebarTrigger className="sm:hidden p-6" />
        <SidebarInset className="bg-sidebar md:pt-1.5">
          <div className="relative min-h-full bg-sidebar pt-px md:rounded-tl-2xl md:border md:border-b-0 md:border-r-0 md:border-neutral-200/80 md:bg-white">
            <div className="bg-sidebar md:bg-white">
              <div className="mx-auto w-full max-w-screen-xl px-3 lg:px-10 mt-3 md:mt-6 md:py-3">
                <h1 className="text-xl font-semibold leading-7 text-neutral-900 md:text-2xl">
                  Videos
                </h1>
                <div className="flex flex-row-reverse items-center justify-between  gap-4">
                  <AddVideoModal isOpen={false} onClose={() => {}} />
                  <div>
                    <div className="flex items-center gap-2"></div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4 mt-6">
                  {videos.length > 0 ? (
                    videos.map((video) => (
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
                    ))
                  ) : (
                    <p className="text-center text-gray-500">
                      No videos found.
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
