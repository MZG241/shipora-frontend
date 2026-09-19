
"use client";

import { useState } from "react";
import {
  Plus,
  RefreshCw,
  Search,
  Users,
} from "lucide-react";

import {
  useCustomers,
} from "@/app/hooks/useCustomers";

import type { Customer } from "@/app/types/customer.type";
import { CustomersTable } from "../components/CustomersTable";
import { CustomerFormModal } from "../components/CustomerFormModal";
import { CustomerPagination } from "../components/CustomerPagination";
import { DeleteCustomerModal } from "../components/DeleteCustomerModal";
import { CustomerHistoryDrawer } from "../components/CustomerHistoryDrawer";



export default function CustomersPage() {
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] =
    useState(1);

  const [formModalOpen, setFormModalOpen] =
    useState(false);

  const [selectedCustomer, setSelectedCustomer] =
    useState<Customer | null>(null);

  const [deleteModalOpen, setDeleteModalOpen] =
    useState(false);

  const [historyCustomerId, setHistoryCustomerId] =
    useState<string | null>(null);

  const {
    data: customers = [],
    isLoading,
    isFetching,
    isError,
    refetch,
    pagination,
  } = useCustomers(search, currentPage);

  function handleAddCustomer() {
    setSelectedCustomer(null);
    setFormModalOpen(true);
  }

  function handleEditCustomer(
    customer: Customer,
  ) {
    setSelectedCustomer(customer);
    setFormModalOpen(true);
  }

  function handleDeleteCustomer(
    customer: Customer,
  ) {
    setSelectedCustomer(customer);
    setDeleteModalOpen(true);
  }

  function handleCloseFormModal() {
    setFormModalOpen(false);
    setSelectedCustomer(null);
  }

  function handleCloseDeleteModal() {
    setDeleteModalOpen(false);
    setSelectedCustomer(null);
  }

  function handleViewHistory(customer: Customer) {
    setHistoryCustomerId(customer.id);
  }

  return (
    <>
      <div className="space-y-6">
        {/* Page header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="mb-2 flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#EAF3FF]">
                <Users className="h-5 w-5 text-[#1677FF]" />
              </div>

              <h1 className="text-2xl font-bold tracking-tight text-slate-950">
                Clients
              </h1>
            </div>

            <p className="text-sm text-slate-500">
              Gérez les clients de votre
              organisation.
            </p>
          </div>

          <button
            type="button"
            onClick={handleAddCustomer}
            className="flex h-10 items-center justify-center gap-2 rounded-lg bg-[#1677FF] px-4 text-sm font-medium text-white transition hover:bg-[#0B5ED7]"
          >
            <Plus className="h-4 w-4" />
            Ajouter un client
          </button>
        </div>

        {/* Main card */}
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
          {/* Toolbar */}
          <div className="flex flex-col gap-3 border-b border-slate-200 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
            {/* Search */}
            <div className="relative w-full sm:max-w-sm">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

              <input
                type="search"
                value={search}
                onChange={(event) =>
                  (setSearch(event.target.value), setCurrentPage(1))
                }
                placeholder="Rechercher un client..."
                className="h-10 w-full rounded-lg border border-slate-200 bg-white pl-9 pr-3 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-[#1677FF] focus:ring-2 focus:ring-[#1677FF]/10"
              />
            </div>

            {/* Refresh */}
            <button
              type="button"
              onClick={() => refetch()}
              disabled={isFetching}
              className="flex h-10 items-center justify-center gap-2 rounded-lg border border-slate-200 px-3 text-sm font-medium text-slate-600 transition hover:bg-slate-50 hover:text-slate-900 disabled:cursor-not-allowed disabled:opacity-50"
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

          {/* Loading */}
          {isLoading ? (
            <CustomersTableSkeleton />
          ) : isError ? (
            <div className="flex min-h-[300px] flex-col items-center justify-center px-6 text-center">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-50">
                <Users className="h-5 w-5 text-red-500" />
              </div>

              <h3 className="text-sm font-semibold text-slate-900">
                Impossible de charger les clients
              </h3>

              <p className="mt-1 max-w-sm text-sm text-slate-500">
                Une erreur est survenue lors du
                chargement des clients.
              </p>

              <button
                type="button"
                onClick={() => refetch()}
                className="mt-4 rounded-lg bg-[#1677FF] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#0B5ED7]"
              >
                Réessayer
              </button>
            </div>
          ) : (
            <>
              <CustomersTable
                customers={customers}
                onEdit={handleEditCustomer}
                onDelete={handleDeleteCustomer}
                onViewHistory={handleViewHistory}
              />

              <CustomerPagination
                currentPage={currentPage}
                totalPages={pagination?.totalPages ?? 1}
                onPageChange={setCurrentPage}
              />
            </>
          )}
        </div>

        {/* Results count */}
        {!isLoading && !isError && (
          <div className="text-xs text-slate-400">
              {pagination?.total ?? customers.length}{" "}
              {(pagination?.total ?? customers.length) > 1
              ? "clients"
              : "client"}{" "}
            au total
          </div>
        )}
      </div>

      {/* Add / Edit modal */}
      <CustomerFormModal
        open={formModalOpen}
        customer={selectedCustomer}
        onClose={handleCloseFormModal}
      />

      {/* Delete modal */}
      <DeleteCustomerModal
        open={deleteModalOpen}
        customer={selectedCustomer}
        onClose={handleCloseDeleteModal}
      />

      <CustomerHistoryDrawer
        customerId={historyCustomerId}
        onClose={() => setHistoryCustomerId(null)}
      />
    </>
  );
}

/*
 * Skeleton du tableau
 */
function CustomersTableSkeleton() {
  return (
    <div className="overflow-x-auto">
      <div className="min-w-[850px]">
        {/* Header */}
        <div className="grid grid-cols-[2fr_2fr_1.5fr_1fr_80px] border-b border-slate-200 bg-slate-50/70 px-5 py-3">
          {[
            "Client",
            "Contact",
            "Localisation",
            "Date",
            "Actions",
          ].map((item) => (
            <div
              key={item}
              className="text-xs font-semibold uppercase tracking-wide text-slate-400"
            >
              {item}
            </div>
          ))}
        </div>

        {/* Rows */}
        {Array.from({ length: 8 }).map(
          (_, index) => (
            <div
              key={index}
              className="grid grid-cols-[2fr_2fr_1.5fr_1fr_80px] items-center border-b border-slate-100 px-5 py-4"
            >
              {/* Client */}
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 animate-pulse rounded-full bg-slate-200" />

                <div className="space-y-2">
                  <div className="h-3 w-28 animate-pulse rounded bg-slate-200" />
                  <div className="h-2.5 w-14 animate-pulse rounded bg-slate-100" />
                </div>
              </div>

              {/* Contact */}
              <div className="space-y-2">
                <div className="h-3 w-36 animate-pulse rounded bg-slate-200" />
                <div className="h-2.5 w-24 animate-pulse rounded bg-slate-100" />
              </div>

              {/* Localisation */}
              <div className="space-y-2">
                <div className="h-3 w-20 animate-pulse rounded bg-slate-200" />
                <div className="h-2.5 w-16 animate-pulse rounded bg-slate-100" />
              </div>

              {/* Date */}
              <div className="h-3 w-20 animate-pulse rounded bg-slate-200" />

              {/* Actions */}
              <div className="flex justify-end gap-1">
                <div className="h-8 w-8 animate-pulse rounded-lg bg-slate-100" />
                <div className="h-8 w-8 animate-pulse rounded-lg bg-slate-100" />
              </div>
            </div>
          ),
        )}
      </div>
    </div>
  );
}

