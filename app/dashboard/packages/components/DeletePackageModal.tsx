"use client";

import { useDeletePackage } from "@/app/hooks/usePackages";
import type { PackageBase } from "@/app/types/package.types";
import { Loader2, Trash2, X } from "lucide-react";

type DeletePackageModalProps = {
  package: PackageBase | null;
  onClose: () => void;
};

export default function DeletePackageModal({
  package: pkg,
  onClose,
}: DeletePackageModalProps) {
  const deleteMutation = useDeletePackage();

  if (!pkg) {
    return null;
  }

  const currentPackage = pkg;

  async function handleDelete() {
    try {
      await deleteMutation.mutateAsync(
        currentPackage.id,
      );

      onClose();
    } catch {
      // L'erreur est affichée dans le modal.
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-200 px-6 py-4">
          <h2 className="text-lg font-semibold text-zinc-900">
            Supprimer le package
          </h2>

          <button
            type="button"
            onClick={onClose}
            disabled={deleteMutation.isPending}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-zinc-500 transition hover:bg-zinc-100 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <X size={19} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="flex gap-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-red-50 text-red-600">
              <Trash2 size={19} />
            </div>

            <div>
              <p className="text-sm font-medium text-zinc-900">
                Voulez-vous supprimer ce package ?
              </p>

              <p className="mt-1 text-sm text-zinc-500">
                <span className="font-medium text-zinc-700">
                  {currentPackage.itemName}
                </span>{" "}
                ({currentPackage.trackingCode}) sera
                définitivement supprimé.
              </p>
            </div>
          </div>

          {deleteMutation.isError && (
            <div className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              Impossible de supprimer le package.
              Veuillez réessayer.
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 border-t border-zinc-200 bg-zinc-50/50 px-6 py-4">
          <button
            type="button"
            onClick={onClose}
            disabled={deleteMutation.isPending}
            className="rounded-lg border border-zinc-200 bg-white px-4 py-2.5 text-sm font-medium text-zinc-700 transition hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Annuler
          </button>

          <button
            type="button"
            onClick={handleDelete}
            disabled={deleteMutation.isPending}
            className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {deleteMutation.isPending && (
              <Loader2
                size={16}
                className="animate-spin"
              />
            )}

            Supprimer
          </button>
        </div>
      </div>
    </div>
  );
}