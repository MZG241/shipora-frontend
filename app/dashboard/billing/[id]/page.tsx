"use client";

import Link from "next/link";

import {
  AlertCircle,
  ArrowLeft,
  CalendarDays,
  CircleDollarSign,
  CreditCard,
  FileText,
  Hash,
  Package,
  Receipt,
} from "lucide-react";

import { useParams } from "next/navigation";



import { BillingStatusBadge } from "../components/BillingStatusBadge";
import { useBilling } from "@/app/hooks/useBilling";
import { usePaymentsByBilling } from "@/app/hooks/usePayment";

export default function BillingDetailPage() {
  const params = useParams();

  const id = params.id as string;
  const {
    data: billing,
    isLoading: billingLoading,
    isError: billingError,
  } = useBilling(id);

  const {
    data: payments = [],
    isLoading: paymentsLoading,
  } = usePaymentsByBilling(id);

  if (billingLoading) {
    return <BillingDetailSkeleton />;
  }

  if (billingError || !billing) {
    return (
      <main className="flex min-h-[500px] items-center justify-center p-6">
        <div className="flex max-w-md flex-col items-center text-center">
          <div className="rounded-full bg-red-50 p-3">
            <AlertCircle className="h-6 w-6 text-red-500" />
          </div>

          <h2 className="mt-4 text-sm font-semibold text-zinc-900">
            Facturation introuvable
          </h2>

          <p className="mt-1 text-sm text-zinc-500">
            Cette facturation n'existe pas ou vous
            n'avez pas accès à cette ressource.
          </p>

          <Link
            href="/dashboard/billing"
            className="mt-5 inline-flex cursor-pointer items-center gap-2 rounded-lg bg-zinc-950 px-4 py-2 text-sm font-medium text-white transition hover:bg-zinc-800"
          >
            <ArrowLeft className="h-4 w-4" />
            Retour aux facturations
          </Link>
        </div>
      </main>
    );
  }

  const totalAmount = Number(billing.amount);

  const paidAmount = payments.reduce(
    (total, payment) => {
      if (payment.status !== "COMPLETED") {
        return total;
      }

      return total + Number(payment.amount);
    },
    0,
  );

  const remainingAmount = Math.max(
    totalAmount - paidAmount,
    0,
  );

  return (
    <main className="space-y-6 p-6">
      {/* Header */}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3">
          <Link
            href="/dashboard/billing"
            className="mt-1 cursor-pointer rounded-lg border border-zinc-200 p-2 text-zinc-500 transition hover:bg-zinc-50 hover:text-zinc-900"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>

          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-semibold tracking-tight text-zinc-950">
                {billing.invoiceNumber ??
                  "Facture"}
              </h1>

              <BillingStatusBadge
                status={billing.status}
              />
            </div>

            <p className="mt-1 text-sm text-zinc-500">
              Détails de la facturation
            </p>
          </div>
        </div>

        {billing.invoiceUrl && (
          <a
            href={billing.invoiceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-zinc-200 bg-white px-4 py-2 text-sm font-medium text-zinc-700 transition hover:bg-zinc-50"
          >
            <FileText className="h-4 w-4" />
            Voir la facture
          </a>
        )}
      </div>

      {/* Summary */}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <SummaryCard
          title="Montant total"
          value={`${totalAmount.toLocaleString(
            "fr-FR",
          )} ${billing.currency}`}
          icon={CircleDollarSign}
        />

        <SummaryCard
          title="Montant payé"
          value={`${paidAmount.toLocaleString(
            "fr-FR",
          )} ${billing.currency}`}
          icon={CreditCard}
        />

        <SummaryCard
          title="Reste à payer"
          value={`${remainingAmount.toLocaleString(
            "fr-FR",
          )} ${billing.currency}`}
          icon={Receipt}
        />

       
      </div>

      {/* Billing information */}

      <section className="rounded-xl border border-zinc-200 bg-white">
        <div className="border-b border-zinc-200 px-6 py-4">
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-zinc-500" />

            <h2 className="font-semibold text-zinc-900">
              Informations de facturation
            </h2>
          </div>
        </div>

        <div className="grid gap-6 p-6 sm:grid-cols-2 lg:grid-cols-3">
          <InfoItem
            label="Numéro de facture"
            value={
              billing.invoiceNumber ??
              "Non disponible"
            }
            icon={Hash}
          />

          <InfoItem
            label="Tracking number"
            value={billing.trackingNumber}
            icon={Package}
          />

          <InfoItem
            label="Montant"
            value={`${totalAmount.toLocaleString(
              "fr-FR",
            )} ${billing.currency}`}
            icon={CircleDollarSign}
          />

          <InfoItem
            label="Statut"
            value={
              <BillingStatusBadge
                status={billing.status}
              />
            }
            icon={Receipt}
          />

          <InfoItem
            label="Créée le"
            value={formatDate(
              billing.createdAt,
            )}
            icon={CalendarDays}
          />

          <InfoItem
            label="Dernière mise à jour"
            value={formatDate(
              billing.updatedAt,
            )}
            icon={CalendarDays}
          />
        </div>
      </section>

      {/* Payments */}

      <section className="overflow-hidden rounded-xl border border-zinc-200 bg-white">
        <div className="flex items-center justify-between border-b border-zinc-200 px-6 py-4">
          <div className="flex items-center gap-2">
            <CreditCard className="h-5 w-5 text-zinc-500" />

            <h2 className="font-semibold text-zinc-900">
              Paiements
            </h2>

            <span className="rounded-full bg-zinc-100 px-2.5 py-1 text-xs font-medium text-zinc-600">
              {payments.length}
            </span>
          </div>
        </div>

        {paymentsLoading ? (
          <PaymentsSkeleton />
        ) : payments.length === 0 ? (
          <div className="flex min-h-[220px] flex-col items-center justify-center px-6 text-center">
            <div className="rounded-full bg-zinc-100 p-4">
              <CreditCard className="h-6 w-6 text-zinc-500" />
            </div>

            <h3 className="mt-4 text-sm font-semibold text-zinc-900">
              Aucun paiement
            </h3>

            <p className="mt-1 text-sm text-zinc-500">
              Aucun paiement n'a encore été
              enregistré pour cette facture.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px]">
              <thead>
                <tr className="border-b border-zinc-200 bg-zinc-50/70">
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wide text-zinc-500">
                    Référence
                  </th>

                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wide text-zinc-500">
                    Montant
                  </th>

                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wide text-zinc-500">
                    Méthode
                  </th>

                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wide text-zinc-500">
                    Statut
                  </th>

                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wide text-zinc-500">
                    Date
                  </th>
                </tr>
              </thead>

              <tbody>
                {payments.map((payment) => (
                  <tr
                    key={payment.id}
                    className="border-b border-zinc-100 last:border-0"
                  >
                    <td className="px-6 py-4">
                      <span className="font-mono text-xs font-medium text-zinc-700">
                        {payment.reference ??
                          "Sans référence"}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      <span className="font-medium text-zinc-900">
                        {Number(
                          payment.amount,
                        ).toLocaleString(
                          "fr-FR",
                        )}{" "}
                        {payment.currency}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      <span className="text-sm text-zinc-600">
                        {formatPaymentMethod(
                          payment.method,
                        )}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      <PaymentStatusBadge
                        status={payment.status}
                      />
                    </td>

                    <td className="px-6 py-4">
                      <span className="text-sm text-zinc-500">
                        {payment.paidAt
                          ? formatDate(
                              payment.paidAt,
                            )
                          : formatDate(
                              payment.createdAt,
                            )}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </main>
  );
}

function SummaryCard({
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
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-sm text-zinc-500">
            {title}
          </p>

          <p className="mt-2 truncate text-xl font-semibold text-zinc-950">
            {value}
          </p>
        </div>

        <div className="shrink-0 rounded-lg bg-zinc-100 p-2.5">
          <Icon className="h-5 w-5 text-zinc-600" />
        </div>
      </div>
    </div>
  );
}

function InfoItem({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: React.ReactNode;
  icon: React.ComponentType<{
    className?: string;
  }>;
}) {
  return (
    <div>
      <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-zinc-400">
        <Icon className="h-3.5 w-3.5" />
        {label}
      </div>

      <div className="mt-2 text-sm font-medium text-zinc-900">
        {value}
      </div>
    </div>
  );
}

function PaymentStatusBadge({
  status,
}: {
  status:
    | "PENDING"
    | "COMPLETED"
    | "FAILED"
    | "REFUNDED";
}) {
  const config = {
    PENDING: {
      label: "En attente",
      className:
        "bg-amber-50 text-amber-700 border-amber-200",
    },

    COMPLETED: {
      label: "Complété",
      className:
        "bg-emerald-50 text-emerald-700 border-emerald-200",
    },

    FAILED: {
      label: "Échoué",
      className:
        "bg-red-50 text-red-700 border-red-200",
    },

    REFUNDED: {
      label: "Remboursé",
      className:
        "bg-purple-50 text-purple-700 border-purple-200",
    },
  } as const;

  const current = config[status];

  return (
    <span
      className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-medium ${current.className}`}
    >
      {current.label}
    </span>
  );
}

function formatPaymentMethod(
  method:
    | "CASH"
    | "BANK_TRANSFER"
    | "MOBILE_MONEY"
    | "CARD",
) {
  const methods = {
    CASH: "Espèces",
    BANK_TRANSFER: "Virement bancaire",
    MOBILE_MONEY: "Mobile Money",
    CARD: "Carte bancaire",
  };

  return methods[method];
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString(
    "fr-FR",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
    },
  );
}

function BillingDetailSkeleton() {
  return (
    <main className="space-y-6 p-6">
      <div className="space-y-2">
        <div className="h-7 w-52 animate-pulse rounded-md bg-zinc-200" />
        <div className="h-4 w-64 animate-pulse rounded-md bg-zinc-100" />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map(
          (_, index) => (
            <div
              key={index}
              className="rounded-xl border border-zinc-200 bg-white p-5"
            >
              <div className="h-4 w-24 animate-pulse rounded bg-zinc-200" />

              <div className="mt-3 h-6 w-32 animate-pulse rounded bg-zinc-100" />
            </div>
          ),
        )}
      </div>

      <div className="rounded-xl border border-zinc-200 bg-white">
        <div className="border-b border-zinc-200 px-6 py-4">
          <div className="h-5 w-48 animate-pulse rounded bg-zinc-200" />
        </div>

        <div className="grid gap-6 p-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map(
            (_, index) => (
              <div
                key={index}
                className="space-y-2"
              >
                <div className="h-3 w-24 animate-pulse rounded bg-zinc-100" />
                <div className="h-4 w-36 animate-pulse rounded bg-zinc-200" />
              </div>
            ),
          )}
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white">
        <div className="border-b border-zinc-200 px-6 py-4">
          <div className="h-5 w-32 animate-pulse rounded bg-zinc-200" />
        </div>

        {Array.from({ length: 4 }).map(
          (_, index) => (
            <div
              key={index}
              className="flex gap-6 border-b border-zinc-100 px-6 py-5"
            >
              <div className="h-4 w-32 animate-pulse rounded bg-zinc-100" />
              <div className="h-4 w-24 animate-pulse rounded bg-zinc-100" />
              <div className="h-4 w-28 animate-pulse rounded bg-zinc-100" />
            </div>
          ),
        )}
      </div>
    </main>
  );
}

function PaymentsSkeleton() {
  return (
    <div>
      {Array.from({ length: 3 }).map(
        (_, index) => (
          <div
            key={index}
            className="flex gap-6 border-b border-zinc-100 px-6 py-5"
          >
            <div className="h-4 w-32 animate-pulse rounded bg-zinc-100" />
            <div className="h-4 w-24 animate-pulse rounded bg-zinc-100" />
            <div className="h-4 w-28 animate-pulse rounded bg-zinc-100" />
            <div className="h-6 w-20 animate-pulse rounded-full bg-zinc-100" />
          </div>
        ),
      )}
    </div>
  );
}