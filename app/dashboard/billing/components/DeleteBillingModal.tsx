"use client";

import { FileX2, X } from "lucide-react";
import { useDeleteBilling } from "@/app/hooks/useBilling";
import type { Billing } from "@/app/types/billing.type";

type Props = {
  billing: Billing | null;
  onClose: () => void;
};

export function DeleteBillingModal({ billing, onClose }: Props) {
  const mutation = useDeleteBilling();

  if (!billing) return null;
  const selectedBilling = billing;

  async function handleConfirm() {
    await mutation.mutateAsync(selectedBilling.id);
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/30 p-4">
      <div role="dialog" aria-modal="true" className="w-full max-w-md rounded-xl bg-white p-6 shadow-2xl">
        <div className="flex items-start justify-between">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-50">
            <FileX2 className="h-5 w-5 text-red-600" />
          </div>
          <button type="button" onClick={onClose} className="rounded-lg p-2 text-slate-400 hover:bg-slate-100" aria-label="Fermer">
            <X className="h-4 w-4" />
          </button>
        </div>
        <h2 className="mt-5 text-lg font-semibold text-slate-950">Supprimer cette facturation ?</h2>
        <p className="mt-2 text-sm text-slate-500">
          La facture {billing.invoiceNumber ?? "sans numéro"} sera supprimée définitivement.
          Cette action est à utiliser si l’expédition ne contient plus de colis.
        </p>
        <div className="mt-6 flex justify-end gap-2">
          <button type="button" onClick={onClose} className="rounded-lg border border-slate-200 px-4 py-2 text-sm text-slate-700">Annuler</button>
          <button type="button" onClick={handleConfirm} disabled={mutation.isPending} className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50">
            {mutation.isPending ? "Suppression..." : "Supprimer"}
          </button>
        </div>
      </div>
    </div>
  );
}