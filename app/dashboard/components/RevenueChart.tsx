"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { useRevenue } from "@/app/hooks/useDashboard";

export function RevenueChart() {
  const {
    data,
    isLoading,
  } = useRevenue();

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-5">
      <div className="mb-6">
        <h2 className="text-base font-semibold text-slate-950">
          Revenus
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Évolution des revenus sur les 12 derniers mois
        </p>
      </div>

      <div className="h-[300px]">
        {isLoading ? (
          <div className="h-full animate-pulse rounded-lg bg-slate-50" />
        ) : (
          <ResponsiveContainer
            width="100%"
            height="100%"
          >
            <AreaChart
              data={data ?? []}
              margin={{
                top: 5,
                right: 5,
                left: -20,
                bottom: 5,
              }}
            >
              <defs>
                <linearGradient
                  id="revenueGradient"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop
                    offset="5%"
                    stopColor="#1677FF"
                    stopOpacity={0.18}
                  />

                  <stop
                    offset="95%"
                    stopColor="#1677FF"
                    stopOpacity={0}
                  />
                </linearGradient>
              </defs>

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

              <Area
                type="monotone"
                dataKey="revenue"
                stroke="#1677FF"
                strokeWidth={2}
                fill="url(#revenueGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}