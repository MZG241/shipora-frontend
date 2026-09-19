"use client";

import { useAuth } from "@/app/context/AuthContext";
import { DashboardStats } from "./components/DashboardStats";
import { ShipmentsChart } from "./components/ShipmentsChart";
import { ShipmentStatusChart } from "./components/ShipmentStatusChart";
import { RevenueChart } from "./components/RevenueChart";

export default function DashboardPage() {
  const { user } = useAuth();

  return (
    <div className="space-y-8">
      {/* Welcome */}
      <section>
        <p className="text-sm font-medium text-[#1677FF]">
          Tableau de bord
        </p>

        <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">
          Bienvenue, {user?.name} 👋
        </h1>

        <p className="mt-2 text-sm text-slate-500 sm:text-base">
          Voici un aperçu de l’activité de votre organisation.
        </p>
      </section>

      {/* Statistics */}
      <DashboardStats />

      {/* Main charts */}
      <section className="grid grid-cols-1 gap-5 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <ShipmentsChart />
        </div>

        <div className="xl:col-span-1">
          <ShipmentStatusChart />
        </div>
      </section>

      {/* Revenue */}
      <section>
        <RevenueChart />
      </section>
    </div>
  );
}