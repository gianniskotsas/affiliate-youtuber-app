"use client";
import { AppSidebar } from "@/components/dashboard/app-sidebar";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import React, { useEffect, useState } from "react";
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
import { useUserDb } from "@/context/UserDbContext";
import ClicksGraph from "@/components/analytics/clicksGraph";
const chartConfig = {
  clicks: {
    label: "Clicks",
    color: "#0082ce",
  },
} satisfies ChartConfig;

const AnalyticsPage = () => {
  const [profileClicksData, setProfileClicksData] = useState([]);

  const { userDb } = useUserDb();

  if (!userDb) {
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
                Analytics
              </h1>
              <div className="mt-6">
                <ClicksGraph userId={userDb?.id || ""} />
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
