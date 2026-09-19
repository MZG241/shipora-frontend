import { api } from "../lib/axios";

import type {
  CreatePackageInput,
  Package,
  PackageBase,
  PackageShipment,
  PublicPackageTracking,
  UpdatePackageInput,
} from "../types/package.types";

type ApiResponse<T> = {
  data: T;
};

/* =========================
   CREATE
========================= */

export function createPackage(
  data: CreatePackageInput,
) {
  return api.post<ApiResponse<Package>>(
    "/package/create",
    data,
  );
}

/* =========================
   GET ALL
========================= */

export function getPackages() {
  return api.get<ApiResponse<Package[]>>(
    "/package/",
  );
}

/* =========================
   GET BY SHIPMENT
========================= */

export function getPackagesByShipment(
  shipmentId: string,
) {
  return api.get<ApiResponse<PackageBase[]>>(
    `/package/shipment/${shipmentId}`,
  );
}

/* =========================
   GET ONE
========================= */

export function getPackage(
  id: string,
) {
  return api.get<ApiResponse<Package>>(
    `/package/${id}`,
  );
}

/* =========================
   UPDATE
========================= */

export function updatePackage(
  id: string,
  data: UpdatePackageInput,
) {
  return api.put<ApiResponse<Package>>(
    `/package/${id}`,
    data,
  );
}

/* =========================
   DELETE
========================= */

export function deletePackage(
  id: string,
) {
  return api.delete<ApiResponse<null>>(
    `/package/${id}`,
  );
}

/* =========================
   SCANNER
========================= */

export function getPackageByTrackingCode(
  trackingCode: string,
) {
  return api.get<{
    package: PackageBase;
    shipment: PackageShipment;
  }>(
    `/package/scan/${trackingCode}`,
  );
}

/* =========================
   PUBLIC TRACKING
========================= */

export function getPublicPackageTracking(
  trackingCode: string,
) {
  return api.get<
    ApiResponse<PublicPackageTracking>
  >(
    `/package/public-track/${trackingCode}`,
  );
}

/* =========================
   BARCODE
========================= */

export function getPackageBarcode(
  id: string,
) {
  return api.get(
    `/package/${id}/barcode`,
    {
      responseType: "blob",
    },
  );
}

/* =========================
   LABEL
========================= */

export function getPackageLabel(
  id: string,
) {
  return api.get(
    `/package/${id}/label`,
    {
      responseType: "blob",
    },
  );
}