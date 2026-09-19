"use client";

import {
  Plus,
  RefreshCw,
  Search,
  SlidersHorizontal,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import {
  usePricings,
} from "@/app/hooks/usePricing";

import type {
  PricingRule,
} from "@/app/types/pricing.type";

import {
  PricingTable,
} from "./components/PricingTable";

import {
  PricingFormModal,
} from "./components/PricingFormModal";

import {
  DeletePricingModal,
} from "./components/DeletePricingModal";

import {
  PricingPagination,
} from "./components/PricingPagination";

export default function PricingPage() {
  const [search, setSearch] =
    useState("");

  const [currentPage, setCurrentPage] =
    useState(1);

  const {
    data: pricings = [],
    isLoading,
    isError,
    refetch,
    isFetching,
    pagination,
  } = usePricings(search, currentPage);

  const [formOpen, setFormOpen] =
    useState(false);

  const [selectedPricing, setSelectedPricing] =
    useState<PricingRule | null>(null);

  const [deleteOpen, setDeleteOpen] =
    useState(false);

  /*
   * Recherche frontend.
   *
   * Le backend ne gère pas encore
   * la recherche, donc on filtre
   * temporairement côté frontend.
   */
  const filteredPricings = useMemo(() => {
    const query =
      search.trim().toLowerCase();

    if (!query) {
      return pricings;
    }

    return pricings.filter((pricing) => {
      return (
        pricing.name
          .toLowerCase()
          .includes(query) ||
        pricing.origin
          ?.toLowerCase()
          .includes(query) ||
        pricing.destination
          ?.toLowerCase()
          .includes(query) ||
        pricing.currency
          .toLowerCase()
          .includes(query)
      );
    });
  }, [pricings, search]);

  /*
   * Pagination frontend.
   */
  const totalPages = pagination?.totalPages ?? 1;

  const paginatedPricings = filteredPricings;

  /*
   * Revenir à la première page
   * lorsqu'une recherche change.
   */
  useEffect(() => {
    setCurrentPage(1);
  }, [search]);

  /*
   * Évite de rester sur une page
   * qui n'existe plus après une
   * suppression.
   */
  useEffect(() => {
    if (
      totalPages > 0 &&
      currentPage > totalPages
    ) {
      setCurrentPage(totalPages);
    }
  }, [
    currentPage,
    totalPages,
  ]);

  /*
   * Ouvrir le formulaire en création.
   */
  const handleCreate = () => {
    setSelectedPricing(null);
    setFormOpen(true);
  };

  /*
   * Ouvrir le formulaire en modification.
   */
  const handleEdit = (
    pricing: PricingRule,
  ) => {
    setSelectedPricing(pricing);
    setFormOpen(true);
  };

  /*
   * Fermer le formulaire.
   */
  const handleCloseForm = () => {
    setFormOpen(false);
    setSelectedPricing(null);
  };

  /*
   * Ouvrir la confirmation
   * de suppression.
   */
  const handleDelete = (
    pricing: PricingRule,
  ) => {
    setSelectedPricing(pricing);
    setDeleteOpen(true);
  };

  /*
   * Fermer la confirmation
   * de suppression.
   */
  const handleCloseDelete = () => {
    setDeleteOpen(false);
    setSelectedPricing(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
            Tarification
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Gérez les règles de tarification de vos
            expéditions.
          </p>
        </div>

        <button
          type="button"
          onClick={handleCreate}
          className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-[#1677FF] px-4 text-sm font-medium text-white transition-colors hover:bg-[#0B5ED7]"
        >
          <Plus className="h-4 w-4" />

          Nouveau tarif
        </button>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-sm">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

          <input
            type="text"
            value={search}
            onChange={(event) =>
              setSearch(
                event.target.value,
              )
            }
            placeholder="Rechercher un tarif..."
            className="h-10 w-full rounded-lg border border-slate-200 bg-white pl-9 pr-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#1677FF] focus:ring-2 focus:ring-[#1677FF]/10"
          />
        </div>

        <div className="flex items-center gap-2">
          {/* Refresh */}
          <button
            type="button"
            onClick={() => refetch()}
            disabled={isFetching}
            className="inline-flex h-10 items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
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

          {/* Filter */}
          <button
            type="button"
            className="inline-flex h-10 items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50"
          >
            <SlidersHorizontal className="h-4 w-4" />

            <span className="hidden sm:inline">
              Filtres
            </span>
          </button>
        </div>
      </div>

      {/* Count */}
      {!isLoading &&
        !isError && (
          <div className="flex items-center justify-between">
            <p className="text-sm text-slate-500">
              {pagination?.total ?? filteredPricings.length}{" "}
              {(pagination?.total ?? filteredPricings.length) > 1
                ? "tarifs"
                : "tarif"}
            </p>

            {search && (
              <button
                type="button"
                onClick={() =>
                  setSearch("")
                }
                className="text-sm font-medium text-[#1677FF] hover:underline"
              >
                Effacer la recherche
              </button>
            )}
          </div>
        )}

      {/* Loading */}
      {isLoading && (
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
          <div className="animate-pulse">
            <div className="h-12 border-b border-slate-200 bg-slate-50" />

            {Array.from({
              length: 8,
            }).map((_, index) => (
              <div
                key={index}
                className="flex h-[73px] items-center gap-6 border-b border-slate-100 px-6"
              >
                <div className="h-4 w-32 rounded bg-slate-200" />

                <div className="h-4 w-36 rounded bg-slate-200" />

                <div className="h-4 w-20 rounded bg-slate-200" />

                <div className="h-6 w-16 rounded bg-slate-200" />

                <div className="h-4 w-24 rounded bg-slate-200" />

                <div className="h-6 w-16 rounded-full bg-slate-200" />

                <div className="ml-auto h-8 w-20 rounded bg-slate-200" />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Error */}
      {isError && !isLoading && (
        <div className="flex min-h-[300px] items-center justify-center rounded-xl border border-red-200 bg-white">
          <div className="px-6 text-center">
            <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-red-50">
              <span className="text-sm font-semibold text-red-600">
                !
              </span>
            </div>

            <h2 className="mt-3 text-sm font-semibold text-slate-900">
              Impossible de charger les tarifs
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Une erreur est survenue lors de la
              récupération des données.
            </p>

            <button
              type="button"
              onClick={() => refetch()}
              className="mt-4 inline-flex h-9 items-center rounded-lg bg-[#1677FF] px-4 text-sm font-medium text-white transition-colors hover:bg-[#0B5ED7]"
            >
              Réessayer
            </button>
          </div>
        </div>
      )}

      {/* Table */}
      {!isLoading &&
        !isError && (
          <>
            <PricingTable
              pricings={
                paginatedPricings
              }
              onEdit={handleEdit}
              onDelete={handleDelete}
            />

            <PricingPagination
              currentPage={
                currentPage
              }
              totalPages={
                totalPages
              }
              onPageChange={
                setCurrentPage
              }
            />
          </>
        )}

      {/* Create / Edit Modal */}
      <PricingFormModal
        open={formOpen}
        pricing={selectedPricing}
        onClose={handleCloseForm}
      />

      {/* Delete Modal */}
      <DeletePricingModal
        open={deleteOpen}
        pricing={selectedPricing}
        onClose={
          handleCloseDelete
        }
      />
    </div>
  );
}

