"use client";

import {
  Calendar,
  Loader2,
  Package,
  X,
} from "lucide-react";
import {
  FormEvent,
  useEffect,
  useState,
} from "react";
import { usePricings } from "@/app/hooks/usePricing";
import { useCreateShipment } from "@/app/hooks/useShipments";

import type {
  CreateShipmentInput,
  TransportMethod,
} from "@/app/types/shipment.types";
import { useCustomers } from "@/app/hooks/useCustomers";
import { useWarehouses } from "@/app/hooks/useWarehouses";
import { SearchableSelect } from "./SearchableSelect";

type CreateShipmentDrawerProps = {
  open: boolean;
  onClose: () => void;
};

const transportOptions: {
  value: TransportMethod;
  label: string;
}[] = [
  {
    value: "AIR",
    label: "Aérien",
  },
  {
    value: "SEA",
    label: "Maritime",
  },
  {
    value: "ROAD",
    label: "Routier",
  },
  {
    value: "RAIL",
    label: "Ferroviaire",
  },
];

function formatPricingType(
  type: string,
) {
  const labels: Record<
    string,
    string
  > = {
    PER_KG: "Par kg",
    PER_CBM: "Par m³",
    FIXED: "Forfait",
  };

  return labels[type] ?? type;
}

export function CreateShipmentDrawer({
  open,
  onClose,
}: CreateShipmentDrawerProps) {
  const [customerId, setCustomerId] =
    useState("");

  const [warehouseId, setWarehouseId] =
    useState("");

  const [pricingRuleId, setPricingRuleId] =
    useState("");

  const [origin, setOrigin] =
    useState("");

  const [destination, setDestination] =
    useState("");

  const [transportMethod, setTransportMethod] =
    useState<TransportMethod>("ROAD");

  const [description, setDescription] =
    useState("");

  const [estimatedArrival, setEstimatedArrival] =
    useState("");

  const {
    data: customers = [],
    isLoading: customersLoading,
  } = useCustomers();

  const {
    data: warehouses = [],
    isLoading: warehousesLoading,
  } = useWarehouses();

  const {
    data: pricingRules = [],
    isLoading: pricingLoading,
  } = usePricings();

  const createShipmentMutation =
    useCreateShipment();

  useEffect(() => {
    if (!open) {
      return;
    }

    setCustomerId("");
    setWarehouseId("");
    setPricingRuleId("");
    setOrigin("");
    setDestination("");
    setTransportMethod("ROAD");
    setDescription("");
    setEstimatedArrival("");
  }, [open]);

  useEffect(() => {
    if (!open) {
      return;
    }

    const originalOverflow =
      document.body.style.overflow;

    document.body.style.overflow =
      "hidden";

    return () => {
      document.body.style.overflow =
        originalOverflow;
    };
  }, [open]);

  if (!open) {
    return null;
  }

  const activePricingRules =
    pricingRules.filter(
      (pricing) =>
        pricing.isActive,
    );

  const customerOptions =
    customers.map((customer) => ({
      value: customer.id,
      label: customer.name,
      description:
        customer.email ??
        customer.phone ??
        "Aucune information",
    }));

  const warehouseOptions =
    warehouses
      .filter(
        (warehouse) =>
          warehouse.isActive,
      )
      .map((warehouse) => ({
        value: warehouse.id,
        label: warehouse.name,
        description: warehouse.code,
      }));

  const pricingOptions =
    activePricingRules.map(
      (pricing) => ({
        value: pricing.id,
        label: pricing.name,
        description: `${pricing.origin || "Toutes origines"} → ${
          pricing.destination ||
          "Toutes destinations"
        } · ${pricing.price} ${
          pricing.currency
        }`,
      }),
    );

  const selectedPricing =
    activePricingRules.find(
      (pricing) =>
        pricing.id ===
        pricingRuleId,
    );

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    if (
      !customerId ||
      !origin.trim() ||
      !destination.trim() ||
      !pricingRuleId
    ) {
      return;
    }

    const data: CreateShipmentInput = {
      customerId,

      warehouseId:
        warehouseId || null,

      pricingRuleId,

      origin: origin.trim(),

      destination:
        destination.trim(),

      transportMethod,

      description:
        description.trim() || null,

      estimatedArrival:
        estimatedArrival
          ? new Date(
              estimatedArrival,
            ).toISOString()
          : null,
    };

    try {
      await createShipmentMutation.mutateAsync(
        data,
      );

      onClose();
    } catch {
      // L'état isError de la mutation
      // affiche le message dans le drawer.
    }
  }

  return (
    <div className="fixed inset-0 z-50">
      {/* Overlay */}
      <button
        type="button"
        aria-label="Fermer"
        onClick={() => {
          if (
            !createShipmentMutation.isPending
          ) {
            onClose();
          }
        }}
        className="absolute inset-0 cursor-default bg-slate-950/30 backdrop-blur-[1px]"
      />

      {/* Drawer */}
      <aside className="absolute right-0 top-0 flex h-full w-full max-w-xl flex-col bg-white shadow-2xl">
        {/* Header */}
        <div className="flex shrink-0 items-center justify-between border-b border-slate-200 px-5 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50">
              <Package className="h-5 w-5 text-[#1677FF]" />
            </div>

            <div>
              <h2 className="text-base font-semibold text-slate-900">
                Nouvelle expédition
              </h2>

              <p className="mt-0.5 text-xs text-slate-500">
                Créez une nouvelle expédition.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={
              createShipmentMutation.isPending
            }
            className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="flex min-h-0 flex-1 flex-col"
        >
          {/* Content */}
          <div className="min-h-0 flex-1 overflow-y-auto">
            <div className="space-y-5 p-5">
              {/* Client */}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                  Client
                  <span className="ml-1 text-red-500">
                    *
                  </span>
                </label>

                <SearchableSelect
                  value={customerId}
                  onChange={
                    setCustomerId
                  }
                  options={
                    customerOptions
                  }
                  placeholder="Sélectionner un client"
                  searchPlaceholder="Rechercher un client..."
                  emptyMessage="Aucun client trouvé."
                  disabled={
                    customersLoading ||
                    createShipmentMutation.isPending
                  }
                />

                {customersLoading && (
                  <p className="mt-1.5 text-xs text-slate-400">
                    Chargement des clients...
                  </p>
                )}
              </div>

              {/* Warehouse */}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                  Entrepôt
                  <span className="ml-1 text-xs font-normal text-slate-400">
                    (optionnel)
                  </span>
                </label>

                <SearchableSelect
                  value={warehouseId}
                  onChange={
                    setWarehouseId
                  }
                  options={
                    warehouseOptions
                  }
                  placeholder="Aucun entrepôt"
                  searchPlaceholder="Rechercher un entrepôt..."
                  emptyMessage="Aucun entrepôt trouvé."
                  disabled={
                    warehousesLoading ||
                    createShipmentMutation.isPending
                  }
                />

                {warehousesLoading && (
                  <p className="mt-1.5 text-xs text-slate-400">
                    Chargement des entrepôts...
                  </p>
                )}
              </div>

              {/* Route */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">
                    Origine
                    <span className="ml-1 text-red-500">
                      *
                    </span>
                  </label>

                  <input
                    type="text"
                    value={origin}
                    onChange={(event) =>
                      setOrigin(
                        event.target.value,
                      )
                    }
                    placeholder="Ex. Guangzhou"
                    disabled={
                      createShipmentMutation.isPending
                    }
                    required
                    className="h-10 w-full rounded-lg border border-slate-200 px-3 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-[#1677FF] focus:ring-2 focus:ring-[#1677FF]/10 disabled:bg-slate-50"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">
                    Destination
                    <span className="ml-1 text-red-500">
                      *
                    </span>
                  </label>

                  <input
                    type="text"
                    value={destination}
                    onChange={(event) =>
                      setDestination(
                        event.target.value,
                      )
                    }
                    placeholder="Ex. Libreville"
                    disabled={
                      createShipmentMutation.isPending
                    }
                    required
                    className="h-10 w-full rounded-lg border border-slate-200 px-3 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-[#1677FF] focus:ring-2 focus:ring-[#1677FF]/10 disabled:bg-slate-50"
                  />
                </div>
              </div>

              {/* Transport */}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                  Méthode de transport
                  <span className="ml-1 text-red-500">
                    *
                  </span>
                </label>

                <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                  {transportOptions.map(
                    (option) => {
                      const selected =
                        transportMethod ===
                        option.value;

                      return (
                        <button
                          key={
                            option.value
                          }
                          type="button"
                          disabled={
                            createShipmentMutation.isPending
                          }
                          onClick={() =>
                            setTransportMethod(
                              option.value,
                            )
                          }
                          className={`h-10 rounded-lg border px-3 text-sm font-medium transition ${
                            selected
                              ? "border-[#1677FF] bg-blue-50 text-[#1677FF]"
                              : "border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50"
                          }`}
                        >
                          {
                            option.label
                          }
                        </button>
                      );
                    },
                  )}
                </div>
              </div>

              {/* Pricing */}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                  Règle tarifaire
                  <span className="ml-1 text-red-500">
                    *
                  </span>
                </label>

                <SearchableSelect
                  value={
                    pricingRuleId
                  }
                  onChange={
                    setPricingRuleId
                  }
                  options={
                    pricingOptions
                  }
                  placeholder="Sélectionner une règle tarifaire"
                  searchPlaceholder="Rechercher une règle..."
                  emptyMessage="Aucune règle tarifaire trouvée."
                  disabled={
                    pricingLoading ||
                    createShipmentMutation.isPending
                  }
                />

                {pricingLoading && (
                  <p className="mt-1.5 text-xs text-slate-400">
                    Chargement des tarifs...
                  </p>
                )}
              </div>

              {/* Selected pricing */}
              {selectedPricing && (
                <div className="rounded-lg border border-blue-100 bg-blue-50/50 p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-slate-800">
                        {
                          selectedPricing.name
                        }
                      </p>

                      <p className="mt-1 text-xs text-slate-500">
                        {
                          selectedPricing.origin
                        }{" "}
                        →{" "}
                        {
                          selectedPricing.destination
                        }
                      </p>

                      <p className="mt-1 text-xs text-slate-400">
                        {formatPricingType(
                          selectedPricing.pricingType,
                        )}
                      </p>
                    </div>

                    <div className="shrink-0 text-right">
                      <p className="text-sm font-semibold text-[#1677FF]">
                        {
                          selectedPricing.price
                        }{" "}
                        {
                          selectedPricing.currency
                        }
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Estimated arrival */}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                  Arrivée estimée
                  <span className="ml-1 text-xs font-normal text-slate-400">
                    (optionnel)
                  </span>
                </label>

                <div className="relative">
                  <Calendar className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                  <input
                    type="datetime-local"
                    value={
                      estimatedArrival
                    }
                    onChange={(event) =>
                      setEstimatedArrival(
                        event.target.value,
                      )
                    }
                    disabled={
                      createShipmentMutation.isPending
                    }
                    className="h-10 w-full rounded-lg border border-slate-200 bg-white pl-9 pr-3 text-sm text-slate-700 outline-none transition focus:border-[#1677FF] focus:ring-2 focus:ring-[#1677FF]/10 disabled:bg-slate-50"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                  Description
                  <span className="ml-1 text-xs font-normal text-slate-400">
                    (optionnel)
                  </span>
                </label>

                <textarea
                  value={description}
                  onChange={(event) =>
                    setDescription(
                      event.target.value,
                    )
                  }
                  rows={4}
                  maxLength={2000}
                  disabled={
                    createShipmentMutation.isPending
                  }
                  placeholder="Informations complémentaires..."
                  className="w-full resize-none rounded-lg border border-slate-200 px-3 py-2.5 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-[#1677FF] focus:ring-2 focus:ring-[#1677FF]/10 disabled:bg-slate-50"
                />

                <div className="mt-1 flex justify-end">
                  <span className="text-xs text-slate-400">
                    {description.length}
                    /2000
                  </span>
                </div>
              </div>

              {/* Error */}
              {createShipmentMutation.isError && (
                <div className="rounded-lg border border-red-100 bg-red-50 px-4 py-3">
                  <p className="text-sm font-medium text-red-700">
                    Impossible de créer
                    l'expédition.
                  </p>

                  <p className="mt-1 text-xs text-red-500">
                    Vérifiez les
                    informations saisies
                    puis réessayez.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="flex shrink-0 items-center justify-end gap-2 border-t border-slate-200 bg-white px-5 py-4">
            <button
              type="button"
              onClick={onClose}
              disabled={
                createShipmentMutation.isPending
              }
              className="h-10 rounded-lg border border-slate-200 bg-white px-4 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Annuler
            </button>

            <button
              type="submit"
              disabled={
                createShipmentMutation.isPending
              }
              className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-[#1677FF] px-4 text-sm font-semibold text-white transition hover:bg-[#0B5ED7] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {createShipmentMutation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Création...
                </>
              ) : (
                "Créer l'expédition"
              )}
            </button>
          </div>
        </form>
      </aside>
    </div>
  );
}