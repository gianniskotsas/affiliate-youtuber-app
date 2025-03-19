import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription
} from "@/components/ui/card";
import { AreaChart, Area, CartesianGrid, XAxis, YAxis } from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import Image from "next/image";
import { MousePointerClick } from "lucide-react";
import { ClickData } from "@/components/dashboard/AnalyticsClient";
const chartConfig = {
  clicks: {
    label: "Clicks",
    color: "#0082ce",
    icon: MousePointerClick,
  },
} satisfies ChartConfig;



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

const ClicksGraph = ({
  clicksData,
  clicksCount,
  timeRange,
}: {
  clicksData: ClickData[];
  clicksCount: number;
  timeRange: string;
}) => {
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
