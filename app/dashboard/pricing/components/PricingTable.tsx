"use client";

import {
  Edit,
  MoreHorizontal,
  Search,
  Trash2,
} from "lucide-react";

import type {
  PricingRule,
  TransportMethod,
} from "@/app/types/pricing.type";

type PricingTableProps = {
  pricings: PricingRule[];
  onEdit: (pricing: PricingRule) => void;
  onDelete: (pricing: PricingRule) => void;
};

const transportLabels: Record<
  TransportMethod,
  string
> = {
  AIR: "Aérien",
  SEA: "Maritime",
  ROAD: "Routier",
  RAIL: "Ferroviaire",
};

const pricingTypeLabels: Record<
  PricingRule["pricingType"],
  string
> = {
  PER_KG: "Par kg",
  PER_CBM: "Par m³",
  FIXED: "Forfait",
};

function formatPrice(
  price: string,
  currency: string,
) {
  const numericPrice = Number(price);

  if (Number.isNaN(numericPrice)) {
    return `${price} ${currency}`;
  }

  return `${numericPrice.toLocaleString(
    "fr-FR",
    {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    },
  )} ${currency}`;
}

export function PricingTable({
  pricings,
  onEdit,
  onDelete,
}: PricingTableProps) {
  if (pricings.length === 0) {
    return (
      <div className="flex flex-col space-y-6 min-h-[300px] items-center justify-center rounded-xl border border-slate-200 bg-white">
        
        <Search className="text-center"/>

        <div className="text-center">
            

          <p className="text-sm font-medium text-slate-900">
            Aucun tarif trouvé
          </p>

          <p className="mt-1 text-sm text-slate-500">
            Commencez par créer votre premier tarif.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[950px]">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50/70">
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                Tarif
              </th>

              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                Trajet
              </th>

              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                Transport
              </th>

              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                Type
              </th>

              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                Prix
              </th>

              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                Statut
              </th>

              <th className="w-16 px-4 py-4" />
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {pricings.map((pricing) => (
              <tr
                key={pricing.id}
                className="transition-colors hover:bg-slate-50/60"
              >
                {/* Tarif */}
                <td className="px-6 py-4">
                  <div>
                    <p className="text-sm font-semibold text-slate-900">
                      {pricing.name}
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                      {pricing.origin ||
                        "Toutes origines"}
                    </p>
                  </div>
                </td>

                {/* Trajet */}
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2 text-sm">
                    <span className="max-w-[140px] truncate text-slate-700">
                      {pricing.origin ||
                        "Toutes"}
                    </span>

                    <span className="text-slate-300">
                      →
                    </span>

                    <span className="max-w-[140px] truncate text-slate-700">
                      {pricing.destination ||
                        "Toutes"}
                    </span>
                  </div>
                </td>

                {/* Transport */}
                <td className="px-6 py-4">
                  <span className="text-sm text-slate-700">
                    {pricing.transportMethod
                      ? transportLabels[
                          pricing.transportMethod
                        ]
                      : "Tous"}
                  </span>
                </td>

                {/* Type */}
                <td className="px-6 py-4">
                  <span className="inline-flex rounded-md bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700">
                    {
                      pricingTypeLabels[
                        pricing.pricingType
                      ]
                    }
                  </span>
                </td>

                {/* Prix */}
                <td className="px-6 py-4">
                  <span className="text-sm font-semibold text-slate-900">
                    {formatPrice(
                      pricing.price,
                      pricing.currency,
                    )}
                  </span>
                </td>

                {/* Statut */}
                <td className="px-6 py-4">
                  <span
                    className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${
                      pricing.isActive
                        ? "bg-emerald-50 text-emerald-700"
                        : "bg-slate-100 text-slate-500"
                    }`}
                  >
                    <span
                      className={`h-1.5 w-1.5 rounded-full ${
                        pricing.isActive
                          ? "bg-emerald-500"
                          : "bg-slate-400"
                      }`}
                    />

                    {pricing.isActive
                      ? "Actif"
                      : "Inactif"}
                  </span>
                </td>

                {/* Actions */}
                <td className="px-4 py-4">
                  <div className="flex items-center justify-end gap-1">
                    <button
                      type="button"
                      onClick={() =>
                        onEdit(pricing)
                      }
                      className="rounded-lg p-2 text-slate-500 transition-colors hover:bg-blue-50 hover:text-[#1677FF]"
                      aria-label={`Modifier ${pricing.name}`}
                    >
                      <Edit className="h-4 w-4" />
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        onDelete(pricing)
                      }
                      className="rounded-lg p-2 text-slate-500 transition-colors hover:bg-red-50 hover:text-red-600"
                      aria-label={`Supprimer ${pricing.name}`}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>

                    <button
                      type="button"
                      className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
                      aria-label="Plus d'options"
                    >
                      <MoreHorizontal className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
