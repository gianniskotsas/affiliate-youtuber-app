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
import { MousePointerClick } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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

const ClicksGraph = ({ userId }: { userId: string }) => {
  const [clicksData, setClicksData] = useState<ClickData[]>([]);
  const [timeRange, setTimeRange] = useState("24h");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/dub/clicks", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userId, interval: timeRange, device: "" }),
        });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log(data);
        const filteredData = data.map(
          ({ start, clicks }: { start: string; clicks   : string }) => ({
            start,
            clicks: parseInt(clicks),
          })
        );
        setClicksData(filteredData);
        console.log(filteredData);
      } catch (error) {
        console.error("Error fetching click analytics data:", error);
      }
    };

    fetchData();
  }, [userId, timeRange]);

  return (
    <Card className="w-full h-[500px]">
      <CardHeader className="flex items-center gap-2 space-y-0 py-5 sm:flex-row">
      <div className="grid flex-1 gap-1 text-center sm:text-left">
          <CardTitle>Profile Clicks</CardTitle>
          <CardDescription>
            Number of clicks on your profile over time
          </CardDescription>
        </div>
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
      </CardHeader>
      <CardContent>
        {clicksData.length > 0 ? (
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
                  return new Date(value).toLocaleDateString("en-US", {
                    hour: "2-digit",
                    minute: "2-digit",
                  });
                }}
              />
              <ChartTooltip cursor={true} content={<ChartTooltipContent />} />
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
        ) : (
          ""
        )}
      </CardContent>
    </Card>
  );
};

export default ClicksGraph;
