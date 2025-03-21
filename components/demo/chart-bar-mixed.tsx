"use client";

import * as React from "react";
import { Bar } from "recharts";
import { Card } from "@/components/ui/card";
import {
  ResponsiveContainer,
  ComposedChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Line,
} from "recharts";

const data = [
  { name: "Jan", total: 1200, revenue: 900 },
  { name: "Feb", total: 2100, revenue: 1500 },
  { name: "Mar", total: 1800, revenue: 1200 },
  { name: "Apr", total: 2400, revenue: 2000 },
  { name: "May", total: 1900, revenue: 1600 },
  { name: "Jun", total: 3100, revenue: 2500 },
];

export function ChartBarMixed() {
  return (
    <Card>
      <div className="p-4 md:p-6">
        <div className="text-lg font-semibold">Mixed Bar Chart</div>
        <div className="text-muted-foreground text-sm">
          Revenue vs Total comparison
        </div>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart
              data={data}
              margin={{
                top: 20,
                right: 0,
                left: -10,
                bottom: 0,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="total" fill="#8884d8" name="Total" />
              <Line
                type="monotone"
                dataKey="revenue"
                stroke="#82ca9d"
                name="Revenue"
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>
    </Card>
  );
}
