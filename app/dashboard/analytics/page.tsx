"use client";
import { AppSidebar } from "@/components/dashboard/app-sidebar";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { AreaChart, Area, CartesianGrid, XAxis } from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

const chartConfig = {
  clicks: {
    label: "Clicks",
    color: "#0082ce",
  },
} satisfies ChartConfig;

const profileClicksData = [
  { date: "2024-01-01", clicks: 1 },
  { date: "2024-01-02", clicks: 0 },
  { date: "2024-01-03", clicks: 3 },
  { date: "2024-01-04", clicks: 4 },
  { date: "2024-01-05", clicks: 5 },
  { date: "2024-01-06", clicks: 6 },
  { date: "2024-01-07", clicks: 7 },
  { date: "2024-01-08", clicks: 8 },
  { date: "2024-01-09", clicks: 9 },
  { date: "2024-01-10", clicks: 10 },
];

const AnalyticsPage = () => {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="bg-sidebar md:pt-1.5">
        <div className="relative min-h-full bg-sidebar pt-px md:rounded-tl-2xl md:border md:border-b-0 md:border-r-0 md:border-neutral-200/80 md:bg-white">
          <div className="bg-sidebar md:bg-white">
            <div className="mx-auto w-full max-w-screen-xl px-3 lg:px-10 mt-3 md:mt-6 md:py-3">
              <h1 className="text-xl font-semibold leading-7 text-neutral-900 md:text-2xl">
                Analytics
              </h1>
              <div className="mt-6">
                <Card className="w-full h-[500px]">
                  <CardHeader>
                    <CardTitle>Profile Clicks</CardTitle>
                    <CardDescription>
                      Number of clicks on your profile over time
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ChartContainer
                      config={chartConfig}
                      className="h-[350px] w-full"
                    >
                      <AreaChart
                        accessibilityLayer
                        height={350}
                        data={profileClicksData}
                        margin={{
                          left: 12,
                          right: 12,
                        }}
                      >
                        <CartesianGrid vertical={false} />
                        <XAxis
                          dataKey="date"
                          tickLine={false}
                          axisLine={false}
                          tickMargin={8}
                          tickFormatter={(value) => value.slice(0, 3)}
                        />
                        <ChartTooltip
                          cursor={false}
                          content={<ChartTooltipContent />}
                        />
                        <defs>
                          <linearGradient
                            id="fillClicks"
                            x1="0"
                            y1="0"
                            x2="0"
                            y2="1"
                          >
                            <stop
                              offset="5%"
                              stopColor="var(--color-clicks)"
                              stopOpacity={0.8}
                            />
                            <stop
                              offset="95%"
                              stopColor="var(--color-clicks)"
                              stopOpacity={0.1}
                            />
                          </linearGradient>
                        </defs>
                        <Area
                          dataKey="clicks"
                          type="natural"
                          fill="url(#fillClicks)"
                          fillOpacity={0.4}
                          stroke="var(--color-clicks)"
                          stackId="a"
                        />
                      </AreaChart>
                    </ChartContainer>
                  </CardContent>
                </Card>
                <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card className="bg-white shadow rounded-lg p-6">
                    <CardHeader>
                      <CardTitle>Top 10 Performing Products</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {/* <HorizontalBarChart data={topProductsData} /> */}
                    </CardContent>
                  </Card>
                  <Card className="bg-white shadow rounded-lg p-6">
                    <CardHeader>
                      <CardTitle>Top Performing Videos</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {/* <HorizontalBarChart data={topVideosData} /> */}
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default AnalyticsPage;
