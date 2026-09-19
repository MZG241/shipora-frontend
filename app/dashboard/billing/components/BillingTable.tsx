"use client";

import {
  ArrowRight,
  FileText,
  Trash2,
  Search,
  X,
} from "lucide-react";

import Link from "next/link";

import {
  useMemo,
  useState,
} from "react";

import type { Billing } from "@/app/types/billing.type";

import { BillingStatusBadge } from "./BillingStatusBadge";

type Props = {
  billings: Billing[];
  onDelete: (billing: Billing) => void;
};

export function BillingTable({
  billings,
  onDelete,
}: Props) {
  const [search, setSearch] =
    useState("");

  const filteredBillings = useMemo(() => {
    const query = search
      .trim()
      .toLowerCase();

    if (!query) {
      return billings;
    }

    return billings.filter((billing) => {
      return (
        billing.invoiceNumber
          ?.toLowerCase()
          .includes(query) ||
        billing.trackingNumber
          .toLowerCase()
          .includes(query)
      );
    });
  }, [billings, search]);

  return (
    <div className="overflow-hidden">
      {/* SEARCH */}
      <div className="border-b border-zinc-200 p-4">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />

          <input
            type="text"
            value={search}
            onChange={(event) =>
              setSearch(event.target.value)
            }
            placeholder="Rechercher une facture ou un shipment..."
            className="h-10 w-full rounded-lg border border-zinc-200 bg-white pl-9 pr-9 text-sm text-zinc-900 outline-none transition placeholder:text-zinc-400 focus:border-zinc-400 focus:ring-2 focus:ring-zinc-100"
          />

          {search && (
            <button
              type="button"
              onClick={() => setSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-700"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      {/* EMPTY DATABASE */}
      {billings.length === 0 && (
        <EmptyState
          title="Aucune facturation"
          description="Aucune facturation n'a encore été enregistrée."
        />
      )}

      {/* NO SEARCH RESULT */}
      {billings.length > 0 &&
        filteredBillings.length === 0 && (
          <EmptyState
            title="Aucun résultat"
            description={`Aucune facturation ne correspond à "${search}".`}
          />
        )}

      {/* TABLE */}
      {filteredBillings.length > 0 && (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px]">
            <thead>
              <tr className="border-b border-zinc-200 bg-zinc-50/70">
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wide text-zinc-500">
                  Facture
                </th>

                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wide text-zinc-500">
                  Shipment
                </th>

                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wide text-zinc-500">
                  Montant
                </th>

                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wide text-zinc-500">
                  Statut
                </th>

                <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wide text-zinc-500">
                  Action
                </th>
              </tr>
            </thead>

            <tbody>
              {filteredBillings.map(
                (billing) => (
                  <tr
                    key={billing.id}
                    className="border-b border-zinc-100 last:border-0 hover:bg-zinc-50/50"
                  >
                    {/* INVOICE */}
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium text-zinc-900">
                          {billing.invoiceNumber ??
                            "Sans numéro"}
                        </p>

                        <p className="mt-1 text-xs text-zinc-500">
                          {formatDate(
                            billing.createdAt,
                          )}
                        </p>
                      </div>
                    </td>

                    {/* TRACKING NUMBER */}
                    <td className="px-6 py-4">
                      <span className="rounded-md bg-zinc-100 px-2 py-1 font-mono text-xs font-medium text-zinc-700">
                        {billing.trackingNumber}
                      </span>
                    </td>

                    {/* AMOUNT */}
                    <td className="px-6 py-4">
                      <p className="font-medium text-zinc-900">
                        {Number(
                          billing.amount,
                        ).toLocaleString("fr-FR")}{" "}
                        {billing.currency}
                      </p>
                    </td>

                    {/* STATUS */}
                    <td className="px-6 py-4">
                      <BillingStatusBadge
                        status={
                          billing.status
                        }
                      />
                    </td>

                    {/* ACTION */}
                    <td className="px-6 py-4 text-right">
                      {billing.invoiceNumber ? (
                        <div className="flex justify-end gap-1">
                          <Link
                            href={`/dashboard/billing/${billing.id}`}
                            className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-200 px-3 py-2 text-sm font-medium text-zinc-700 transition hover:bg-zinc-50"
                          >
                            Voir
                            <ArrowRight className="h-4 w-4" />
                          </Link>
                          <button type="button" onClick={() => onDelete(billing)} title="Supprimer" className="rounded-lg p-2 text-zinc-400 hover:bg-red-50 hover:text-red-600">
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      ) : (
                        <span className="text-xs text-zinc-400">
                          Indisponible
                        </span>
                      )}
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
        <FileText className="h-6 w-6 text-zinc-500" />
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