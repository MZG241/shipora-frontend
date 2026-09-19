"use client";

import {
  AlertCircle,
  CheckCircle2,
  CircleDollarSign,
  CreditCard,
  FileText,
  XCircle,
  Plus,
} from "lucide-react";



import { PaymentSkeleton } from "./components/PaymentSkeleton";
import { PaymentTable } from "./components/PaymentTable";
import { usePayments } from "@/app/hooks/usePayment";
import type { Payment } from "@/app/types/payment.type";
import { PaymentFormDrawer } from "./components/PaymentFormDrawer";
import { DeletePaymentModal } from "./components/DeletePaymentModal";
import { useState } from "react";

export default function PaymentPage() {
  const [formOpen, setFormOpen] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const [paymentToDelete, setPaymentToDelete] = useState<Payment | null>(null);
  const {
    data: payments = [],
    isLoading,
    isError,
  } = usePayments();

  if (isLoading) {
    return (
      <main className="p-6">
        <PaymentSkeleton />
      </main>
    );
  }

  if (isError) {
    return (
      <main className="flex min-h-[400px] items-center justify-center p-6">
        <div className="flex max-w-md flex-col items-center text-center">
          <div className="rounded-full bg-red-50 p-3">
            <AlertCircle className="h-6 w-6 text-red-500" />
          </div>

          <h2 className="mt-4 text-sm font-semibold text-zinc-900">
            Impossible de charger les paiements
          </h2>

          <p className="mt-1 text-sm text-zinc-500">
            Une erreur est survenue lors du
            chargement des données.
          </p>
        </div>
      </main>
    );
  }

  const totalAmount = payments.reduce(
    (total, payment) =>
      total + Number(payment.amount),
    0,
  );

  const completedPayments = payments.filter(
    (payment) =>
      payment.status === "COMPLETED",
  ).length;

  const pendingPayments = payments.filter(
    (payment) =>
      payment.status === "PENDING",
  ).length;

  const failedPayments = payments.filter(
    (payment) =>
      payment.status === "FAILED",
  ).length;

  return (
    <main className="space-y-6 p-6">
      {/* Header */}

      <div className="flex items-start justify-between gap-4">
        <div>
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-950">
          Payments
        </h1>

        <p className="mt-1 text-sm text-zinc-500">
          Gérez les paiements de vos facturations.
        </p>
        </div>
        <button type="button" onClick={() => { setSelectedPayment(null); setFormOpen(true); }} className="inline-flex items-center gap-2 rounded-lg bg-[#1677FF] px-4 py-2.5 text-sm font-medium text-white hover:bg-[#0B5ED7]"><Plus className="h-4 w-4" />Ajouter un paiement</button>
      </div>

      {/* Statistics */}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Total encaissé"
          value={`${totalAmount.toLocaleString(
            "fr-FR",
          )} XAF`}
          icon={CircleDollarSign}
        />

        <StatCard
          title="Paiements complétés"
          value={completedPayments.toString()}
          icon={CheckCircle2}
        />

        <StatCard
          title="En attente"
          value={pendingPayments.toString()}
          icon={CreditCard}
        />

        <StatCard
          title="Échecs"
          value={failedPayments.toString()}
          icon={XCircle}
        />
      </div>

      {/* Payments table */}

      <section className="overflow-hidden rounded-xl border border-zinc-200 bg-white">
        <div className="border-b border-zinc-200 px-6 py-4">
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-zinc-500" />

            <h2 className="font-semibold text-zinc-900">
              Paiements
            </h2>

            <span className="rounded-full bg-zinc-100 px-2.5 py-1 text-xs font-medium text-zinc-600">
              {payments.length}
            </span>
          </div>
        </div>

        <PaymentTable payments={payments} onEdit={(payment) => { setSelectedPayment(payment); setFormOpen(true); }} onDelete={setPaymentToDelete} />
      </section>
      <PaymentFormDrawer open={formOpen} payment={selectedPayment} onClose={() => { setFormOpen(false); setSelectedPayment(null); }} />
      <DeletePaymentModal payment={paymentToDelete} onClose={() => setPaymentToDelete(null)} />
    </main>
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