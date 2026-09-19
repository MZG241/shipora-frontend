"use client";

import {
  Plus,
  Search,
  Truck,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

import {
  useShipment,
  useShipments,
} from "@/app/hooks/useShipments";

import type { Shipment } from "@/app/types/shipment.types";
import { ShipmentsTable } from "./ShipmentsTable";
import { ShipmentDetailsModal } from "./ShipmentDetailsModal";
import { CreateShipmentDrawer } from "./CreateShipmentDrawer";
import { DeleteShipmentModal } from "./DeleteShipmentModal";
import { EditShipmentDrawer } from "./EditShipmentDrawer";

export default function ShipmentsPage() {
  const router = useRouter();

  const [search, setSearch] = useState("");

  const [currentPage, setCurrentPage] =
    useState(1);

  const [createDrawerOpen, setCreateDrawerOpen] =
    useState(false);

  const [selectedShipmentId, setSelectedShipmentId] =
    useState<string | null>(null);

  const [editingShipment, setEditingShipment] =
    useState<Shipment | null>(null);

  const [shipmentToDelete, setShipmentToDelete] =
    useState<Shipment | null>(null);

  const {
    data: shipments = [],
    isLoading,
    isError,
  } = useShipments(search);

  const {
    data: shipmentDetails,
    isLoading: isLoadingDetails,
    isError: isDetailsError,
  } = useShipment(selectedShipmentId ?? "");

  const ITEMS_PER_PAGE = 8;

  const totalPages = Math.max(
    1,
    Math.ceil(
      shipments.length / ITEMS_PER_PAGE,
    ),
  );

  const paginatedShipments = useMemo(() => {
    const start =
      (currentPage - 1) * ITEMS_PER_PAGE;

    return shipments.slice(
      start,
      start + ITEMS_PER_PAGE,
    );
  }, [shipments, currentPage]);

  function handleSearch(value: string) {
    setSearch(value);
    setCurrentPage(1);
  }

  function handleView(shipment: Shipment) {
    setSelectedShipmentId(shipment.id);
  }

  function handleEdit(shipment: Shipment) {
    setEditingShipment(shipment);
  }

  function handleDelete(shipment: Shipment) {
    setShipmentToDelete(shipment);
  }

  function handlePackages(shipment: Shipment) {
    router.push(
      `/dashboard/shipments/${shipment.id}/packages`,
    );
  }

  function handleCreateSuccess() {
    setCreateDrawerOpen(false);
  }

  function handleCloseDetails() {
    setSelectedShipmentId(null);
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Truck className="h-5 w-5 text-[#1677FF]" />

            <h1 className="text-xl font-semibold text-slate-900">
              Expéditions
            </h1>
          </div>

          <p className="mt-1 text-sm text-slate-500">
            Gérez les expéditions de votre organisation.
          </p>
        </div>

        <button
          type="button"
          onClick={() =>
            setCreateDrawerOpen(true)
          }
          className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-[#1677FF] px-4 text-sm font-semibold text-white transition hover:bg-[#0f68e8]"
        >
          <Plus className="h-4 w-4" />
          Nouvelle expédition
        </button>
      </div>

      {/* Search */}
      <div className="rounded-xl border border-slate-200 bg-white p-4">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

          <input
            type="text"
            value={search}
            onChange={(event) =>
              handleSearch(event.target.value)
            }
            placeholder="Rechercher une expédition..."
            className="h-10 w-full rounded-lg border border-slate-200 bg-white pl-9 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#1677FF] focus:ring-2 focus:ring-[#1677FF]/10"
          />
        </div>
      </div>

      {/* Error */}
      {isError && (
        <div className="rounded-xl border border-red-100 bg-red-50 px-5 py-4">
          <p className="text-sm font-medium text-red-700">
            Impossible de charger les expéditions.
          </p>

          <p className="mt-1 text-xs text-red-500">
            Veuillez actualiser la page et réessayer.
          </p>
        </div>
      )}

      {/* Loading */}
      {isLoading ? (
        <div className="rounded-xl border border-slate-200 bg-white px-6 py-12 text-center">
          <div className="mx-auto h-7 w-7 animate-spin rounded-full border-2 border-slate-200 border-t-[#1677FF]" />

          <p className="mt-3 text-sm text-slate-500">
            Chargement des expéditions...
          </p>
        </div>
      ) : (
        <>
          {/* Table */}
          <ShipmentsTable
            shipments={paginatedShipments}
            onView={handleView}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onPackages={handlePackages}
          />

          {/* Pagination */}
          {shipments.length > 0 && (
            <div className="flex items-center justify-between">
              <p className="text-sm text-slate-500">
                {shipments.length} expédition
                {shipments.length > 1 ? "s" : ""}
              </p>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  disabled={currentPage === 1}
                  onClick={() =>
                    setCurrentPage((page) =>
                      Math.max(1, page - 1),
                    )
                  }
                  className="h-9 rounded-lg border border-slate-200 bg-white px-3 text-sm font-medium text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Précédent
                </button>

                <div className="flex h-9 min-w-9 items-center justify-center rounded-lg bg-[#1677FF] px-3 text-sm font-semibold text-white">
                  {currentPage}
                </div>

                <button
                  type="button"
                  disabled={
                    currentPage === totalPages
                  }
                  onClick={() =>
                    setCurrentPage((page) =>
                      Math.min(
                        totalPages,
                        page + 1,
                      ),
                    )
                  }
                  className="h-9 rounded-lg border border-slate-200 bg-white px-3 text-sm font-medium text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Suivant
                </button>
              </div>
            </div>
          )}
        </>
      )}

      {/* Create */}
      <CreateShipmentDrawer
        open={createDrawerOpen}
        onClose={handleCreateSuccess}
      />

      {/* Details */}
      <ShipmentDetailsModal
        shipment={shipmentDetails ?? null}
        isLoading={isLoadingDetails}
        isError={isDetailsError}
        onClose={handleCloseDetails}
      />

      {/* Edit */}
      <EditShipmentDrawer
        shipment={editingShipment}
        onClose={() =>
          setEditingShipment(null)
        }
      />

      {/* Delete */}
      <DeleteShipmentModal
        shipment={shipmentToDelete}
        onClose={() =>
          setShipmentToDelete(null)
        }
      />
    </div>
  );
}