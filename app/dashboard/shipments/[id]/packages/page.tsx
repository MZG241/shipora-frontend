"use client";

import { use, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Package as PackageIcon,
  Plus,
  RefreshCw,
} from "lucide-react";

import {
  usePackage,
  usePackagesByShipment,
} from "@/app/hooks/usePackages";

import { useShipment } from "@/app/hooks/useShipments";

import type {
  Package,
  PackageBase,
} from "@/app/types/package.types";

import PackageFormModal from "@/app/dashboard/packages/components/PackageFormModal";
import DeletePackageModal from "@/app/dashboard/packages/components/DeletePackageModal";
import PackageDetailsModal from "@/app/dashboard/packages/components/PackageDetailsModal";

export default function ShipmentPackagesPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: shipmentId } = use(params);

  /* =========================
     PACKAGES
  ========================= */

  const {
    data: packages,
    isLoading: isLoadingPackages,
    isError: isPackagesError,
    refetch: refetchPackages,
    isFetching: isFetchingPackages,
  } = usePackagesByShipment(shipmentId);

  /* =========================
     SHIPMENT
  ========================= */

  const {
    data: shipment,
    isLoading: isLoadingShipment,
  } = useShipment(shipmentId);

  /* =========================
     FORM
  ========================= */

  const [isFormOpen, setIsFormOpen] =
    useState(false);

  const [packageToEdit, setPackageToEdit] =
    useState<PackageBase | null>(null);

  /* =========================
     DETAILS
  ========================= */

  const [selectedPackageId, setSelectedPackageId] =
    useState<string | null>(null);

  const {
    data: selectedPackage,
    isLoading: isLoadingSelectedPackage,
  } = usePackage(
    selectedPackageId ?? "",
  );

  /* =========================
     DELETE
  ========================= */

  const [packageToDelete, setPackageToDelete] =
    useState<PackageBase | null>(null);

  /* =========================
     CREATE
  ========================= */

  function handleCreate() {
    setPackageToEdit(null);
    setIsFormOpen(true);
  }

  /* =========================
     EDIT
  ========================= */

  function handleEdit(pkg: PackageBase) {
    setSelectedPackageId(null);
    setPackageToEdit(pkg);
    setIsFormOpen(true);
  }

  /* =========================
     CLOSE FORM
  ========================= */

  function handleCloseForm() {
    setIsFormOpen(false);
    setPackageToEdit(null);
  }

  /* =========================
     VIEW PACKAGE
  ========================= */

  function handleView(pkg: PackageBase) {
    setSelectedPackageId(pkg.id);
  }

  /* =========================
     CLOSE DETAILS
  ========================= */

  function handleCloseDetails() {
    setSelectedPackageId(null);
  }

  return (
    <>
      <div className="space-y-6 p-6">
        {/* =========================
            HEADER
        ========================= */}

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <Link
              href="/dashboard/shipments"
              className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-lg border border-zinc-200 bg-white text-zinc-600 transition hover:bg-zinc-50"
            >
              <ArrowLeft size={18} />
            </Link>

            <div>
              <h1 className="text-xl font-semibold text-zinc-900">
                Packages
              </h1>

              <p className="mt-1 text-sm text-zinc-500">
                Gérez les packages associés à ce
                shipment.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleCreate}
            className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700"
          >
            <Plus size={17} />
            Ajouter un package
          </button>
        </div>

        {/* =========================
            SHIPMENT INFORMATION
        ========================= */}

        <div className="rounded-xl border border-zinc-200 bg-white">
          <div className="grid gap-5 px-5 py-5 sm:grid-cols-3">
            <div>
              <p className="text-xs font-medium text-zinc-500">
                Shipment
              </p>

              <p className="mt-1 font-mono text-sm font-semibold text-zinc-900">
                {isLoadingShipment
                  ? "Chargement..."
                  : shipment?.trackingNumber ?? "—"}
              </p>
            </div>

            <div>
              <p className="text-xs font-medium text-zinc-500">
                Route
              </p>

              <p className="mt-1 text-sm font-medium text-zinc-900">
                {isLoadingShipment
                  ? "Chargement..."
                  : shipment
                    ? `${shipment.origin} → ${shipment.destination}`
                    : "—"}
              </p>
            </div>

            <div>
              <p className="text-xs font-medium text-zinc-500">
                Packages
              </p>

              <p className="mt-1 text-sm font-semibold text-zinc-900">
                {isLoadingPackages
                  ? "Chargement..."
                  : packages?.length ?? 0}
              </p>
            </div>
          </div>
        </div>

        {/* =========================
            PACKAGES TABLE
        ========================= */}

        <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white">
          {/* TABLE HEADER */}

          <div className="flex items-center justify-between border-b border-zinc-200 px-5 py-4">
            <div>
              <h2 className="text-sm font-semibold text-zinc-900">
                Liste des packages
              </h2>

              {!isLoadingPackages &&
                !isPackagesError && (
                  <p className="mt-0.5 text-xs text-zinc-500">
                    {packages?.length ?? 0} package
                    {(packages?.length ?? 0) > 1
                      ? "s"
                      : ""}
                  </p>
                )}
            </div>

            <button
              type="button"
              onClick={() => refetchPackages()}
              disabled={isFetchingPackages}
              className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg border border-zinc-200 text-zinc-500 transition hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-50"
              title="Actualiser"
            >
              <RefreshCw
                size={16}
                className={
                  isFetchingPackages
                    ? "animate-spin"
                    : ""
                }
              />
            </button>
          </div>

          {/* =========================
              LOADING
          ========================= */}

          {isLoadingPackages && (
            <div className="divide-y divide-zinc-100">
              {Array.from({ length: 4 }).map(
                (_, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-4 px-5 py-5"
                  >
                    <div className="h-10 w-10 animate-pulse rounded-lg bg-zinc-100" />

                    <div className="flex-1 space-y-2">
                      <div className="h-4 w-48 animate-pulse rounded bg-zinc-100" />

                      <div className="h-3 w-64 animate-pulse rounded bg-zinc-100" />
                    </div>

                    <div className="h-7 w-20 animate-pulse rounded-full bg-zinc-100" />
                  </div>
                ),
              )}
            </div>
          )}

          {/* =========================
              ERROR
          ========================= */}

          {isPackagesError &&
            !isLoadingPackages && (
              <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-50 text-red-500">
                  <PackageIcon size={22} />
                </div>

                <h3 className="text-sm font-semibold text-zinc-900">
                  Impossible de charger les packages
                </h3>

                <p className="mt-1 max-w-sm text-sm text-zinc-500">
                  Une erreur est survenue lors du
                  chargement des packages de ce
                  shipment.
                </p>

                <button
                  type="button"
                  onClick={() => refetchPackages()}
                  className="mt-4 inline-flex cursor-pointer items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700"
                >
                  <RefreshCw size={16} />
                  Réessayer
                </button>
              </div>
            )}

          {/* =========================
              EMPTY
          ========================= */}

          {!isLoadingPackages &&
            !isPackagesError &&
            packages?.length === 0 && (
              <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                  <PackageIcon size={26} />
                </div>

                <h3 className="text-sm font-semibold text-zinc-900">
                  Aucun package
                </h3>

                <p className="mt-1 max-w-sm text-sm text-zinc-500">
                  Ce shipment ne contient encore
                  aucun package.
                </p>

                <button
                  type="button"
                  onClick={handleCreate}
                  className="mt-5 inline-flex cursor-pointer items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700"
                >
                  <Plus size={17} />
                  Ajouter un package
                </button>
              </div>
            )}

          {/* =========================
              TABLE
          ========================= */}

          {!isLoadingPackages &&
            !isPackagesError &&
            packages &&
            packages.length > 0 && (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[950px]">
                  <thead>
                    <tr className="border-b border-zinc-200 bg-zinc-50">
                      <th className="px-5 py-3 text-left text-xs font-medium uppercase tracking-wide text-zinc-500">
                        Package
                      </th>

                      <th className="px-5 py-3 text-left text-xs font-medium uppercase tracking-wide text-zinc-500">
                        Tracking
                      </th>

                      <th className="px-5 py-3 text-left text-xs font-medium uppercase tracking-wide text-zinc-500">
                        Quantité
                      </th>

                      <th className="px-5 py-3 text-left text-xs font-medium uppercase tracking-wide text-zinc-500">
                        Poids
                      </th>

                      <th className="px-5 py-3 text-left text-xs font-medium uppercase tracking-wide text-zinc-500">
                        Dimensions
                      </th>

                      <th className="px-5 py-3 text-left text-xs font-medium uppercase tracking-wide text-zinc-500">
                        Statut
                      </th>

                      <th className="px-5 py-3 text-right text-xs font-medium uppercase tracking-wide text-zinc-500">
                        Actions
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-zinc-100">
                    {packages.map((pkg) => (
                      <tr
                        key={pkg.id}
                        className="transition hover:bg-zinc-50"
                      >
                        {/* PACKAGE */}

                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                              <PackageIcon size={17} />
                            </div>

                            <div className="min-w-0">
                              <p className="truncate text-sm font-medium text-zinc-900">
                                {pkg.itemName}
                              </p>

                              {pkg.description && (
                                <p className="mt-0.5 max-w-[220px] truncate text-xs text-zinc-500">
                                  {pkg.description}
                                </p>
                              )}
                            </div>
                          </div>
                        </td>

                        {/* TRACKING */}

                        <td className="px-5 py-4">
                          <span className="font-mono text-xs font-medium text-zinc-700">
                            {pkg.trackingCode}
                          </span>
                        </td>

                        {/* QUANTITY */}

                        <td className="px-5 py-4 text-sm text-zinc-700">
                          {pkg.quantity}
                        </td>

                        {/* WEIGHT */}

                        <td className="px-5 py-4 text-sm text-zinc-700">
                          {pkg.weight
                            ? `${Number(pkg.weight)} kg`
                            : "—"}
                        </td>

                        {/* DIMENSIONS */}

                        <td className="px-5 py-4 text-sm text-zinc-700">
                          {pkg.length &&
                          pkg.width &&
                          pkg.height
                            ? `${Number(pkg.length)} × ${Number(pkg.width)} × ${Number(pkg.height)} cm`
                            : "—"}
                        </td>

                        {/* STATUS */}

                        <td className="px-5 py-4">
                          <PackageStatus
                            status={pkg.status}
                          />
                        </td>

                        {/* ACTIONS */}

                        <td className="px-5 py-4">
                          <div className="flex justify-end gap-1">
                            {/* VIEW */}

                            <button
                              type="button"
                              onClick={() =>
                                handleView(pkg)
                              }
                              disabled={
                                isLoadingSelectedPackage &&
                                selectedPackageId ===
                                  pkg.id
                              }
                              className="cursor-pointer rounded-lg px-3 py-2 text-xs font-medium text-zinc-600 transition hover:bg-blue-50 hover:text-blue-600 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                              {isLoadingSelectedPackage &&
                              selectedPackageId ===
                                pkg.id
                                ? "Chargement..."
                                : "Voir"}
                            </button>

                            {/* EDIT */}

                            <button
                              type="button"
                              onClick={() =>
                                handleEdit(pkg)
                              }
                              className="cursor-pointer rounded-lg px-3 py-2 text-xs font-medium text-zinc-600 transition hover:bg-blue-50 hover:text-blue-600"
                            >
                              Modifier
                            </button>

                            {/* DELETE */}

                            <button
                              type="button"
                              onClick={() =>
                                setPackageToDelete(pkg)
                              }
                              className="cursor-pointer rounded-lg px-3 py-2 text-xs font-medium text-zinc-600 transition hover:bg-red-50 hover:text-red-600"
                            >
                              Supprimer
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
        </div>
      </div>

      {/* =========================
          CREATE / EDIT
      ========================= */}

      <PackageFormModal
        isOpen={isFormOpen}
        shipmentId={shipmentId}
        packageToEdit={packageToEdit}
        onClose={handleCloseForm}
      />

      {/* =========================
          DETAILS
      ========================= */}

      <PackageDetailsModal
        package={selectedPackage ?? null}
        onClose={handleCloseDetails}
      />

      {/* =========================
          DELETE
      ========================= */}

      <DeletePackageModal
        package={packageToDelete}
        onClose={() =>
          setPackageToDelete(null)
        }
      />
    </>
  );
}

/* =========================
   PACKAGE STATUS
========================= */

function PackageStatus({
  status,
}: {
  status: Package["status"];
}) {
  const config = {
    RECEIVED: {
      label: "Reçu",
      className:
        "bg-blue-50 text-blue-700",
    },

    IN_WAREHOUSE: {
      label: "En entrepôt",
      className:
        "bg-amber-50 text-amber-700",
    },

    IN_TRANSIT: {
      label: "En transit",
      className:
        "bg-indigo-50 text-indigo-700",
    },

    DELIVERED: {
      label: "Livré",
      className:
        "bg-green-50 text-green-700",
    },

    DAMAGED: {
      label: "Endommagé",
      className:
        "bg-orange-50 text-orange-700",
    },

    LOST: {
      label: "Perdu",
      className:
        "bg-red-50 text-red-700",
    },
  } as const;

  const current = config[status];

  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${current.className}`}
    >
      {current.label}
    </span>
  );
}