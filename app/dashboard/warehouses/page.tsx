"use client";

import { useState } from "react";
import {
  Plus,
  RefreshCw,
  Search,
} from "lucide-react";

import { useWarehouses } from "@/app/hooks/useWarehouses";
import type { Warehouse } from "@/app/types/warehouse.type";
import { WarehousesTable } from "../components/WarehousesTable";
import { WarehouseFormModal } from "../components/WarehouseFormModal";
import { DeleteWarehouseModal } from "../components/DeleteWarehouseModal";
import { WarehousePagination } from "../components/WarehousePagination";



export default function WarehousesPage() {
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] =
    useState(1);

  const [formModalOpen, setFormModalOpen] =
    useState(false);

  const [selectedWarehouse, setSelectedWarehouse] =
    useState<Warehouse | null>(null);

  const [
    deleteModalOpen,
    setDeleteModalOpen,
  ] = useState(false);

  const {
    data: warehouses = [],
    isLoading,
    isError,
    refetch,
    isFetching,
    pagination,
  } = useWarehouses(search, currentPage);

  /*
   * Retour à la première page
   * lorsque la recherche change.
   */
  function handleAdd() {
    setSelectedWarehouse(null);
    setFormModalOpen(true);
  }

  function handleEdit(
    warehouse: Warehouse,
  ) {
    setSelectedWarehouse(warehouse);
    setFormModalOpen(true);
  }

  function handleDelete(
    warehouse: Warehouse,
  ) {
    setSelectedWarehouse(warehouse);
    setDeleteModalOpen(true);
  }

  function handleCloseFormModal() {
    setFormModalOpen(false);
    setSelectedWarehouse(null);
  }

  function handleCloseDeleteModal() {
    setDeleteModalOpen(false);
    setSelectedWarehouse(null);
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-950">
            Entrepôts
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Gérez les entrepôts de votre
            organisation.
          </p>
        </div>

        <button
          type="button"
          onClick={handleAdd}
          className="flex h-10 items-center justify-center gap-2 rounded-lg bg-[#1677FF] px-4 text-sm font-medium text-white transition hover:bg-[#0B5ED7]"
        >
          <Plus className="h-4 w-4" />
          Ajouter un entrepôt
        </button>
      </div>

      {/* Main card */}
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
        {/* Toolbar */}
        <div className="flex flex-col gap-3 border-b border-slate-200 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
          <div className="relative w-full sm:max-w-sm">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

            <input
              type="search"
              value={search}
              onChange={(event) =>
                (setSearch(event.target.value), setCurrentPage(1))
              }
              placeholder="Rechercher un entrepôt..."
              className="h-10 w-full rounded-lg border border-slate-200 bg-white pl-9 pr-3 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-[#1677FF] focus:ring-2 focus:ring-[#1677FF]/10"
            />
          </div>

          <button
            type="button"
            onClick={() => refetch()}
            disabled={isFetching}
            className="flex h-10 items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-3 text-sm font-medium text-slate-600 transition hover:bg-slate-50 hover:text-slate-900 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <RefreshCw
              className={`h-4 w-4 ${
                isFetching
                  ? "animate-spin"
                  : ""
              }`}
            />

            <span className="hidden sm:inline">
              Actualiser
            </span>
          </button>
        </div>

        {/* Count */}
        {!isLoading && !isError && (
          <div className="border-b border-slate-100 px-4 py-3 sm:px-5">
              <p className="text-xs text-slate-500 sm:text-sm">
                <span className="font-medium text-slate-700">
                  {pagination?.total ?? warehouses.length}
                </span>{" "}
                {(pagination?.total ?? warehouses.length) > 1
                  ? "entrepôts"
                  : "entrepôt"}
            </p>
          </div>
        )}

        {/* Content */}
        {isLoading ? (
          <WarehouseTableSkeleton />
        ) : isError ? (
          <WarehouseError
            onRetry={() => refetch()}
          />
        ) : (
          <>
            <WarehousesTable
              warehouses={
                warehouses
              }
              onEdit={handleEdit}
              onDelete={handleDelete}
            />

            <WarehousePagination
              currentPage={currentPage}
              totalPages={pagination?.totalPages ?? 1}
              onPageChange={
                setCurrentPage
              }
            />
          </>
        )}
      </div>

      {/* Add / Edit */}
      <WarehouseFormModal
        open={formModalOpen}
        warehouse={selectedWarehouse}
        onClose={
          handleCloseFormModal
        }
      />

      {/* Delete */}
      <DeleteWarehouseModal
        open={deleteModalOpen}
        warehouse={selectedWarehouse}
        onClose={
          handleCloseDeleteModal
        }
      />
    </div>
  );
}

/*
 * Loading skeleton
 */
function WarehouseTableSkeleton() {
  return (
    <div className="overflow-hidden">
      <div className="hidden border-b border-slate-200 bg-slate-50/70 px-5 py-3 lg:grid lg:grid-cols-6 lg:gap-4">
        {Array.from(
          { length: 6 },
          (_, index) => (
            <div
              key={index}
              className="h-3 animate-pulse rounded bg-slate-200"
            />
          ),
        )}
      </div>

      <div className="divide-y divide-slate-100">
        {Array.from(
          { length: 6 },
          (_, index) => (
            <div
              key={index}
              className="flex items-center gap-4 px-5 py-5"
            >
              <div className="h-9 w-9 shrink-0 animate-pulse rounded-lg bg-slate-200" />

              <div className="min-w-0 flex-1 space-y-2">
                <div className="h-4 w-40 animate-pulse rounded bg-slate-200" />
                <div className="h-3 w-24 animate-pulse rounded bg-slate-100" />
              </div>

              <div className="hidden h-6 w-20 animate-pulse rounded bg-slate-100 sm:block" />

              <div className="hidden h-8 w-24 animate-pulse rounded bg-slate-100 md:block" />

              <div className="h-8 w-16 animate-pulse rounded bg-slate-100" />
            </div>
          ),
        )}
      </div>
    </div>
  );
}

/*
 * Error state
 */
function WarehouseError({
  onRetry,
}: {
  onRetry: () => void;
}) {
  return (
    <div className="flex min-h-[300px] flex-col items-center justify-center px-6 text-center">
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-50">
        <RefreshCw className="h-5 w-5 text-red-500" />
      </div>

      <h3 className="text-sm font-semibold text-slate-900">
        Impossible de charger les entrepôts
      </h3>

      <p className="mt-1 max-w-sm text-sm text-slate-500">
        Une erreur est survenue lors du
        chargement des données.
      </p>

      <button
        type="button"
        onClick={onRetry}
        className="mt-4 flex h-9 items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
      >
        <RefreshCw className="h-4 w-4" />
        Réessayer
      </button>
    </div>
  );
}