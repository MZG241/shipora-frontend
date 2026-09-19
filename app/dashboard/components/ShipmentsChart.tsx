"use client";

import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { useShipmentsOverTime } from "@/app/hooks/useDashboard";

export function ShipmentsChart() {
  const {
    data,
    isLoading,
  } = useShipmentsOverTime();

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-5">
      <div className="mb-6">
        <h2 className="text-base font-semibold text-slate-950">
          Évolution des expéditions
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Nombre d’expéditions au cours des 12 derniers mois
        </p>
      </div>

      <div className="h-[300px] w-full">
        {isLoading ? (
          <div className="h-full w-full animate-pulse rounded-lg bg-slate-50" />
        ) : (
          <ResponsiveContainer
            width="100%"
            height="100%"
          >
            <LineChart
              data={data ?? []}
              margin={{
                top: 5,
                right: 5,
                left: -20,
                bottom: 5,
              }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="#E2E8F0"
              />

              <XAxis
                dataKey="month"
                axisLine={false}
                tickLine={false}
                tick={{
                  fontSize: 12,
                  fill: "#94A3B8",
                }}
              />

              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{
                  fontSize: 12,
                  fill: "#94A3B8",
                }}
              />

              <Tooltip />

              <Line
                type="monotone"
                dataKey="count"
                stroke="#1677FF"
                strokeWidth={2.5}
                dot={false}
                activeDot={{
                  r: 5,
                }}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}