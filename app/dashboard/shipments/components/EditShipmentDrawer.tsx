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

import { useCustomers } from "@/app/hooks/useCustomers";
import { usePricings } from "@/app/hooks/usePricing";
import { useUpdateShipment } from "@/app/hooks/useShipments";
import { useWarehouses } from "@/app/hooks/useWarehouses";

import type {
  Shipment,
  ShipmentStatus,
  TransportMethod,
  UpdateShipmentInput,
} from "@/app/types/shipment.types";

import { SearchableSelect } from "./SearchableSelect";

type EditShipmentDrawerProps = {
  shipment: Shipment | null;
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

const statusOptions: {
  value: ShipmentStatus;
  label: string;
}[] = [
  {
    value: "PENDING",
    label: "En attente",
  },
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
    value: "ARRIVED",
    label: "Arrivé",
  },
  {
    value: "CUSTOMS",
    label: "En douane",
  },
  {
    value: "READY_FOR_PICKUP",
    label: "Prêt à récupérer",
  },
  {
    value: "PICKED_UP",
    label: "Récupéré",
  },
  {
    value: "CANCELLED",
    label: "Annulé",
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

function formatDateTimeLocal(
  date: string | null,
) {
  if (!date) {
    return "";
  }

  const parsed = new Date(date);

  if (Number.isNaN(parsed.getTime())) {
    return "";
  }

  const year =
    parsed.getFullYear();

  const month = String(
    parsed.getMonth() + 1,
  ).padStart(2, "0");

  const day = String(
    parsed.getDate(),
  ).padStart(2, "0");

  const hours = String(
    parsed.getHours(),
  ).padStart(2, "0");

  const minutes = String(
    parsed.getMinutes(),
  ).padStart(2, "0");

  return `${year}-${month}-${day}T${hours}:${minutes}`;
}

export function EditShipmentDrawer({
  shipment,
  onClose,
}: EditShipmentDrawerProps) {
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

  const [status, setStatus] =
    useState<ShipmentStatus>("PENDING");

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

  const updateShipmentMutation =
    useUpdateShipment();

  useEffect(() => {
    if (!shipment) {
      return;
    }

    setCustomerId(
      shipment.customerId,
    );

    setWarehouseId(
      shipment.warehouseId ?? "",
    );

    setPricingRuleId(
      shipment.pricingRuleId,
    );

    setOrigin(
      shipment.origin,
    );

    setDestination(
      shipment.destination,
    );

    setTransportMethod(
      shipment.transportMethod,
    );

    setStatus(
      shipment.status,
    );

    setDescription(
      shipment.description ?? "",
    );

    setEstimatedArrival(
      formatDateTimeLocal(
        shipment.estimatedArrival,
      ),
    );
  }, [shipment]);

  useEffect(() => {
    if (!shipment) {
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
  }, [shipment]);

  if (!shipment) {
    return null;
  }

  /*
   * On conserve l'ID dans une constante
   * après le guard afin que TypeScript
   * sache qu'il n'est pas null.
   */
  const shipmentId = shipment.id;

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

    const data: UpdateShipmentInput = {
      customerId,

      warehouseId:
        warehouseId || null,

      pricingRuleId,

      origin:
        origin.trim(),

      destination:
        destination.trim(),

      transportMethod,

      status,

      description:
        description.trim() ||
        null,

      estimatedArrival:
        estimatedArrival
          ? new Date(
              estimatedArrival,
            ).toISOString()
          : null,
    };

    try {
      await updateShipmentMutation.mutateAsync(
        {
          id: shipmentId,
          data,
        },
      );

      onClose();
    } catch {
      // L'erreur est affichée via isError.
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
            !updateShipmentMutation.isPending
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
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-50">
              <Package className="h-5 w-5 text-[#1677FF]" />
            </div>

            <div className="min-w-0">
              <h2 className="text-base font-semibold text-slate-900">
                Modifier l'expédition
              </h2>

              <p className="mt-0.5 truncate text-xs text-slate-500">
                {shipment.trackingNumber}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={
              updateShipmentMutation.isPending
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
              {/* Tracking number */}
              <div className="rounded-lg border border-slate-200 bg-slate-50/60 px-4 py-3">
                <p className="text-xs font-medium text-slate-400">
                  Numéro de suivi
                </p>

                <p className="mt-1 text-sm font-semibold text-slate-900">
                  {shipment.trackingNumber}
                </p>

                <p className="mt-1 text-xs text-slate-400">
                  Le numéro de suivi ne peut
                  pas être modifié.
                </p>
              </div>

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
                    updateShipmentMutation.isPending
                  }
                />
              </div>

              {/* Entrepôt */}
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
                    updateShipmentMutation.isPending
                  }
                />
              </div>

              {/* Origine / Destination */}
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
                    disabled={
                      updateShipmentMutation.isPending
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
                    disabled={
                      updateShipmentMutation.isPending
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
                            updateShipmentMutation.isPending
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

              {/* Règle tarifaire */}
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
                    updateShipmentMutation.isPending
                  }
                />
              </div>

              {/* Pricing preview */}
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
                          selectedPricing.origin ||
                          "Toutes origines"
                        }{" "}
                        →{" "}
                        {
                          selectedPricing.destination ||
                          "Toutes destinations"
                        }
                      </p>

                      <p className="mt-1 text-xs text-slate-400">
                        {formatPricingType(
                          selectedPricing.pricingType,
                        )}
                      </p>
                    </div>

                    <p className="shrink-0 text-sm font-semibold text-[#1677FF]">
                      {
                        Number(selectedPricing.price)
                      }{" "}
                      {
                        selectedPricing.currency
                      }
                    </p>
                  </div>
                </div>
              )}

              {/* Statut */}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                  Statut
                </label>

                <select
                  value={status}
                  onChange={(event) =>
                    setStatus(
                      event.target
                        .value as ShipmentStatus,
                    )
                  }
                  disabled={
                    updateShipmentMutation.isPending
                  }
                  className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none transition focus:border-[#1677FF] focus:ring-2 focus:ring-[#1677FF]/10 disabled:bg-slate-50"
                >
                  {statusOptions.map(
                    (option) => (
                      <option
                        key={
                          option.value
                        }
                        value={
                          option.value
                        }
                      >
                        {option.label}
                      </option>
                    ),
                  )}
                </select>
              </div>

              {/* Arrivée estimée */}
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
                      updateShipmentMutation.isPending
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
                    updateShipmentMutation.isPending
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
              {updateShipmentMutation.isError && (
                <div className="rounded-lg border border-red-100 bg-red-50 px-4 py-3">
                  <p className="text-sm font-medium text-red-700">
                    Impossible de modifier
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
                updateShipmentMutation.isPending
              }
              className="h-10 rounded-lg border border-slate-200 bg-white px-4 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Annuler
            </button>

            <button
              type="submit"
              disabled={
                updateShipmentMutation.isPending
              }
              className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-[#1677FF] px-4 text-sm font-semibold text-white transition hover:bg-[#0B5ED7] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {updateShipmentMutation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Enregistrement...
                </>
              ) : (
                "Enregistrer"
              )}
            </button>
          </div>
        </form>
      </aside>
    </div>
  );
}