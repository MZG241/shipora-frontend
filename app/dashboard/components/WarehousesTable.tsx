"use client";

import {
  CheckCircle2,
  MapPin,
  Pencil,
  Trash2,
  User,
  XCircle,
} from "lucide-react";

import type { Warehouse } from "@/app/types/warehouse.type";

type WarehousesTableProps = {
  warehouses: Warehouse[];
  onEdit: (warehouse: Warehouse) => void;
  onDelete: (warehouse: Warehouse) => void;
};

export function WarehousesTable({
  warehouses,
  onEdit,
  onDelete,
}: WarehousesTableProps) {
  if (warehouses.length === 0) {
    return (
      <div className="flex min-h-[300px] flex-col items-center justify-center border-t border-slate-200 px-6 text-center">
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#EAF3FF]">
          <User className="h-5 w-5 text-[#1677FF]" />
        </div>

        <h3 className="text-sm font-semibold text-slate-900">
          Aucun entrepôt trouvé
        </h3>

        <p className="mt-1 max-w-sm text-sm text-slate-500">
          Aucun entrepôt ne correspond à votre recherche.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[800px]">
        <thead>
          <tr className="border-b border-slate-200 bg-slate-50/70">
            <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
              Entrepôt
            </th>

            <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
              Code
            </th>

            <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
              Localisation
            </th>

            <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
              Statut
            </th>

            <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
              Date d’ajout
            </th>

            <th className="w-24 px-5 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
              Actions
            </th>
          </tr>
        </thead>

        <tbody>
          {warehouses.map((warehouse) => (
            <tr
              key={warehouse.id}
              className="border-b border-slate-100 last:border-0 hover:bg-slate-50/50"
            >
              {/* Entrepôt */}
              <td className="px-5 py-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#EAF3FF] text-[#1677FF]">
                    <MapPin className="h-4 w-4" />
                  </div>

                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-slate-800">
                      {warehouse.name}
                    </p>

                    <p className="text-xs text-slate-400">
                      Entrepôt
                    </p>
                  </div>
                </div>
              </td>

              {/* Code */}
              <td className="px-5 py-4">
                <span className="inline-flex rounded-md bg-slate-100 px-2 py-1 font-mono text-xs font-medium text-slate-600">
                  {warehouse.code}
                </span>
              </td>

              {/* Localisation */}
              <td className="px-5 py-4">
                {warehouse.city ||
                warehouse.country ? (
                  <div className="flex items-start gap-2">
                    <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />

                    <div className="min-w-0">
                      {warehouse.city && (
                        <p className="text-sm text-slate-700">
                          {warehouse.city}
                        </p>
                      )}

                      {warehouse.country && (
                        <p className="text-xs text-slate-400">
                          {warehouse.country}
                        </p>
                      )}
                    </div>
                  </div>
                ) : (
                  <span className="text-xs text-slate-400">
                    Non renseignée
                  </span>
                )}
              </td>

              {/* Statut */}
              <td className="px-5 py-4">
                {warehouse.isActive ? (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-green-50 px-2.5 py-1 text-xs font-medium text-green-600">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    Actif
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-500">
                    <XCircle className="h-3.5 w-3.5" />
                    Inactif
                  </span>
                )}
              </td>

              {/* Date */}
              <td className="px-5 py-4">
                <span className="text-sm text-slate-600">
                  {formatDate(
                    warehouse.createdAt,
                  )}
                </span>
              </td>

              {/* Actions */}
              <td className="px-5 py-4 text-right">
                <div className="flex items-center justify-end gap-1">
                  <button
                    type="button"
                    onClick={() =>
                      onEdit(warehouse)
                    }
                    className="rounded-lg p-2 text-slate-400 transition hover:bg-[#EAF3FF] hover:text-[#1677FF]"
                    title="Modifier"
                    aria-label={`Modifier ${warehouse.name}`}
                  >
                    <Pencil className="h-4 w-4" />
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      onDelete(warehouse)
                    }
                    className="rounded-lg p-2 text-slate-400 transition hover:bg-red-50 hover:text-red-500"
                    title="Supprimer"
                    aria-label={`Supprimer ${warehouse.name}`}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function formatDate(date: string) {
  return new Intl.DateTimeFormat("fr-FR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(date));
}

