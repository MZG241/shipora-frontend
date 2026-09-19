"use client";

import {
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

import { useShipmentStatus } from "@/app/hooks/useDashboard";

const COLORS = [
  "#1677FF",
  "#F59E0B",
  "#16A34A",
  "#8B5CF6",
  "#EF4444",
];

const STATUS_LABELS: Record<
  string,
  string
> = {
  PENDING: "En attente",
  RECEIVED: "Reçue",
  IN_WAREHOUSE: "En entrepôt",
  IN_TRANSIT: "En transit",
  ARRIVED: "Arrivée",
  CUSTOMS: "Douane",
  READY_FOR_PICKUP: "Prête au retrait",
  PICKED_UP: "Récupérée",
  CANCELLED: "Annulée",
};

export function ShipmentStatusChart() {
  const {
    data,
    isLoading,
  } = useShipmentStatus();

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-5">
      <div className="mb-4">
        <h2 className="text-base font-semibold text-slate-950">
          Statut des expéditions
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Répartition actuelle
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
            <PieChart>
              <Pie
                data={data ?? []}
                dataKey="count"
                nameKey="status"
                cx="50%"
                cy="45%"
                innerRadius={65}
                outerRadius={95}
                paddingAngle={3}
              >
                {(data ?? []).map(
                  (_, index) => (
                    <Cell
                      key={index}
                      fill={
                        COLORS[
                          index %
                            COLORS.length
                        ]
                      }
                    />
                  ),
                )}
              </Pie>

              <Tooltip
                formatter={(
                  value,
                  name,
                ) => [
                  value,
                  STATUS_LABELS[
                    String(name)
                  ] ??
                    String(name),
                ]}
              />
            </PieChart>
          </ResponsiveContainer>
        )}
      </div>

      <div className="mt-2 grid grid-cols-2 gap-3">
        {(data ?? []).map(
          (item, index) => (
            <div
              key={item.status}
              className="flex items-center gap-2"
            >
              <span
                className="h-2.5 w-2.5 rounded-full"
                style={{
                  backgroundColor:
                    COLORS[
                      index %
                        COLORS.length
                    ],
                }}
              />

              <span className="truncate text-xs text-slate-500">
                {STATUS_LABELS[
                  item.status
                ] ?? item.status}
              </span>
            </div>
          ),
        )}
      </div>
    </div>
  );
}