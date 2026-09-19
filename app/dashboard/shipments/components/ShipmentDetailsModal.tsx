"use client";

import {
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  Clock3,
  DollarSign,
  FileText,
  MapPin,
  Package,
  Plane,
  Ship,
  Truck,
  TrainFront,
  User,
  Warehouse,
  X,
  Mail,
  Phone,
  Tag,
} from "lucide-react";

import type {
  ShipmentDetails,
  ShipmentStatus,
  TransportMethod,
} from "@/app/types/shipment.types";

type ShipmentDetailsModalProps = {
  shipment: ShipmentDetails | null;
  isLoading: boolean;
  isError: boolean;
  onClose: () => void;
};

function getStatusLabel(status: ShipmentStatus) {
  const labels: Record<ShipmentStatus, string> = {
    PENDING: "En attente",
    RECEIVED: "Reçue",
    IN_WAREHOUSE: "En entrepôt",
    IN_TRANSIT: "En transit",
    ARRIVED: "Arrivée",
    CUSTOMS: "Douane",
    READY_FOR_PICKUP: "Prête au retrait",
    PICKED_UP: "Récupérée",
    CANCELLED: "Annulée",
  };

  return labels[status];
}

function getStatusClasses(status: ShipmentStatus) {
  switch (status) {
    case "PENDING":
      return "bg-amber-50 text-amber-700 border-amber-200";
    case "RECEIVED":
      return "bg-blue-50 text-blue-700 border-blue-200";
    case "IN_WAREHOUSE":
      return "bg-violet-50 text-violet-700 border-violet-200";
    case "IN_TRANSIT":
      return "bg-indigo-50 text-indigo-700 border-indigo-200";
    case "ARRIVED":
      return "bg-emerald-50 text-emerald-700 border-emerald-200";
    case "CUSTOMS":
      return "bg-orange-50 text-orange-700 border-orange-200";
    case "READY_FOR_PICKUP":
      return "bg-cyan-50 text-cyan-700 border-cyan-200";
    case "PICKED_UP":
      return "bg-green-50 text-green-700 border-green-200";
    case "CANCELLED":
      return "bg-red-50 text-red-700 border-red-200";
    default:
      return "bg-slate-50 text-slate-700 border-slate-200";
  }
}

function getTransportLabel(transportMethod: TransportMethod) {
  const labels: Record<TransportMethod, string> = {
    AIR: "Aérien",
    SEA: "Maritime",
    ROAD: "Routier",
    RAIL: "Ferroviaire",
  };

  return labels[transportMethod];
}

function getTransportIcon(transportMethod: TransportMethod) {
  switch (transportMethod) {
    case "AIR":
      return Plane;
    case "SEA":
      return Ship;
    case "ROAD":
      return Truck;
    case "RAIL":
      return TrainFront;
    default:
      return Truck;
  }
}

function getPricingTypeLabel(
  pricingType: ShipmentDetails["pricingRule"]["pricingType"],
) {
  switch (pricingType) {
    case "PER_KG":
      return "Par kilogramme";
    case "PER_CBM":
      return "Par m³";
    case "FIXED":
      return "Forfait fixe";
    default:
      return pricingType;
  }
}

function formatDate(date: string | null) {
  if (!date) {
    return "Non définie";
  }

  return new Intl.DateTimeFormat("fr-FR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date));
}

function formatPrice(price: string, currency: string) {
  const numericPrice = Number(price);

  if (Number.isNaN(numericPrice)) {
    return `${price} ${currency}`;
  }

  return `${new Intl.NumberFormat("fr-FR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(numericPrice)} ${currency}`;
}

function DetailItem({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
        {label}
      </p>

      <div className="mt-1 text-sm font-medium text-slate-800">
        {children}
      </div>
    </div>
  );
}

export function ShipmentDetailsModal({
  shipment,
  isLoading,
  isError,
  onClose,
}: ShipmentDetailsModalProps) {
  if (!shipment && !isLoading && !isError) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <button
        type="button"
        aria-label="Fermer"
        onClick={onClose}
        className="absolute inset-0 cursor-default bg-slate-950/40 backdrop-blur-[1px]"
      />

      <div className="relative flex max-h-[90vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl">
        <div className="flex shrink-0 items-start justify-between border-b border-slate-200 px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-50">
              <Package className="h-5 w-5 text-orange-500" />
            </div>

            <div>
              <h2 className="text-lg font-semibold text-slate-900">
                Détails de l'expédition
              </h2>

              <p className="mt-0.5 text-sm text-slate-500">
                Informations complètes sur cette expédition
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {isLoading && (
          <div className="flex min-h-[350px] items-center justify-center">
            <div className="text-center">
              <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-slate-200 border-t-[#1677FF]" />

              <p className="mt-4 text-sm text-slate-500">
                Chargement des détails...
              </p>
            </div>
          </div>
        )}

        {!isLoading && isError && (
          <div className="flex min-h-[350px] items-center justify-center px-6">
            <div className="w-full rounded-xl border border-red-100 bg-red-50 p-5 text-center">
              <p className="text-sm font-semibold text-red-700">
                Impossible de charger les détails.
              </p>

              <p className="mt-1 text-xs text-red-500">
                Veuillez fermer cette fenêtre et réessayer.
              </p>
            </div>
          </div>
        )}

        {!isLoading && !isError && shipment && (
          <>
            <div className="overflow-y-auto px-6 py-6">
              <div className="space-y-6">
                <section className="rounded-xl border border-slate-200 bg-slate-50/60 p-5">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                        Numéro de suivi
                      </p>

                      <p className="mt-1 text-xl font-bold tracking-tight text-slate-900">
                        {shipment.trackingNumber}
                      </p>
                    </div>

                    <span
                      className={`inline-flex w-fit items-center rounded-full border px-3 py-1.5 text-xs font-semibold ${getStatusClasses(
                        shipment.status,
                      )}`}
                    >
                      {getStatusLabel(shipment.status)}
                    </span>
                  </div>

                  <div className="mt-5 grid gap-4 sm:grid-cols-3">
                    <DetailItem label="Transport">
                      <div className="flex items-center gap-2">
                        {(() => {
                          const TransportIcon = getTransportIcon(
                            shipment.transportMethod,
                          );

                          return (
                            <TransportIcon className="h-4 w-4 text-orange-500" />
                          );
                        })()}

                        <span>
                          {getTransportLabel(
                            shipment.transportMethod,
                          )}
                        </span>
                      </div>
                    </DetailItem>

                    <DetailItem label="Créée le">
                      <div className="flex items-center gap-2">
                        <CalendarDays className="h-4 w-4 text-slate-400" />

                        <span>
                          {formatDate(shipment.createdAt)}
                        </span>
                      </div>
                    </DetailItem>

                    <DetailItem label="Arrivée estimée">
                      <div className="flex items-center gap-2">
                        <Clock3 className="h-4 w-4 text-slate-400" />

                        <span>
                          {shipment.estimatedArrival
                            ? formatDate(shipment.estimatedArrival)
                            : "Non définie"}
                        </span>
                      </div>
                    </DetailItem>
                  </div>
                </section>

                <section>
                  <div className="mb-4 flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-orange-500" />

                    <h3 className="text-sm font-semibold text-slate-900">
                      Itinéraire
                    </h3>
                  </div>

                  <div className="grid items-center gap-4 rounded-xl border border-slate-200 p-5 sm:grid-cols-[1fr_auto_1fr]">
                    <div>
                      <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                        Origine
                      </p>

                      <p className="mt-1 text-base font-semibold text-slate-900">
                        {shipment.origin}
                      </p>
                    </div>

                    <div className="hidden h-9 w-9 items-center justify-center rounded-full bg-orange-50 sm:flex">
                      <ArrowRight className="h-4 w-4 text-orange-500" />
                    </div>

                    <div>
                      <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                        Destination
                      </p>

                      <p className="mt-1 text-base font-semibold text-slate-900">
                        {shipment.destination}
                      </p>
                    </div>
                  </div>
                </section>

                <div className="grid gap-5 lg:grid-cols-2">
                  <section className="rounded-xl border border-slate-200 p-5">
                    <div className="mb-5 flex items-center gap-2">
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50">
                        <User className="h-4 w-4 text-blue-500" />
                      </div>

                      <div>
                        <h3 className="text-sm font-semibold text-slate-900">
                          Client
                        </h3>

                        <p className="text-xs text-slate-400">
                          Informations du client
                        </p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <DetailItem label="Nom">
                        {shipment.customer.name}
                      </DetailItem>

                      {shipment.customer.email && (
                        <DetailItem label="Email">
                          <div className="flex items-center gap-2">
                            <Mail className="h-4 w-4 text-slate-400" />

                            <span className="break-all">
                              {shipment.customer.email}
                            </span>
                          </div>
                        </DetailItem>
                      )}

                      {shipment.customer.phone && (
                        <DetailItem label="Téléphone">
                          <div className="flex items-center gap-2">
                            <Phone className="h-4 w-4 text-slate-400" />

                            <span>{shipment.customer.phone}</span>
                          </div>
                        </DetailItem>
                      )}

                      {!shipment.customer.email &&
                        !shipment.customer.phone && (
                          <p className="text-sm text-slate-400">
                            Aucune coordonnée disponible.
                          </p>
                        )}
                    </div>
                  </section>

                  <section className="rounded-xl border border-slate-200 p-5">
                    <div className="mb-5 flex items-center gap-2">
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-violet-50">
                        <Warehouse className="h-4 w-4 text-violet-500" />
                      </div>

                      <div>
                        <h3 className="text-sm font-semibold text-slate-900">
                          Entrepôt
                        </h3>

                        <p className="text-xs text-slate-400">
                          Point de stockage
                        </p>
                      </div>
                    </div>

                    {shipment.warehouse ? (
                      <div className="space-y-4">
                        <DetailItem label="Nom">
                          {shipment.warehouse.name}
                        </DetailItem>

                        <DetailItem label="Code">
                          <span className="inline-flex rounded-md bg-slate-100 px-2 py-1 font-mono text-xs font-semibold text-slate-700">
                            {shipment.warehouse.code}
                          </span>
                        </DetailItem>

                        {(shipment.warehouse.city ||
                          shipment.warehouse.country) && (
                          <DetailItem label="Localisation">
                            {[
                              shipment.warehouse.city,
                              shipment.warehouse.country,
                            ]
                              .filter(Boolean)
                              .join(", ")}
                          </DetailItem>
                        )}
                      </div>
                    ) : (
                      <div className="rounded-lg bg-slate-50 px-4 py-3">
                        <p className="text-sm text-slate-500">
                          Aucun entrepôt associé à cette expédition.
                        </p>
                      </div>
                    )}
                  </section>
                </div>

                <section className="rounded-xl border border-slate-200 p-5">
                  <div className="mb-5 flex items-center gap-2">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-50">
                      <DollarSign className="h-4 w-4 text-emerald-500" />
                    </div>

                    <div>
                      <h3 className="text-sm font-semibold text-slate-900">
                        Règle tarifaire
                      </h3>

                      <p className="text-xs text-slate-400">
                        Tarif appliqué à l'expédition
                      </p>
                    </div>
                  </div>

                  <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                    <DetailItem label="Nom">
                      {shipment.pricingRule.name}
                    </DetailItem>

                    <DetailItem label="Type de tarif">
                      <div className="flex items-center gap-2">
                        <Tag className="h-4 w-4 text-slate-400" />

                        <span>
                          {getPricingTypeLabel(
                            shipment.pricingRule.pricingType,
                          )}
                        </span>
                      </div>
                    </DetailItem>

                    <DetailItem label="Tarif">
                      <span className="font-semibold text-emerald-600">
                        {formatPrice(
                          shipment.pricingRule.price,
                          shipment.pricingRule.currency,
                        )}
                      </span>
                    </DetailItem>

                    <DetailItem label="Origine">
                      {shipment.pricingRule.origin ??
                        "Toutes les origines"}
                    </DetailItem>

                    <DetailItem label="Destination">
                      {shipment.pricingRule.destination ??
                        "Toutes les destinations"}
                    </DetailItem>

                    <DetailItem label="Transport">
                      {shipment.pricingRule.transportMethod
                        ? getTransportLabel(
                            shipment.pricingRule
                              .transportMethod as TransportMethod,
                          )
                        : "Tous les transports"}
                    </DetailItem>
                  </div>

                  <div className="mt-5 border-t border-slate-100 pt-4">
                    <div className="flex items-center gap-2">
                      <CheckCircle2
                        className={`h-4 w-4 ${
                          shipment.pricingRule.isActive
                            ? "text-emerald-500"
                            : "text-red-500"
                        }`}
                      />

                      <span
                        className={`text-sm font-medium ${
                          shipment.pricingRule.isActive
                            ? "text-emerald-700"
                            : "text-red-700"
                        }`}
                      >
                        {shipment.pricingRule.isActive
                          ? "Règle tarifaire active"
                          : "Règle tarifaire inactive"}
                      </span>
                    </div>
                  </div>
                </section>

                {shipment.description && (
                  <section>
                    <div className="mb-4 flex items-center gap-2">
                      <FileText className="h-4 w-4 text-orange-500" />

                      <h3 className="text-sm font-semibold text-slate-900">
                        Description
                      </h3>
                    </div>

                    <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-5">
                      <p className="whitespace-pre-wrap text-sm leading-6 text-slate-600">
                        {shipment.description}
                      </p>
                    </div>
                  </section>
                )}

                {shipment.deliveredAt && (
                  <section className="rounded-xl border border-emerald-200 bg-emerald-50 p-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-100">
                        <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                      </div>

                      <div>
                        <p className="text-sm font-semibold text-emerald-800">
                          Expédition livrée
                        </p>

                        <p className="mt-0.5 text-xs text-emerald-600">
                          Livrée le{" "}
                          {formatDate(shipment.deliveredAt)}
                        </p>
                      </div>
                    </div>
                  </section>
                )}
              </div>
            </div>

            <div className="flex shrink-0 justify-end border-t border-slate-200 bg-slate-50/50 px-6 py-4">
              <button
                type="button"
                onClick={onClose}
                className="h-10 rounded-lg border border-slate-200 bg-white px-5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
              >
                Fermer
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}