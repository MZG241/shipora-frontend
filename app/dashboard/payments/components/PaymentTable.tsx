"use client";

import Link from "next/link";

import {
  ArrowRight,
  CreditCard,
  Pencil,
  Search,
  X,
} from "lucide-react";

import { useMemo, useState } from "react";

import type {
  Payment,
  PaymentMethod,
  PaymentStatus,
} from "@/app/types/payment.type";

type Props = {
  payments: Payment[];
  onEdit: (payment: Payment) => void;
  onDelete: (payment: Payment) => void;
};

export function PaymentTable({
  payments,
  onEdit,
  onDelete,
}: Props) {
  const [search, setSearch] =
    useState("");

  const filteredPayments = useMemo(() => {
    const query = search
      .trim()
      .toLowerCase();

    if (!query) {
      return payments;
    }

    return payments.filter((payment) => {
      return (
        payment.reference
          ?.toLowerCase()
          .includes(query) ||
        payment.billingId
          .toLowerCase()
          .includes(query) ||
        formatPaymentMethod(
          payment.method,
        )
          .toLowerCase()
          .includes(query)
      );
    });
  }, [payments, search]);

  return (
    <div className="overflow-hidden">
      {/* Search */}

      <div className="border-b border-zinc-200 p-4">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />

          <input
            type="text"
            value={search}
            onChange={(event) =>
              setSearch(event.target.value)
            }
            placeholder="Rechercher un paiement..."
            className="h-10 w-full rounded-lg border border-zinc-200 bg-white pl-9 pr-9 text-sm text-zinc-900 outline-none transition placeholder:text-zinc-400 focus:border-zinc-400 focus:ring-2 focus:ring-zinc-100"
          />

          {search && (
            <button
              type="button"
              onClick={() => setSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 transition hover:text-zinc-700"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      {/* Empty state */}

      {payments.length === 0 && (
        <EmptyState
          title="Aucun paiement"
          description="Aucun paiement n'a encore été enregistré."
        />
      )}

      {payments.length > 0 &&
        filteredPayments.length === 0 && (
          <EmptyState
            title="Aucun résultat"
            description={`Aucun paiement ne correspond à "${search}".`}
          />
        )}

      {/* Table */}

      {filteredPayments.length > 0 && (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1000px]">
            <thead>
              <tr className="border-b border-zinc-200 bg-zinc-50/70">
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wide text-zinc-500">
                  Référence
                </th>

                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wide text-zinc-500">
                  Facturation
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

                <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wide text-zinc-500">
                  Action
                </th>
              </tr>
            </thead>

            <tbody>
              {filteredPayments.map(
                (payment) => (
                  <tr
                    key={payment.id}
                    className="border-b border-zinc-100 last:border-0 hover:bg-zinc-50/50"
                  >
                    {/* Reference */}

                    <td className="px-6 py-4">
                      <div>
                        <p className="font-mono text-xs font-medium text-zinc-900">
                          {payment.reference ??
                            "Sans référence"}
                        </p>

                        <p className="mt-1 text-xs text-zinc-500">
                          {formatDate(
                            payment.createdAt,
                          )}
                        </p>
                      </div>
                    </td>

                    {/* Billing */}

                    <td className="px-6 py-4">
                      <Link
                        href={`/dashboard/billing/${payment.billingId}`}
                        className="inline-flex items-center cursor-pointer gap-1.5 rounded-md bg-zinc-100 px-2 py-1 font-mono text-xs font-medium text-zinc-700 transition hover:bg-zinc-200"
                      >
                        {payment.invoiceNumber}
                      </Link>
                    </td>

                    {/* Amount */}

                    <td className="px-6 py-4">
                      <p className="font-medium text-zinc-900">
                        {Number(
                          payment.amount,
                        ).toLocaleString(
                          "fr-FR",
                        )}{" "}
                        {payment.currency}
                      </p>
                    </td>

                    {/* Method */}

                    <td className="px-6 py-4">
                      <span className="text-sm text-zinc-600">
                        {formatPaymentMethod(
                          payment.method,
                        )}
                      </span>
                    </td>

                    {/* Status */}

                    <td className="px-6 py-4">
                      <PaymentStatusBadge
                        status={payment.status}
                      />
                    </td>

                    {/* Date */}

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

                    {/* Action */}

                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-1">
                        <Link href={`/dashboard/payment/${payment.id}`} className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-200 px-3 py-2 text-sm font-medium text-zinc-700 transition hover:bg-zinc-50">
                          Voir <ArrowRight className="h-4 w-4" />
                        </Link>
                        <button type="button" onClick={() => onEdit(payment)} title="Modifier" className="rounded-lg p-2 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-700"><Pencil className="h-4 w-4" /></button>
                        <button type="button" onClick={() => onDelete(payment)} title="Supprimer" className="rounded-lg p-2 text-zinc-400 hover:bg-red-50 hover:text-red-600"><X className="h-4 w-4" /></button>
                      </div>
                    </td>
                  </tr>
                ),
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function PaymentStatusBadge({
  status,
}: {
  status: PaymentStatus;
}) {
  const config: Record<
    PaymentStatus,
    {
      label: string;
      className: string;
    }
  > = {
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
  };

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
  method: PaymentMethod,
) {
  const methods: Record<
    PaymentMethod,
    string
  > = {
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

function EmptyState({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="flex min-h-[280px] flex-col items-center justify-center px-6 text-center">
      <div className="rounded-full bg-zinc-100 p-4">
        <CreditCard className="h-6 w-6 text-zinc-500" />
      </div>

      <h3 className="mt-4 text-sm font-semibold text-zinc-900">
        {title}
      </h3>

      <p className="mt-1 max-w-sm text-sm text-zinc-500">
        {description}
      </p>
    </div>
  );
}