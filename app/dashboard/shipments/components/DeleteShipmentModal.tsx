"use client";

import {
  AlertTriangle,
  Loader2,
  Trash2,
  X,
} from "lucide-react";

import { useDeleteShipment } from "@/app/hooks/useShipments";

import type { Shipment } from "@/app/types/shipment.types";

type DeleteShipmentModalProps = {
  shipment: Shipment | null;
  onClose: () => void;
};

export function DeleteShipmentModal({
  shipment,
  onClose,
}: DeleteShipmentModalProps) {
  const deleteShipmentMutation =
    useDeleteShipment();

  if (!shipment) {
    return null;
  }

  const shipmentId = shipment.id;

  async function handleDelete() {
    try {
      await deleteShipmentMutation.mutateAsync(
        shipmentId,
      );

      onClose();
    } catch {
      // L'erreur est affichée via isError.
    }
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      {/* Overlay */}
      <button
        type="button"
        aria-label="Fermer"
        onClick={() => {
          if (
            !deleteShipmentMutation.isPending
          ) {
            onClose();
          }
        }}
        className="absolute inset-0 cursor-default bg-slate-950/40 backdrop-blur-[1px]"
      />

      {/* Modal */}
      <div className="relative w-full max-w-md overflow-hidden rounded-xl border border-slate-200 bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-start justify-between px-5 pt-5">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-red-50">
              <AlertTriangle className="h-5 w-5 text-red-500" />
            </div>

            <div>
              <h2 className="text-base font-semibold text-slate-900">
                Supprimer l'expédition
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Cette action est irréversible.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={
              deleteShipmentMutation.isPending
            }
            className="rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Content */}
        <div className="px-5 py-5">
          <p className="text-sm leading-6 text-slate-600">
            Vous êtes sur le point de supprimer
            définitivement cette expédition :
          </p>

          <div className="mt-3 rounded-lg border border-slate-200 bg-slate-50 px-4 py-3">
            <p className="text-xs font-medium text-slate-400">
              Numéro de suivi
            </p>

            <p className="mt-1 text-sm font-semibold text-slate-900">
              {shipment.trackingNumber}
            </p>

            <div className="mt-2 flex items-center gap-2 text-xs text-slate-500">
              <span>
                {shipment.origin}
              </span>

              <span className="text-slate-300">
                →
              </span>

              <span>
                {shipment.destination}
              </span>
            </div>
          </div>

          <p className="mt-4 text-xs leading-5 text-slate-400">
            Les informations associées à cette
            expédition pourront également être
            affectées par cette suppression.
          </p>

          {/* Error */}
          {deleteShipmentMutation.isError && (
            <div className="mt-4 rounded-lg border border-red-100 bg-red-50 px-4 py-3">
              <p className="text-sm font-medium text-red-700">
                Impossible de supprimer
                l'expédition.
              </p>

              <p className="mt-1 text-xs text-red-500">
                Une erreur est survenue.
                Veuillez réessayer.
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2 border-t border-slate-200 bg-slate-50/50 px-5 py-4">
          <button
            type="button"
            onClick={onClose}
            disabled={
              deleteShipmentMutation.isPending
            }
            className="h-10 rounded-lg border border-slate-200 bg-white px-4 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Annuler
          </button>

          <button
            type="button"
            onClick={handleDelete}
            disabled={
              deleteShipmentMutation.isPending
            }
            className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-red-500 px-4 text-sm font-semibold text-white transition hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {deleteShipmentMutation.isPending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Suppression...
              </>
            ) : (
              <>
                <Trash2 className="h-4 w-4" />
                Supprimer
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}