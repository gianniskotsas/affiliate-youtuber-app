"use client";

import React, { useEffect, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  LabelList,
  XAxis,
  YAxis,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { TrendingUp } from "lucide-react";

const chartConfig = {
  clicks: {
    label: "Clicks",
    color: "#0082ce",
  },
  label: {
    color: "hsl(var(--background))",
  },
} satisfies ChartConfig;

interface TopLinkData {
  shortlink: string;
  originalLink: string;
  clicks: number;
}

const TopLinksGraph = ({ userId, timeRange }: { userId: string, timeRange: string }) => {
  const [topLinksData, setTopLinksData] = useState<TopLinkData[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/dub/topLinks", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userId, interval: timeRange }),
        });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setTopLinksData(
          data.topLinks.map((item: any) => ({
            shortlink: item.shortlink,
            originalLink: item.url.replace("https://", "").slice(0, 30) + (item.url.length > 30 ? "..." : ""),
            clicks: item.clicks,
          }))
        );
      } catch (error) {
        console.error("Error fetching top links data:", error);
      }
    };

    fetchData();
  }, [userId, timeRange]);

  console.log(topLinksData);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Top Links</CardTitle>
        <CardDescription>
          Top clicked links in the last {timeRange}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart
            accessibilityLayer
            data={topLinksData}
            layout="vertical"
            margin={{
              left: -35,
            }}
          >
            <YAxis
              dataKey="clicks"
              type="category"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
            />
            <XAxis dataKey="clicks" type="number" hide />    
            <Bar
              dataKey="clicks"
              layout="vertical"
              fill="#0082ce"
              radius={12}
              barSize={35}
              style={{ opacity: 0.4 }}
            >
              <LabelList
                dataKey="originalLink"
                position="insideLeft"
                offset={8}
                className="fill-[#000000]"
                fontSize={14}
              />
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default TopLinksGraph;
