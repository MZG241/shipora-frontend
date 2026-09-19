"use client";

import type { Package } from "@/app/types/package.types";

import {
  X,
  Package as PackageIcon,
  User,
  Truck,
  MapPin,
  ArrowRight,
} from "lucide-react";

type PackageDetailsModalProps = {
  package: Package | null;
  onClose: () => void;
};

export default function PackageDetailsModal({
  package: pkg,
  onClose,
}: PackageDetailsModalProps) {
  if (!pkg) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-xl">
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-zinc-200 bg-white px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
              <PackageIcon size={19} />
            </div>

            <div>
              <h2 className="text-lg font-semibold text-zinc-900">
                Détails du package
              </h2>

              <p className="text-xs text-zinc-500">
                {pkg.trackingCode}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-zinc-500 transition hover:bg-zinc-100"
          >
            <X size={19} />
          </button>
        </div>

        {/* Content */}
        <div className="space-y-6 p-6">
          {/* =========================
              PACKAGE
          ========================= */}

          <section>
            <div className="mb-4 flex items-center gap-2">
              <PackageIcon
                size={17}
                className="text-blue-600"
              />

              <h3 className="text-sm font-semibold text-zinc-900">
                Informations du package
              </h3>
            </div>

            <div className="rounded-xl border border-zinc-200 bg-zinc-50/50 p-4">
              <div className="grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-2">
                <Info
                  label="Article"
                  value={pkg.itemName}
                />

                <Info
                  label="Quantité"
                  value={String(pkg.quantity)}
                />

                <Info
                  label="Poids"
                  value={
                    pkg.weight
                      ? `${Number(pkg.weight)} kg`
                      : "—"
                  }
                />

                <Info
                  label="Statut"
                  value={getStatusLabel(pkg.status)}
                />

                <Info
                  label="Longueur"
                  value={
                    pkg.length
                      ? `${Number(pkg.length)} cm`
                      : "—"
                  }
                />

                <Info
                  label="Largeur"
                  value={
                    pkg.width
                      ? `${Number(pkg.width)} cm`
                      : "—"
                  }
                />

                <Info
                  label="Hauteur"
                  value={
                    pkg.height
                      ? `${Number(pkg.height)} cm`
                      : "—"
                  }
                />

                <Info
                  label="Tracking code"
                  value={pkg.trackingCode}
                />
              </div>

              {pkg.description && (
                <div className="mt-5 border-t border-zinc-200 pt-4">
                  <p className="text-xs text-zinc-400">
                    Description
                  </p>

                  <p className="mt-1 text-sm leading-6 text-zinc-700">
                    {pkg.description}
                  </p>
                </div>
              )}
            </div>
          </section>

          {/* =========================
              CUSTOMER
          ========================= */}

          <section>
            <div className="mb-4 flex items-center gap-2">
              <User
                size={17}
                className="text-blue-600"
              />

              <h3 className="text-sm font-semibold text-zinc-900">
                Informations du client
              </h3>
            </div>

            <div className="rounded-xl border border-zinc-200 bg-zinc-50/50 p-4">
              <div className="grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-2">
                <Info
                  label="Nom"
                  value={pkg.customer.name}
                />

                <Info
                  label="Email"
                  value={pkg.customer.email}
                />

                <Info
                  label="Téléphone"
                  value={pkg.customer.phone ?? "—"}
                />

                <Info
                  label="Ville"
                  value={pkg.customer.city ?? "—"}
                />

                <Info
                  label="Pays"
                  value={pkg.customer.country ?? "—"}
                />

                <Info
                  label="Adresse"
                  value={pkg.customer.address ?? "—"}
                />
              </div>
            </div>
          </section>

          {/* =========================
              SHIPMENT
          ========================= */}

          <section>
            <div className="mb-4 flex items-center gap-2">
              <Truck
                size={17}
                className="text-blue-600"
              />

              <h3 className="text-sm font-semibold text-zinc-900">
                Expédition
              </h3>
            </div>

            <div className="rounded-xl border border-zinc-200 p-4">
              <div className="mb-4">
                <p className="text-xs text-zinc-400">
                  Numéro de tracking
                </p>

                <p className="mt-1 font-mono text-sm font-semibold text-zinc-900">
                  {pkg.shipment.trackingNumber}
                </p>
              </div>

              <div className="grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-2">
                <Info
                  label="Origine"
                  value={pkg.shipment.origin}
                />

                <Info
                  label="Destination"
                  value={pkg.shipment.destination}
                />

                <Info
                  label="Mode de transport"
                  value={pkg.shipment.transportMethod}
                />

                <Info
                  label="Statut"
                  value={pkg.shipment.status}
                />

                <Info
                  label="Arrivée estimée"
                  value={
                    pkg.shipment.estimatedArrival
                      ? formatDate(
                          pkg.shipment.estimatedArrival,
                        )
                      : "—"
                  }
                />

                <Info
                  label="Livré le"
                  value={
                    pkg.shipment.deliveredAt
                      ? formatDate(
                          pkg.shipment.deliveredAt,
                        )
                      : "—"
                  }
                />
              </div>
            </div>
          </section>

          {/* =========================
              ROUTE
          ========================= */}

         {/* =========================
    ROUTE
========================= */}

<section>
  <div className="mb-4 flex items-center gap-2">
    <MapPin
      size={17}
      className="text-blue-600"
    />

    <h3 className="text-sm font-semibold text-zinc-900">
      Itinéraire
    </h3>
  </div>

  <div className="rounded-xl border border-zinc-200 bg-zinc-50/50 p-5">
    <div className="flex items-center justify-around gap-6">
      {/* Départ */}
      <div className="min-w-0 flex-1 text-center">
        <p className="text-xs text-zinc-400">
          Départ
        </p>

        <p className="mt-1 truncate text-sm font-semibold text-zinc-900">
          {pkg.shipment.origin}
        </p>
      </div>

      {/* Flèche */}
      <div className="flex shrink-0 items-center justify-center text-zinc-400">
        <ArrowRight size={22} />
      </div>

      {/* Destination */}
      <div className="min-w-0 flex-1 text-center">
        <p className="text-xs text-zinc-400">
          Destination
        </p>

        <p className="mt-1 truncate text-sm font-semibold text-zinc-900">
          {pkg.shipment.destination}
        </p>
      </div>
    </div>
  </div>
</section>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 flex justify-end border-t border-zinc-200 bg-zinc-50/80 px-6 py-4">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
}

/* =========================
   INFO
========================= */

function Info({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="min-w-0">
      <p className="text-xs text-zinc-400">
        {label}
      </p>

      <p className="mt-1 truncate text-sm font-medium text-zinc-800">
        {value}
      </p>
    </div>
  );
}

/* =========================
   STATUS
========================= */

function getStatusLabel(
  status: Package["status"],
) {
  const labels: Record<
    Package["status"],
    string
  > = {
    RECEIVED: "Reçu",
    IN_WAREHOUSE: "En entrepôt",
    IN_TRANSIT: "En transit",
    DELIVERED: "Livré",
    DAMAGED: "Endommagé",
    LOST: "Perdu",
  };

  return labels[status];
}

/* =========================
   DATE
========================= */

function formatDate(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date);
}