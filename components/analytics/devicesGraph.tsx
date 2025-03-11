"use client";

import React from "react";
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
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ChartConfig, ChartContainer } from "@/components/ui/chart";
import { DeviceData } from "@/app/dashboard/analytics/page";

const chartConfig = {
  clicks: {
    label: "Clicks",
    color: "#0082ce",
  },
  label: {
    color: "hsl(var(--background))",
  },
} satisfies ChartConfig;

const DevicesGraph = ({
  devicesData,
  timeRange,
}: {
  devicesData: DeviceData[];
  timeRange: string;
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Device Clicks</CardTitle>
        <CardDescription>
          Clicks from different devices in the last {timeRange}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart
            accessibilityLayer
            data={devicesData}
            layout="vertical"
            margin={{
              left: 5,
              right: 45,
            }}
            className="h-fit justify-start"
            barGap={0}
            compact={true}
          >
            <XAxis dataKey="clicks" type="number" hide />
            <YAxis dataKey="device" type="category" hide />
            <Bar
              dataKey="clicks"
              layout="vertical"
              fill="#0082ce"
              radius={12}
              barSize={35}
              style={{ opacity: 0.4 }}
            >
              <LabelList
                dataKey="device"
                position="insideLeft"
                offset={8}
                className="fill-[#000000]"
                fontSize={14}
              />
              <LabelList
                dataKey="clicks"
                position="right"
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

export default DevicesGraph;
