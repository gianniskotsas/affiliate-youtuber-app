import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { AreaChart, Area, CartesianGrid, XAxis, YAxis } from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import Image from "next/image";
import { Check, ChevronsUpDown, MousePointerClick } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const chartConfig = {
  clicks: {
    label: "Clicks",
    color: "#0082ce",
    icon: MousePointerClick,
  },
} satisfies ChartConfig;

interface ClickData {
  start: string;
  clicks: number;
}

interface LinkData {
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

const ClicksGraph = ({ userId }: { userId: string }) => {
  const [clicksData, setClicksData] = useState<ClickData[]>([]);
  const [clicksCount, setClicksCount] = useState<number>(0);
  const [timeRange, setTimeRange] = useState("24h");
  const [links, setLinks] = useState<LinkData[]>([]);
  const [selectedLink, setSelectedLink] = useState<LinkData | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/dub/clicks", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userId, interval: timeRange, device: "", linkId: selectedLink?.id }),
        });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log(data);
        const filteredData = data.result.map(
          ({ start, clicks }: { start: string; clicks: string }) => ({
            start,
            clicks: parseInt(clicks),
          })
        );
        setClicksData(filteredData);
        setClicksCount(data.resultCount.clicks);

        const responseLinks = await fetch("/api/dub/linkList", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userId }),
        });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const dataLinks = await responseLinks.json();

        setLinks(dataLinks.resultLinks);
      } catch (error) {
        console.error("Error fetching click analytics data:", error);
      }
    };

    fetchData();
  }, [userId, timeRange, selectedLink]);

  return (
    <Card className="w-full min-h-[350px]">
      <CardHeader className="flex w-full justify-between items-center gap-2 space-y-0 py-5 sm:flex-row">
        <div className="flex flex-col sm:flex-row gap-4 text-center items-center justify-center sm:text-left ">
          <div className="border-4 border-[#0082ce]/40 rounded-full font-semibold flex flex-row gap-1 p-2 size-10 items-center justify-center">
            {clicksCount}
          </div>
          <div className="flex flex-col gap-1">
            <CardTitle>Profile Clicks</CardTitle>
            <CardDescription>
              Number of clicks on your profile over time
            </CardDescription>
          </div>
        </div>

        {/* Time range selector */}
        <div className="flex flex-row gap-2">
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
                              selectedLink?.shortLink.replace(/^https:\/\//, "")
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
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[350px] w-full">
          <AreaChart
            accessibilityLayer
            height={450}
            data={clicksData}
            margin={{
              top: 16,
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="start"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => {
                return new Date(value).toLocaleString(
                  "en-US",
                  timeRange === "24h"
                    ? {
                        hour: "2-digit",
                        minute: "2-digit",
                      }
                    : {
                        day: "2-digit",
                        month: "short",
                      }
                );
              }}
            />
            <ChartTooltip
              cursor={true}
              content={
                <ChartTooltipContent
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    });
                  }}
                  indicator="dot"
                />
              }
            />
            <defs>
              <linearGradient id="fillClicks" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#0082ce" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#0082ce" stopOpacity={0.1} />
              </linearGradient>
            </defs>
            <Area
              dataKey="clicks"
              type="monotone"
              fill="url(#fillClicks)"
              fillOpacity={0.4}
              stroke="#0082ce"
              stackId="a"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default ClicksGraph;
