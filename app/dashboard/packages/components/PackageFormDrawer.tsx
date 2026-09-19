"use client";

import { FormEvent, useMemo, useState } from "react";
import {
  AlertCircle,
  ChevronDown,
  Loader2,
  Package,
  Search,
  X,
} from "lucide-react";

import { useCreatePackage } from "@/app/hooks/usePackages";
import { useShipments } from "@/app/hooks/useShipments";

type PackageFormDrawerProps = {
  isOpen: boolean;
  onClose: () => void;
};

export default function PackageFormDrawer({
  isOpen,
  onClose,
}: PackageFormDrawerProps) {
  const createMutation = useCreatePackage();

  const {
    data: shipments,
    isLoading: isLoadingShipments,
  } = useShipments();

  const [shipmentId, setShipmentId] = useState("");
  const [shipmentSearch, setShipmentSearch] = useState("");
  const [showShipmentList, setShowShipmentList] =
    useState(false);

  const [itemName, setItemName] = useState("");
  const [description, setDescription] = useState("");
  const [quantity, setQuantity] = useState("1");
  const [weight, setWeight] = useState("");
  const [length, setLength] = useState("");
  const [width, setWidth] = useState("");
  const [height, setHeight] = useState("");

  const [error, setError] = useState("");

  const selectedShipment = shipments?.find(
    (shipment) => shipment.id === shipmentId,
  );

  const filteredShipments = useMemo(() => {
    if (!shipments) {
      return [];
    }

    const value = shipmentSearch
      .trim()
      .toLowerCase();

    if (!value) {
      return shipments;
    }

    return shipments.filter((shipment) => {
      return (
        shipment.trackingNumber
          .toLowerCase()
          .includes(value) ||
        shipment.origin
          .toLowerCase()
          .includes(value) ||
        shipment.destination
          .toLowerCase()
          .includes(value)
      );
    });
  }, [shipments, shipmentSearch]);

  if (!isOpen) {
    return null;
  }

  function resetForm() {
    setShipmentId("");
    setShipmentSearch("");
    setShowShipmentList(false);

    setItemName("");
    setDescription("");
    setQuantity("1");
    setWeight("");
    setLength("");
    setWidth("");
    setHeight("");

    setError("");
  }

  function handleClose() {
    if (createMutation.isPending) {
      return;
    }

    resetForm();
    onClose();
  }

  function handleSelectShipment(
    id: string,
  ) {
    const shipment = shipments?.find(
      (item) => item.id === id,
    );

    if (!shipment) {
      return;
    }

    setShipmentId(shipment.id);

    setShipmentSearch(
      `${shipment.trackingNumber} — ${shipment.origin} → ${shipment.destination}`,
    );

    setShowShipmentList(false);
    setError("");
  }

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    setError("");

    if (!shipmentId) {
      setError(
        "Veuillez sélectionner un shipment.",
      );
      return;
    }

    if (!itemName.trim()) {
      setError(
        "Le nom du package est obligatoire.",
      );
      return;
    }

    if (!quantity || Number(quantity) < 1) {
      setError(
        "La quantité doit être supérieure à 0.",
      );
      return;
    }

    try {
      await createMutation.mutateAsync({
        shipmentId,
        itemName: itemName.trim(),
        description:
          description.trim() || null,
        quantity: Number(quantity),
        weight: weight || null,
        length: length || null,
        width: width || null,
        height: height || null,
      });

      resetForm();
      onClose();
    } catch (err: any) {
      setError(
        err?.response?.data?.message ??
          "Impossible de créer le package.",
      );
    }
  }

  return (
    <div className="fixed inset-0 z-50">
      {/* Overlay */}
      <button
        type="button"
        aria-label="Fermer"
        onClick={handleClose}
        className="absolute inset-0 cursor-pointer bg-black/30"
      />

      {/* Drawer */}
      <aside className="absolute right-0 top-0 flex h-full w-full max-w-lg flex-col bg-white shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-200 px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
              <Package size={19} />
            </div>

            <div>
              <h2 className="text-base font-semibold text-zinc-900">
                Créer un package
              </h2>

              <p className="text-xs text-zinc-500">
                Ajoutez un nouveau package à un shipment.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleClose}
            disabled={createMutation.isPending}
            className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg text-zinc-500 transition hover:bg-zinc-100 hover:text-zinc-900 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <X size={18} />
          </button>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="flex flex-1 flex-col overflow-hidden"
        >
          {/* Content */}
          <div className="flex-1 space-y-5 overflow-y-auto px-6 py-6">
            {/* Error */}
            {error && (
              <div className="flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                <AlertCircle
                  size={18}
                  className="mt-0.5 shrink-0"
                />

                <p>{error}</p>
              </div>
            )}

            {/* Shipment */}
            <div className="relative">
              <label
                htmlFor="shipment-search"
                className="mb-1.5 block text-sm font-medium text-zinc-700"
              >
                Shipment
                <span className="ml-1 text-red-500">
                  *
                </span>
              </label>

              <div className="relative">
                <Search
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400"
                />

                <input
                  id="shipment-search"
                  type="text"
                  value={shipmentSearch}
                  onChange={(e) => {
                    setShipmentSearch(
                      e.target.value,
                    );

                    setShipmentId("");

                    setShowShipmentList(true);
                  }}
                  onFocus={() =>
                    setShowShipmentList(true)
                  }
                  placeholder={
                    isLoadingShipments
                      ? "Chargement des shipments..."
                      : "Rechercher un shipment..."
                  }
                  disabled={
                    isLoadingShipments ||
                    createMutation.isPending
                  }
                  className="h-10 w-full rounded-lg border border-zinc-200 bg-white pl-9 pr-9 text-sm text-zinc-700 outline-none transition placeholder:text-zinc-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-zinc-50"
                />

                <ChevronDown
                  size={16}
                  className={`absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 transition ${
                    showShipmentList
                      ? "rotate-180"
                      : ""
                  }`}
                />
              </div>

              {/* Selected shipment */}
              {selectedShipment &&
                !showShipmentList && (
                  <div className="mt-2 rounded-lg border border-blue-100 bg-blue-50 px-3 py-2">
                    <p className="text-xs font-medium text-blue-700">
                      Shipment sélectionné
                    </p>

                    <p className="mt-0.5 text-sm text-blue-900">
                      {
                        selectedShipment.trackingNumber
                      }
                    </p>
                  </div>
                )}

              {/* Dropdown */}
              {showShipmentList && (
                <div className="absolute left-0 right-0 top-full z-20 mt-1 max-h-64 overflow-y-auto rounded-lg border border-zinc-200 bg-white shadow-lg">
                  {isLoadingShipments ? (
                    <div className="px-4 py-6 text-center text-sm text-zinc-500">
                      Chargement des shipments...
                    </div>
                  ) : filteredShipments.length ===
                    0 ? (
                    <div className="px-4 py-6 text-center">
                      <Search
                        size={18}
                        className="mx-auto mb-2 text-zinc-400"
                      />

                      <p className="text-sm font-medium text-zinc-700">
                        Aucun shipment trouvé
                      </p>

                      <p className="mt-1 text-xs text-zinc-400">
                        Essayez un autre tracking ou une autre destination.
                      </p>
                    </div>
                  ) : (
                    filteredShipments.map(
                      (shipment) => (
                        <button
                          key={shipment.id}
                          type="button"
                          onClick={() =>
                            handleSelectShipment(
                              shipment.id,
                            )
                          }
                          className="flex w-full cursor-pointer flex-col gap-1 border-b border-zinc-100 px-4 py-3 text-left transition last:border-b-0 hover:bg-blue-50"
                        >
                          <div className="flex items-center justify-between gap-3">
                            <span className="font-mono text-xs font-semibold text-zinc-800">
                              {
                                shipment.trackingNumber
                              }
                            </span>

                            <span className="text-xs text-zinc-400">
                              {
                                shipment.transportMethod
                              }
                            </span>
                          </div>

                          <span className="text-xs text-zinc-500">
                            {shipment.origin}{" "}
                            →{" "}
                            {shipment.destination}
                          </span>
                        </button>
                      ),
                    )
                  )}
                </div>
              )}
            </div>

            {/* Item name */}
            <div>
              <label
                htmlFor="itemName"
                className="mb-1.5 block text-sm font-medium text-zinc-700"
              >
                Nom du package
                <span className="ml-1 text-red-500">
                  *
                </span>
              </label>

              <input
                id="itemName"
                type="text"
                value={itemName}
                onChange={(e) =>
                  setItemName(
                    e.target.value,
                  )
                }
                placeholder="Ex: Cartons de marchandises"
                disabled={createMutation.isPending}
                className="h-10 w-full rounded-lg border border-zinc-200 px-3 text-sm outline-none transition placeholder:text-zinc-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-zinc-50"
              />
            </div>

            {/* Description */}
            <div>
              <label
                htmlFor="description"
                className="mb-1.5 block text-sm font-medium text-zinc-700"
              >
                Description
              </label>

              <textarea
                id="description"
                value={description}
                onChange={(e) =>
                  setDescription(
                    e.target.value,
                  )
                }
                placeholder="Description du contenu..."
                rows={3}
                disabled={createMutation.isPending}
                className="w-full resize-none rounded-lg border border-zinc-200 px-3 py-2.5 text-sm outline-none transition placeholder:text-zinc-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-zinc-50"
              />
            </div>

            {/* Quantity */}
            <div>
              <label
                htmlFor="quantity"
                className="mb-1.5 block text-sm font-medium text-zinc-700"
              >
                Quantité
              </label>

              <input
                id="quantity"
                type="number"
                min="1"
                value={quantity}
                onChange={(e) =>
                  setQuantity(
                    e.target.value,
                  )
                }
                disabled={createMutation.isPending}
                className="h-10 w-full rounded-lg border border-zinc-200 px-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-zinc-50"
              />
            </div>

            {/* Dimensions */}
            <div>
              <div className="mb-3">
                <h3 className="text-sm font-medium text-zinc-700">
                  Poids et dimensions
                </h3>

                <p className="mt-0.5 text-xs text-zinc-400">
                  Les valeurs sont exprimées en kg et cm.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {/* Weight */}
                <div>
                  <label
                    htmlFor="weight"
                    className="mb-1.5 block text-xs font-medium text-zinc-600"
                  >
                    Poids (kg)
                  </label>

                  <input
                    id="weight"
                    type="number"
                    min="0"
                    step="0.001"
                    value={weight}
                    onChange={(e) =>
                      setWeight(
                        e.target.value,
                      )
                    }
                    placeholder="Ex: 50"
                    disabled={
                      createMutation.isPending
                    }
                    className="h-10 w-full rounded-lg border border-zinc-200 px-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-zinc-50"
                  />
                </div>

                {/* Length */}
                <div>
                  <label
                    htmlFor="length"
                    className="mb-1.5 block text-xs font-medium text-zinc-600"
                  >
                    Longueur (cm)
                  </label>

                  <input
                    id="length"
                    type="number"
                    min="0"
                    step="0.001"
                    value={length}
                    onChange={(e) =>
                      setLength(
                        e.target.value,
                      )
                    }
                    placeholder="Ex: 50"
                    disabled={
                      createMutation.isPending
                    }
                    className="h-10 w-full rounded-lg border border-zinc-200 px-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-zinc-50"
                  />
                </div>

                {/* Width */}
                <div>
                  <label
                    htmlFor="width"
                    className="mb-1.5 block text-xs font-medium text-zinc-600"
                  >
                    Largeur (cm)
                  </label>

                  <input
                    id="width"
                    type="number"
                    min="0"
                    step="0.001"
                    value={width}
                    onChange={(e) =>
                      setWidth(
                        e.target.value,
                      )
                    }
                    placeholder="Ex: 40"
                    disabled={
                      createMutation.isPending
                    }
                    className="h-10 w-full rounded-lg border border-zinc-200 px-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-zinc-50"
                  />
                </div>

                {/* Height */}
                <div>
                  <label
                    htmlFor="height"
                    className="mb-1.5 block text-xs font-medium text-zinc-600"
                  >
                    Hauteur (cm)
                  </label>

                  <input
                    id="height"
                    type="number"
                    min="0"
                    step="0.001"
                    value={height}
                    onChange={(e) =>
                      setHeight(
                        e.target.value,
                      )
                    }
                    placeholder="Ex: 30"
                    disabled={
                      createMutation.isPending
                    }
                    className="h-10 w-full rounded-lg border border-zinc-200 px-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-zinc-50"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 border-t border-zinc-200 px-6 py-4">
            <button
              type="button"
              onClick={handleClose}
              disabled={createMutation.isPending}
              className="cursor-pointer rounded-lg border border-zinc-200 px-4 py-2 text-sm font-medium text-zinc-700 transition hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Annuler
            </button>

            <button
              type="submit"
              disabled={createMutation.isPending}
              className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {createMutation.isPending && (
                <Loader2
                  size={16}
                  className="animate-spin"
                />
              )}

              {createMutation.isPending
                ? "Création..."
                : "Créer le package"}
            </button>
          </div>
        </form>
      </aside>
    </div>
  );
}

