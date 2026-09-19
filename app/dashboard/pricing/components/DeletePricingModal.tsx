"use client";

import { Loader2, Trash2, X } from "lucide-react";
import { useDeletePricing } from "@/app/hooks/usePricing";
import type { PricingRule } from "@/app/types/pricing.type";

type DeletePricingModalProps = {
  open: boolean;
  pricing: PricingRule | null;
  onClose: () => void;
};

export function DeletePricingModal({
  open,
  pricing,
  onClose,
}: DeletePricingModalProps) {
  const deleteMutation = useDeletePricing();

  if (!open || !pricing) {
    return null;
  }

  const pricingId = pricing.id;
  const pricingName = pricing.name;

  const handleDelete = async () => {
    try {
      await deleteMutation.mutateAsync(
        pricingId,
      );

      onClose();
    } catch (error) {
      console.error(
        "Erreur lors de la suppression du tarif:",
        error,
      );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Overlay */}
      <button
        type="button"
        aria-label="Fermer"
        onClick={onClose}
        disabled={deleteMutation.isPending}
        className="absolute inset-0 bg-slate-950/40"
      />

      {/* Modal */}
      <div className="relative z-10 w-full max-w-md rounded-2xl bg-white shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-50">
              <Trash2 className="h-5 w-5 text-red-600" />
            </div>

            <div>
              <h2 className="text-lg font-semibold text-slate-900">
                Supprimer le tarif
              </h2>

              <p className="text-sm text-slate-500">
                Cette action est définitive.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={deleteMutation.isPending}
            className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600 disabled:cursor-not-allowed disabled:opacity-50"
            aria-label="Fermer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="px-6 py-5">
          <p className="text-sm leading-6 text-slate-600">
            Êtes-vous sûr de vouloir supprimer le
            tarif{" "}
            <span className="font-semibold text-slate-900">
              {pricingName}
            </span>
            ?
          </p>

          <div className="mt-4 rounded-lg border border-red-100 bg-red-50 px-4 py-3">
            <p className="text-xs leading-5 text-red-700">
              La règle de tarification sera définitivement
              supprimée et ne pourra plus être utilisée pour
              de nouvelles expéditions.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex flex-col-reverse gap-3 border-t border-slate-200 bg-slate-50/50 px-6 py-4 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onClose}
            disabled={deleteMutation.isPending}
            className="h-10 rounded-lg border border-slate-200 bg-white px-4 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Annuler
          </button>

          <button
            type="button"
            onClick={handleDelete}
            disabled={deleteMutation.isPending}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-red-600 px-5 text-sm font-medium text-white transition-colors hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {deleteMutation.isPending && (
              <Loader2 className="h-4 w-4 animate-spin" />
            )}

            {deleteMutation.isPending
              ? "Suppression..."
              : "Supprimer"}
          </button>
        </div>
      </div>
    </div>
  );
}

