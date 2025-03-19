"use client";

import { AppSidebar } from "@/components/dashboard/app-sidebar";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import React, { useEffect, useState, useMemo } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import TopLinksGraph from "@/components/analytics/topLinksGraph";
import { Select } from "@/components/ui/select";
import { SelectValue } from "@/components/ui/select";
import { CommandInput, CommandItem } from "@/components/ui/command";
import { CommandGroup } from "@/components/ui/command";
import { Check } from "lucide-react";
import { CommandList } from "@/components/ui/command";
import { Command } from "@/components/ui/command";
import { PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { SelectItem, SelectTrigger } from "@/components/ui/select";
import { SelectContent } from "@/components/ui/select";
import { Popover } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ChevronsUpDown } from "lucide-react";
import Image from "next/image";
import ClicksGraph from "@/components/analytics/clicksGraph";
import DevicesGraph from "@/components/analytics/devicesGraph";
import { useRouter } from "next/navigation";
import { SelectUser } from "@/db/schema";

export interface DeviceData {
  device: string;
  count: number;
}

export interface ClickData {
    start: string;
    clicks: number;
  }
  
  export interface LinkData {
    id: string;
    shortLink: string;
    orginalLink: string;
  }

const FaviconImage = ({ siteUrl }: { siteUrl: string }) => {
  const [src, setSrc] = useState(
    `https://www.google.com/s2/favicons?domain=${new URL(siteUrl).hostname}`
  );

  return (
    <Image
      src={src}
      alt="Favicon"
      width={16}
      height={16}
      onError={() =>
        setSrc(
          "https://glhckkdhdbpinqmzpcqs.supabase.co/storage/v1/object/public/thumbnails/webapp/veevo_logo_circle.png"
        )
      }
    />
  );
};

const AnalyticsPage = ({ userDb }: { userDb: SelectUser }) => {
  const [links, setLinks] = useState<LinkData[]>([]);
  const [clicksData, setClicksData] = useState<ClickData[]>([]);
  const [clicksCount, setClicksCount] = useState<number>(0);
  const [selectedLink, setSelectedLink] = useState<LinkData | null>(null);
  const [timeRange, setTimeRange] = useState("24h");
  const [devices, setDevices] = useState<DeviceData[]>([]);
  const router = useRouter();
  const userId = useMemo(() => userDb?.id || "", [userDb]);

  useEffect(() => {
    if (!userId) return;

    if (!userDb?.stripeSubscriptionStatus) {
      router.push("/dashboard?upgrade=true");
    }
  }, [userId, userDb]);

  useEffect(() => {
    if (!userId) return;

    const fetchData = async () => {
      try {
        const [clicksResponse, linksResponse, devicesResponse] = await Promise.all([
          fetch("/api/dub/clicks", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              userId,
              interval: timeRange,
              device: "",
              linkId: selectedLink?.id,
            }),
          }),
          fetch("/api/dub/linkList", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ userId }),
          }),
          fetch("/api/dub/devices", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ userId, interval: timeRange, linkId: selectedLink?.id }),
          }),
        ]);

        if (!clicksResponse.ok || !linksResponse.ok || !devicesResponse.ok) {
          throw new Error(
            `HTTP error! status: ${clicksResponse.status}, ${linksResponse.status}, ${devicesResponse.status}`
          );
        }

        const data = await clicksResponse.json();
        const dataLinks = await linksResponse.json();
        const dataDevices = await devicesResponse.json();
        console.log(data);
        const filteredData = data.result.map(
          ({ start, clicks }: { start: string; clicks: string }) => ({
            start,
            clicks: parseInt(clicks),
          })
        );
        setClicksData(filteredData);
        setClicksCount(data.resultCount.clicks);
        setLinks(dataLinks.resultLinks);
        setDevices(dataDevices.devices);
      } catch (error) {
        console.error("Error fetching click analytics data:", error);
      }
    };

    fetchData();
  }, [userId, timeRange, selectedLink]);

  if (!userDb) {
    return null;
  }

  if (userDb.stripeSubscriptionStatus) {
    return (
        <SidebarProvider>
          <AppSidebar userDb={userDb} />
          <SidebarInset className="bg-sidebar md:pt-1.5">
            <div className="relative min-h-full bg-sidebar pt-px md:rounded-tl-2xl md:border md:border-b-0 md:border-r-0 md:border-neutral-200/80 md:bg-white">
              <div className="bg-sidebar md:bg-white">
                <div className="mx-auto w-full max-w-screen-xl px-3 lg:px-10 mt-3 md:mt-6 md:py-3">
                  <h1 className="text-xl font-semibold leading-7 text-neutral-900 md:text-2xl">
                    Analytics
                  </h1>
                  <div className="mt-6 flex flex-col gap-4">
                    
                    {/* filters */}
                    <div className="flex flex-row gap-2 w-fit">
                      {/* Link selector */}
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            role="combobox"
                            className="rounded-lg sm:ml-auto"
                          >
                            {selectedLink ? (
                              <div className="flex flex-row gap-2 items-center">
                                <FaviconImage siteUrl={selectedLink.orginalLink} />
                                {selectedLink.shortLink.replace(/^https:\/\//, "")}
                              </div>
                            ) : (
                              "Links"
                            )}
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="rounded-xl p-2">
                          <Command>
                            <CommandInput placeholder="Search links..." />
                            <CommandList>
                              <CommandGroup>
                                {links.map((link) => (
                                  <CommandItem
                                    key={link.id}
                                    onSelect={(currentValue) =>
                                      setSelectedLink(
                                        currentValue ===
                                          selectedLink?.shortLink.replace(
                                            /^https:\/\//,
                                            ""
                                          )
                                          ? null
                                          : link
                                      )
                                    }
                                    className="flex flex-row gap-2 items-center justify-between"
                                  >
                                    <div className="flex flex-row gap-2 items-center">
                                      <FaviconImage siteUrl={link.orginalLink} />
                                      {link.shortLink.replace(/^https:\/\//, "")}
                                    </div>
    
                                    <Check
                                      className={cn(
                                        "mr-2 h-4 w-4",
                                        link.shortLink === selectedLink?.shortLink
                                          ? "opacity-100"
                                          : "opacity-0"
                                      )}
                                    />
                                  </CommandItem>
                                ))}
                              </CommandGroup>
                            </CommandList>
                          </Command>
                        </PopoverContent>
                      </Popover>
    
                      {/* Time range selector */}
                      <Select value={timeRange} onValueChange={setTimeRange}>
                        <SelectTrigger
                          className="w-[160px] rounded-lg sm:ml-auto"
                          aria-label="Select a value"
                        >
                          <SelectValue placeholder="Last 24h" />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl">
                          <SelectItem value="24h" className="rounded-lg">
                            Last 24 hours
                          </SelectItem>
                          <SelectItem value="7d" className="rounded-lg">
                            Last 7 days
                          </SelectItem>
                          <SelectItem value="30d" className="rounded-lg">
                            Last 30 days
                          </SelectItem>
                          <SelectItem value="all" className="rounded-lg">
                            All time
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
    
                    <ClicksGraph
                      clicksData={clicksData}
                      clicksCount={clicksCount}
                      timeRange={timeRange}
                    />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
                      <TopLinksGraph userId={userId} timeRange={timeRange}/>
    
                      <DevicesGraph devicesData={devices} timeRange={timeRange}/>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </SidebarInset>
        </SidebarProvider>
      );
  }
};

export default AnalyticsPage;
