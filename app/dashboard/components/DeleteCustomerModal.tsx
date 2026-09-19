
"use client";

import {
  Loader2,
  Trash2,
  X,
} from "lucide-react";

import { useDeleteCustomer } from "@/app/hooks/useCustomers";
import type { Customer } from "@/app/types/customer.type";

type DeleteCustomerModalProps = {
  open: boolean;
  customer: Customer | null;
  onClose: () => void;
};

export function DeleteCustomerModal({
  open,
  customer,
  onClose,
}: DeleteCustomerModalProps) {
  const deleteMutation =
    useDeleteCustomer();

  if (!open || !customer) {
    return null;
  }

  // On récupère les valeurs après le guard.
  const customerId = customer.id;
  const customerName = customer.name;

  async function handleDelete() {
    try {
      await deleteMutation.mutateAsync(
        customerId,
      );

      onClose();
    } catch (error){
       console.error("DELETE WAREHOUSE ERROR:", error);
    }
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/40 p-4">
      {/* Overlay */}
      <div
        className="absolute inset-0"
        onClick={() => {
          if (!deleteMutation.isPending) {
            onClose();
          }
        }}
      />

      {/* Modal */}
      <div className="relative z-10 w-full max-w-md overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
          <h2 className="text-lg font-semibold text-slate-900">
            Supprimer le client
          </h2>

          <button
            type="button"
            onClick={onClose}
            disabled={
              deleteMutation.isPending
            }
            className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
            aria-label="Fermer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="px-5 py-6">
          <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-red-50">
            <Trash2 className="h-5 w-5 text-red-500" />
          </div>

          <h3 className="text-base font-semibold text-slate-900">
            Êtes-vous sûr ?
          </h3>

          <p className="mt-2 text-sm leading-6 text-slate-500">
            Vous êtes sur le point de supprimer{" "}
            <span className="font-semibold text-slate-700">
              {customerName}
            </span>
            . Cette action est irréversible.
          </p>

          {deleteMutation.isError && (
            <div className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
              Impossible de supprimer ce
              client. Veuillez réessayer.
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex flex-col-reverse gap-3 border-t border-slate-200 bg-slate-50/50 px-5 py-4 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onClose}
            disabled={
              deleteMutation.isPending
            }
            className="h-10 rounded-lg border border-slate-200 bg-white px-4 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Annuler
          </button>

          <button
            type="button"
            onClick={handleDelete}
            disabled={
              deleteMutation.isPending
            }
            className="flex h-10 items-center justify-center gap-2 rounded-lg bg-red-500 px-5 text-sm font-medium text-white transition hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-50"
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

