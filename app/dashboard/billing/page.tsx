"use client";

import {
  AlertCircle,
  CheckCircle2,
  CircleDollarSign,
  Clock3,
  FileText,
  Loader2,
  Receipt,
} from "lucide-react";


import { useBillings } from "@/app/hooks/useBilling";
import { BillingTable } from "./components/BillingTable";
import { DeleteBillingModal } from "./components/DeleteBillingModal";
import type { Billing } from "@/app/types/billing.type";
import { useState } from "react";

export default function BillingPage() {
  const [billingToDelete, setBillingToDelete] = useState<Billing | null>(null);
  const { data: billings = [], isLoading, isError } =
    useBillings();

  const totalAmount = billings.reduce(
    (total, billing) =>
      total + Number(billing.amount),
    0,
  );

  const paidBillings = billings.filter(
    (billing) => billing.status === "PAID",
  );

  const pendingBillings = billings.filter(
    (billing) => billing.status === "PENDING",
  );

  const partiallyPaidBillings = billings.filter(
    (billing) =>
      billing.status === "PARTIALLY_PAID",
  );

  if (isLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-zinc-500" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center gap-2 text-center">
        <AlertCircle className="h-8 w-8 text-red-500" />

        <h2 className="text-sm font-semibold text-zinc-900">
          Impossible de charger les facturations
        </h2>

        <p className="text-sm text-zinc-500">
          Une erreur est survenue lors du chargement
          des données.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      {/* HEADER */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-zinc-950">
            Billing
          </h1>

          <p className="mt-1 text-sm text-zinc-500">
            Gérez les facturations et les paiements
            de vos expéditions.
          </p>
        </div>
      </div>

      {/* STATS */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Total facturé"
          value={`${totalAmount.toLocaleString()} XAF`}
          icon={CircleDollarSign}
        />

        <StatCard
          title="Payées"
          value={paidBillings.length.toString()}
          icon={CheckCircle2}
        />

        <StatCard
          title="Partiellement payées"
          value={partiallyPaidBillings.length.toString()}
          icon={Receipt}
        />

        <StatCard
          title="En attente"
          value={pendingBillings.length.toString()}
          icon={Clock3}
        />
      </div>

      {/* TABLE */}
      <div className="rounded-xl border border-zinc-200 bg-white">
        <div className="border-b border-zinc-200 px-6 py-4">
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-zinc-500" />

            <h2 className="font-semibold text-zinc-900">
              Facturations
            </h2>

            <span className="rounded-full bg-zinc-100 px-2.5 py-1 text-xs font-medium text-zinc-600">
              {billings.length}
            </span>
          </div>
        </div>

        <BillingTable billings={billings} onDelete={setBillingToDelete} />
      </div>
      <DeleteBillingModal billing={billingToDelete} onClose={() => setBillingToDelete(null)} />
    </div>
  );
}

function StatCard({
  title,
  value,
  icon: Icon,
}: {
  title: string;
  value: string;
  icon: React.ComponentType<{
    className?: string;
  }>;
}) {
  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-zinc-500">
            {title}
          </p>

          <p className="mt-2 text-xl font-semibold text-zinc-950">
            {value}
          </p>
        </div>

        <div className="rounded-lg bg-zinc-100 p-2.5">
          <Icon className="h-5 w-5 text-zinc-600" />
        </div>
      </div>
    </div>
  );
}