"use client";

import { useEffect, useState } from "react";
import { Loader2, X } from "lucide-react";

import type {
  PackageBase,
  PackageStatus,
} from "@/app/types/package.types";

import {
  useCreatePackage,
  useUpdatePackage,
} from "@/app/hooks/usePackages";

type PackageFormModalProps = {
  isOpen: boolean;
  shipmentId: string;
  packageToEdit?: PackageBase | null;
  onClose: () => void;
};

const statuses: {
  value: PackageStatus;
  label: string;
}[] = [
  {
    value: "RECEIVED",
    label: "Reçu",
  },
  {
    value: "IN_WAREHOUSE",
    label: "En entrepôt",
  },
  {
    value: "IN_TRANSIT",
    label: "En transit",
  },
  {
    value: "DELIVERED",
    label: "Livré",
  },
  {
    value: "DAMAGED",
    label: "Endommagé",
  },
  {
    value: "LOST",
    label: "Perdu",
  },
];

export default function PackageFormModal({
  isOpen,
  shipmentId,
  packageToEdit,
  onClose,
}: PackageFormModalProps) {
  const isEditing = !!packageToEdit;

  const createMutation = useCreatePackage();
  const updateMutation = useUpdatePackage();

  const [itemName, setItemName] = useState("");
  const [description, setDescription] = useState("");
  const [quantity, setQuantity] = useState("1");

  const [weight, setWeight] = useState("");
  const [length, setLength] = useState("");
  const [width, setWidth] = useState("");
  const [height, setHeight] = useState("");

  const [status, setStatus] =
    useState<PackageStatus>("RECEIVED");

  const [error, setError] = useState("");

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    if (packageToEdit) {
      setItemName(packageToEdit.itemName);

      setDescription(
        packageToEdit.description ?? "",
      );

      setQuantity(
        String(packageToEdit.quantity),
      );

      setWeight(
        packageToEdit.weight ?? "",
      );

      setLength(
        packageToEdit.length ?? "",
      );

      setWidth(
        packageToEdit.width ?? "",
      );

      setHeight(
        packageToEdit.height ?? "",
      );

      setStatus(packageToEdit.status);
    } else {
      setItemName("");
      setDescription("");
      setQuantity("1");

      setWeight("");
      setLength("");
      setWidth("");
      setHeight("");

      setStatus("RECEIVED");
    }

    setError("");
  }, [isOpen, packageToEdit]);

  if (!isOpen) {
    return null;
  }

  const isPending =
    createMutation.isPending ||
    updateMutation.isPending;

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    setError("");

    if (!itemName.trim()) {
      setError(
        "Le nom de l'article est requis.",
      );
      return;
    }

    const parsedQuantity = Number(quantity);

    if (
      !Number.isInteger(parsedQuantity) ||
      parsedQuantity <= 0
    ) {
      setError(
        "La quantité doit être un entier supérieur à 0.",
      );
      return;
    }

    try {
      if (isEditing && packageToEdit) {
        await updateMutation.mutateAsync({
          id: packageToEdit.id,

          data: {
            itemName: itemName.trim(),

            description:
              description.trim() || null,

            quantity: parsedQuantity,

            weight: weight || null,
            length: length || null,
            width: width || null,
            height: height || null,

            status,
          },
        });
      } else {
        await createMutation.mutateAsync({
          shipmentId,

          itemName: itemName.trim(),

          description:
            description.trim() || null,

          quantity: parsedQuantity,

          weight: weight || null,
          length: length || null,
          width: width || null,
          height: height || null,
        });
      }

      onClose();
    } catch (error: any) {
      setError(
        error?.response?.data?.message ??
          "Une erreur est survenue.",
      );
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-200 px-6 py-4">
          <div>
            <h2 className="text-lg font-semibold text-zinc-900">
              {isEditing
                ? "Modifier le package"
                : "Ajouter un package"}
            </h2>

            <p className="mt-1 text-sm text-zinc-500">
              {isEditing
                ? "Modifiez les informations du package."
                : "Ajoutez un nouveau package à ce shipment."}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={isPending}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-zinc-500 transition hover:bg-zinc-100 hover:text-zinc-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <X size={19} />
          </button>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="max-h-[75vh] overflow-y-auto"
        >
          <div className="space-y-5 p-6">
            {error && (
              <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}

            {/* Item */}
            <div>
              <label className="mb-1.5 block text-sm font-medium text-zinc-700">
                Nom de l'article
              </label>

              <input
                value={itemName}
                onChange={(event) =>
                  setItemName(event.target.value)
                }
                placeholder="Ex: Cartons de marchandises"
                className="h-11 w-full rounded-lg border border-zinc-200 px-3 text-sm outline-none transition placeholder:text-zinc-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            {/* Description */}
            <div>
              <label className="mb-1.5 block text-sm font-medium text-zinc-700">
                Description
              </label>

              <textarea
                value={description}
                onChange={(event) =>
                  setDescription(event.target.value)
                }
                rows={3}
                placeholder="Description du contenu..."
                className="w-full resize-none rounded-lg border border-zinc-200 px-3 py-2.5 text-sm outline-none transition placeholder:text-zinc-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            {/* Quantity */}
            <div>
              <label className="mb-1.5 block text-sm font-medium text-zinc-700">
                Quantité
              </label>

              <input
                type="number"
                min="1"
                value={quantity}
                onChange={(event) =>
                  setQuantity(event.target.value)
                }
                className="h-11 w-full rounded-lg border border-zinc-200 px-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            {/* Dimensions */}
            <div>
              <p className="mb-2 text-sm font-medium text-zinc-700">
                Dimensions
              </p>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                <input
                  value={length}
                  onChange={(event) =>
                    setLength(event.target.value)
                  }
                  placeholder="Longueur"
                  className="h-11 rounded-lg border border-zinc-200 px-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />

                <input
                  value={width}
                  onChange={(event) =>
                    setWidth(event.target.value)
                  }
                  placeholder="Largeur"
                  className="h-11 rounded-lg border border-zinc-200 px-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />

                <input
                  value={height}
                  onChange={(event) =>
                    setHeight(event.target.value)
                  }
                  placeholder="Hauteur"
                  className="h-11 rounded-lg border border-zinc-200 px-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              <p className="mt-1.5 text-xs text-zinc-400">
                Les dimensions sont exprimées en cm.
              </p>
            </div>

            {/* Weight */}
            <div>
              <label className="mb-1.5 block text-sm font-medium text-zinc-700">
                Poids
              </label>

              <div className="relative">
                <input
                  value={weight}
                  onChange={(event) =>
                    setWeight(event.target.value)
                  }
                  placeholder="Ex: 50.000"
                  className="h-11 w-full rounded-lg border border-zinc-200 px-3 pr-12 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />

                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-zinc-400">
                  kg
                </span>
              </div>
            </div>

            {/* Status */}
            {isEditing && (
              <div>
                <label className="mb-1.5 block text-sm font-medium text-zinc-700">
                  Statut
                </label>

                <select
                  value={status}
                  onChange={(event) =>
                    setStatus(
                      event.target
                        .value as PackageStatus,
                    )
                  }
                  className="h-11 w-full rounded-lg border border-zinc-200 bg-white px-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                >
                  {statuses.map(
                    (currentStatus) => (
                      <option
                        key={currentStatus.value}
                        value={currentStatus.value}
                      >
                        {currentStatus.label}
                      </option>
                    ),
                  )}
                </select>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 border-t border-zinc-200 bg-zinc-50/50 px-6 py-4">
            <button
              type="button"
              onClick={onClose}
              disabled={isPending}
              className="rounded-lg border border-zinc-200 bg-white px-4 py-2.5 text-sm font-medium text-zinc-700 transition hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Annuler
            </button>

            <button
              type="submit"
              disabled={isPending}
              className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isPending && (
                <Loader2
                  size={16}
                  className="animate-spin"
                />
              )}

              {isEditing
                ? "Enregistrer"
                : "Ajouter le package"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}