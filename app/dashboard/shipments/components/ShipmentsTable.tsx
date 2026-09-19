"use client";

import {
  Eye,
  Package,
  Pencil,
  Trash2,
} from "lucide-react";

import type { Shipment } from "@/app/types/shipment.types";

type ShipmentsTableProps = {
  shipments: Shipment[];
  onView: (shipment: Shipment) => void;
  onEdit: (shipment: Shipment) => void;
  onDelete: (shipment: Shipment) => void;
  onPackages: (shipment: Shipment) => void;
};

const statusLabels: Record<string, string> = {
  PENDING: "En attente",
  RECEIVED: "Reçue",
  IN_WAREHOUSE: "En entrepôt",
  IN_TRANSIT: "En transit",
  ARRIVED: "Arrivée",
  CUSTOMS: "Douane",
  READY_FOR_PICKUP: "Prête",
  PICKED_UP: "Récupérée",
  CANCELLED: "Annulée",
};

const statusStyles: Record<string, string> = {
  PENDING: "bg-amber-50 text-amber-700",
  RECEIVED: "bg-blue-50 text-blue-700",
  IN_WAREHOUSE: "bg-purple-50 text-purple-700",
  IN_TRANSIT: "bg-indigo-50 text-indigo-700",
  ARRIVED: "bg-cyan-50 text-cyan-700",
  CUSTOMS: "bg-orange-50 text-orange-700",
  READY_FOR_PICKUP: "bg-emerald-50 text-emerald-700",
  PICKED_UP: "bg-green-50 text-green-700",
  CANCELLED: "bg-red-50 text-red-700",
};

const transportLabels: Record<string, string> = {
  AIR: "Aérien",
  SEA: "Maritime",
  ROAD: "Routier",
  RAIL: "Ferroviaire",
};

export function ShipmentsTable({
  shipments,
  onView,
  onEdit,
  onDelete,
  onPackages,
}: ShipmentsTableProps) {
  if (shipments.length === 0) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white px-6 py-12 text-center">
        <Package className="mx-auto h-8 w-8 text-slate-300" />

        <p className="mt-3 text-sm font-medium text-slate-700">
          Aucune expédition trouvée
        </p>

        <p className="mt-1 text-xs text-slate-400">
          Les expéditions apparaîtront ici.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[1100px]">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50/70">
              <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-400">
                Expédition
              </th>

              <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-400">
                Trajet
              </th>

              <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-400">
                Transport
              </th>

              <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-400">
                Statut
              </th>

              <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-400">
                Arrivée estimée
              </th>

              <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-400">
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {shipments.map((shipment) => (
              <tr
                key={shipment.id}
                className="transition hover:bg-slate-50/60"
              >
                {/* Expédition */}
                <td className="px-5 py-4">
                  <div>
                    <p className="text-sm font-semibold text-slate-900">
                      {shipment.trackingNumber}
                    </p>

                    <p className="mt-1 text-xs text-slate-400">
                      Créée le{" "}
                      {new Date(
                        shipment.createdAt,
                      ).toLocaleDateString("fr-FR")}
                    </p>
                  </div>
                </td>

                {/* Trajet */}
                <td className="px-5 py-4">
                  <div className="flex items-center gap-2 text-sm">
                    <span className="max-w-[150px] truncate text-slate-700">
                      {shipment.origin}
                    </span>

                    <span className="text-slate-300">
                      →
                    </span>

                    <span className="max-w-[150px] truncate text-slate-700">
                      {shipment.destination}
                    </span>
                  </div>
                </td>

                {/* Transport */}
                <td className="px-5 py-4">
                  <span className="text-sm text-slate-600">
                    {transportLabels[
                      shipment.transportMethod
                    ] ?? shipment.transportMethod}
                  </span>
                </td>

                {/* Statut */}
                <td className="px-5 py-4">
                  <span
                    className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${
                      statusStyles[shipment.status] ??
                      "bg-slate-100 text-slate-600"
                    }`}
                  >
                    {statusLabels[shipment.status] ??
                      shipment.status}
                  </span>
                </td>

                {/* Arrivée */}
                <td className="px-5 py-4">
                  <span className="text-sm text-slate-600">
                    {shipment.estimatedArrival
                      ? new Date(
                          shipment.estimatedArrival,
                        ).toLocaleDateString("fr-FR")
                      : "—"}
                  </span>
                </td>

                {/* Actions */}
                <td className="px-5 py-4">
                  <div className="flex items-center justify-end gap-1">
                    {/* Voir */}
                    <button
                      type="button"
                      onClick={() => onView(shipment)}
                      className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                      title="Voir"
                    >
                      <Eye className="h-4 w-4" />
                    </button>

                    {/* Modifier */}
                    <button
                      type="button"
                      onClick={() => onEdit(shipment)}
                      className="rounded-lg p-2 text-slate-400 transition hover:bg-blue-50 hover:text-[#1677FF]"
                      title="Modifier"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>

                    {/* Colis */}
                    <button
                      type="button"
                      onClick={() => onPackages(shipment)}
                      className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium text-slate-600 transition hover:bg-blue-50 hover:text-[#1677FF]"
                      title="Voir les colis"
                    >
                      <Package className="h-3.5 w-3.5" />
                      Colis
                    </button>

                    {/* Supprimer */}
                    <button
                      type="button"
                      onClick={() => onDelete(shipment)}
                      className="rounded-lg p-2 text-slate-400 transition hover:bg-red-50 hover:text-red-500"
                      title="Supprimer"
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
    </div>
  );
}