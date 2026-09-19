"use client";

import { useState } from "react";

import {
  Package as PackageIcon,
  Plus,
  QrCode,
  RefreshCw,
  ScanLine,
  Search,
} from "lucide-react";

import { usePackages } from "@/app/hooks/usePackages";

import PackageDetailsModal from "./components/PackageDetailsModal";
import DeletePackageModal from "./components/DeletePackageModal";
import PackageFormDrawer from "./components/PackageFormDrawer";
import PackageQrCodeModal from "./components/PackageQrCodeModal";
import PackageScannerModal from "./components/PackageScannerModal";

import type {
  Package,
  PackageStatus,
} from "@/app/types/package.types";

export default function PackagesPage() {
  const {
    data: packages,
    isLoading,
    isError,
    refetch,
    isFetching,
  } = usePackages();

  const [search, setSearch] = useState("");

  const [statusFilter, setStatusFilter] =
    useState<PackageStatus | "ALL">("ALL");

  const [selectedPackage, setSelectedPackage] =
    useState<Package | null>(null);

  const [packageToDelete, setPackageToDelete] =
    useState<Package | null>(null);

  const [qrPackage, setQrPackage] =
    useState<Package | null>(null);

  const [isCreateOpen, setIsCreateOpen] =
    useState(false);

  const [isScannerOpen, setIsScannerOpen] =
    useState(false);

  const filteredPackages =
    packages?.filter((pkg) => {
      const value = search.toLowerCase();

      const matchesSearch =
        pkg.itemName
          .toLowerCase()
          .includes(value) ||
        pkg.trackingCode
          .toLowerCase()
          .includes(value) ||
        pkg.status
          .toLowerCase()
          .includes(value);

      const matchesStatus =
        statusFilter === "ALL" ||
        pkg.status === statusFilter;

      return matchesSearch && matchesStatus;
    }) ?? [];

  return (
    <>
      <div className="space-y-6 p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-xl font-semibold text-zinc-900">
              Packages
            </h1>

            <p className="mt-1 text-sm text-zinc-500">
              Consultez et gérez les packages de votre
              organisation.
            </p>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row">
            <button
              type="button"
              onClick={() =>
                setIsScannerOpen(true)
              }
              className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-blue-200 bg-blue-50 px-4 py-2.5 text-sm font-medium text-blue-700 transition hover:bg-blue-100"
            >
              <ScanLine size={17} />
              Scanner un package
            </button>

            <button
              type="button"
              onClick={() =>
                setIsCreateOpen(true)
              }
              className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700"
            >
              <Plus size={17} />
              Créer un package
            </button>
          </div>
        </div>

        <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white">
          <div className="flex flex-col gap-4 border-b border-zinc-200 px-5 py-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-col gap-3 sm:flex-row">
              <div className="relative w-full sm:w-80">
                <Search
                  size={17}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400"
                />

                <input
                  type="text"
                  placeholder="Rechercher un package..."
                  value={search}
                  onChange={(e) =>
                    setSearch(e.target.value)
                  }
                  className="h-10 w-full rounded-lg border border-zinc-200 pl-9 pr-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              <select
                value={statusFilter}
                onChange={(e) =>
                  setStatusFilter(
                    e.target.value as
                      | PackageStatus
                      | "ALL",
                  )
                }
                className="h-10 cursor-pointer rounded-lg border border-zinc-200 bg-white px-3 text-sm text-zinc-700 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              >
                <option value="ALL">
                  Tous les statuts
                </option>

                <option value="RECEIVED">
                  Reçu
                </option>

                <option value="IN_WAREHOUSE">
                  En entrepôt
                </option>

                <option value="IN_TRANSIT">
                  En transit
                </option>

                <option value="DELIVERED">
                  Livré
                </option>

                <option value="DAMAGED">
                  Endommagé
                </option>

                <option value="LOST">
                  Perdu
                </option>
              </select>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-sm text-zinc-500">
                {filteredPackages.length} package
                {filteredPackages.length > 1
                  ? "s"
                  : ""}
              </span>

              <button
                type="button"
                onClick={() => refetch()}
                disabled={isFetching}
                title="Actualiser"
                className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg border border-zinc-200 text-zinc-500 transition hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <RefreshCw
                  size={16}
                  className={
                    isFetching
                      ? "animate-spin"
                      : ""
                  }
                />
              </button>
            </div>
          </div>

          {isLoading && (
            <div className="divide-y divide-zinc-100">
              {Array.from({ length: 5 }).map(
                (_, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-4 px-5 py-4"
                  >
                    <div className="h-10 w-10 animate-pulse rounded-lg bg-zinc-100" />

                    <div className="flex-1 space-y-2">
                      <div className="h-4 w-40 animate-pulse rounded bg-zinc-100" />

                      <div className="h-3 w-56 animate-pulse rounded bg-zinc-100" />
                    </div>

                    <div className="h-6 w-20 animate-pulse rounded-full bg-zinc-100" />
                  </div>
                ),
              )}
            </div>
          )}

          {isError && !isLoading && (
            <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-50 text-red-500">
                <PackageIcon size={22} />
              </div>

              <h3 className="text-sm font-semibold text-zinc-900">
                Impossible de charger les packages
              </h3>

              <p className="mt-1 text-sm text-zinc-500">
                Une erreur est survenue lors du chargement.
              </p>

              <button
                type="button"
                onClick={() => refetch()}
                className="mt-4 cursor-pointer rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
              >
                Réessayer
              </button>
            </div>
          )}

          {!isLoading &&
            !isError &&
            packages?.length === 0 && (
              <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                  <PackageIcon size={26} />
                </div>

                <h3 className="text-sm font-semibold text-zinc-900">
                  Aucun package
                </h3>

                <p className="mt-1 text-sm text-zinc-500">
                  Aucun package n&apos;a encore été créé.
                </p>

                <button
                  type="button"
                  onClick={() =>
                    setIsCreateOpen(true)
                  }
                  className="mt-4 inline-flex cursor-pointer items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
                >
                  <Plus size={16} />
                  Créer un package
                </button>
              </div>
            )}

          {!isLoading &&
            !isError &&
            packages &&
            packages.length > 0 &&
            filteredPackages.length === 0 && (
              <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
                <Search
                  size={24}
                  className="mb-3 text-zinc-400"
                />

                <h3 className="text-sm font-semibold text-zinc-900">
                  Aucun résultat
                </h3>

                <p className="mt-1 text-sm text-zinc-500">
                  Aucun package ne correspond à vos
                  filtres.
                </p>
              </div>
            )}

          {!isLoading &&
            !isError &&
            filteredPackages.length > 0 && (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[1000px]">
                  <thead>
                    <tr className="border-b border-zinc-200 bg-zinc-50/70">
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
                        Statut
                      </th>

                      <th className="px-5 py-3 text-right text-xs font-medium uppercase tracking-wide text-zinc-500">
                        Actions
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-zinc-100">
                    {filteredPackages.map(
                      (pkg) => (
                        <tr
                          key={pkg.id}
                          className="transition hover:bg-zinc-50/60"
                        >
                          <td className="px-5 py-4">
                            <div className="flex items-center gap-3">
                              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                                <PackageIcon
                                  size={18}
                                />
                              </div>

                              <div>
                                <p className="text-sm font-medium text-zinc-900">
                                  {pkg.itemName}
                                </p>

                                {pkg.description && (
                                  <p className="mt-0.5 max-w-[250px] truncate text-xs text-zinc-500">
                                    {
                                      pkg.description
                                    }
                                  </p>
                                )}
                              </div>
                            </div>
                          </td>

                          <td className="px-5 py-4">
                            <span className="font-mono text-xs font-medium text-zinc-700">
                              {pkg.trackingCode}
                            </span>
                          </td>

                          <td className="px-5 py-4 text-sm text-zinc-700">
                            {pkg.quantity}
                          </td>

                          <td className="px-5 py-4 text-sm text-zinc-700">
                            {formatNumber(
                              pkg.weight,
                            )}

                            {pkg.weight
                              ? " kg"
                              : ""}
                          </td>

                          <td className="px-5 py-4">
                            <PackageStatus
                              status={pkg.status}
                            />
                          </td>

                          <td className="px-5 py-4">
                            <div className="flex justify-end gap-2">
                              <button
                                type="button"
                                onClick={() =>
                                  setSelectedPackage(
                                    pkg,
                                  )
                                }
                                className="cursor-pointer rounded-lg border border-zinc-200 px-3 py-1.5 text-xs font-medium text-zinc-700 transition hover:bg-zinc-50"
                              >
                                Voir
                              </button>

                              <button
                                type="button"
                                onClick={() =>
                                  setQrPackage(
                                    pkg,
                                  )
                                }
                                title="Afficher le QR code"
                                className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-blue-200 bg-blue-50 px-3 py-1.5 text-xs font-medium text-blue-700 transition hover:bg-blue-100"
                              >
                                <QrCode
                                  size={14}
                                />
                                QR
                              </button>

                              <button
                                type="button"
                                onClick={() =>
                                  setPackageToDelete(
                                    pkg,
                                  )
                                }
                                className="cursor-pointer rounded-lg border border-red-200 px-3 py-1.5 text-xs font-medium text-red-600 transition hover:bg-red-50"
                              >
                                Supprimer
                              </button>
                            </div>
                          </td>
                        </tr>
                      ),
                    )}
                  </tbody>
                </table>
              </div>
            )}
        </div>
      </div>

      <PackageFormDrawer
        isOpen={isCreateOpen}
        onClose={() =>
          setIsCreateOpen(false)
        }
      />

      <PackageScannerModal
        isOpen={isScannerOpen}
        onClose={() =>
          setIsScannerOpen(false)
        }
      />

      <PackageDetailsModal
        package={selectedPackage}
        onClose={() =>
          setSelectedPackage(null)
        }
      />

      <PackageQrCodeModal
        packageId={qrPackage?.id ?? ""}
        trackingCode={
          qrPackage?.trackingCode ?? ""
        }
        isOpen={!!qrPackage}
        onClose={() => setQrPackage(null)}
      />

      <DeletePackageModal
        package={packageToDelete}
        onClose={() =>
          setPackageToDelete(null)
        }
      />
    </>
  );
}

function formatNumber(
  value: string | null,
) {
  if (!value) {
    return "—";
  }

  const number = Number(value);

  if (Number.isNaN(number)) {
    return value;
  }

  return number.toString();
}

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