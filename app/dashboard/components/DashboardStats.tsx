"use client";

import {
  ArrowUpRight,
  Package,
  Truck,
  MapPin,
  Wallet
} from "lucide-react";

import { useDashboardOverview } from "@/app/hooks/useDashboard";

function formatCurrency(
  amount: number,
) {
  return new Intl.NumberFormat(
    "fr-FR",
    {
      style: "currency",
      currency: "XAF",
      maximumFractionDigits: 0,
    },
  ).format(amount);
}

function StatSkeleton() {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-5">
      <div className="animate-pulse">
        <div className="h-4 w-24 rounded bg-slate-200" />

        <div className="mt-3 h-8 w-28 rounded bg-slate-200" />

        <div className="mt-4 h-3 w-32 rounded bg-slate-100" />
      </div>
    </div>
  );
}

export function DashboardStats() {
  const {
    data,
    isLoading,
    isError,
  } = useDashboardOverview();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {Array.from({ length: 5 }).map(
          (_, index) => (
            <StatSkeleton key={index} />
          ),
        )}
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-600">
        Impossible de charger les statistiques.
      </div>
    );
  }

  const stats = [
    {
      label: "Expéditions",
      value: data.shipments,
      description: "Total des expéditions",
      icon: Truck,
      iconClass:
        "bg-blue-50 text-blue-600",
    },
    {
      label: "Colis",
      value: data.packages,
      description: "Total des colis",
      icon: Package,
      iconClass:
        "bg-violet-50 text-violet-600",
    },
    {
      label: "En transit",
      value: data.inTransit,
      description: "Expéditions en cours",
      icon: ArrowUpRight,
      iconClass:
        "bg-amber-50 text-amber-600",
    },
    {
      label: "À récupérer",
      value: data.readyForPickup,
      description: "Prêts pour retrait",
      icon: MapPin,
      iconClass:
        "bg-emerald-50 text-emerald-600",
    },
    {
      label: "Revenus",
      value: formatCurrency(data.revenue),
      description: "Revenus générés",
      icon: Wallet,
      iconClass:
        "bg-blue-50 text-[#1677FF]",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
      {stats.map((stat) => {
        const Icon = stat.icon;

        return (
          <div
            key={stat.label}
            className="rounded-lg border border-slate-200 bg-white p-5 transition hover:border-slate-300"
          >
            <div className="flex items-start justify-between">
              <div className="min-w-0">
                <p className="text-sm font-medium text-slate-500">
                  {stat.label}
                </p>

                <p className="mt-2 truncate text-2xl font-bold tracking-tight text-slate-950">
                  {stat.value}
                </p>
              </div>

              <div
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${stat.iconClass}`}
              >
                <Icon className="h-5 w-5" />
              </div>
            </div>

            <p className="mt-4 text-xs text-slate-400">
              {stat.description}
            </p>
          </div>
        );
      })}
    </div>
  );
}