
import { api } from "../lib/axios";

import type {
  CreateShipmentInput,
  Shipment,
  ShipmentDetails,
  UpdateShipmentInput,
} from "../types/shipment.types";

/* -------------------------------------------------------------------------- */
/* Response types                                                              */
/* -------------------------------------------------------------------------- */

type ShipmentResponse = {
  success: boolean;
  message?: string;
  data: Shipment;
};

type ShipmentDetailsResponse = {
  success: boolean;
  message?: string;
  data: ShipmentDetails;
};

type ShipmentsResponse = {
  success: boolean;
  data: Shipment[];
  meta: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
};

/* -------------------------------------------------------------------------- */
/* Get shipments                                                               */
/* -------------------------------------------------------------------------- */

export async function getShipments(
  search?: string,
  page = 1,
  pageSize = 8,
) {
  const response =
    await api.get<ShipmentsResponse>(
      "/shipment",
      {
        params: search?.trim()
          ? { search: search.trim(), page, pageSize }
          : { page, pageSize },
      },
    );

  return response.data;
}

/* -------------------------------------------------------------------------- */
/* Get shipment                                                                */
/* -------------------------------------------------------------------------- */

export async function getShipment(
  id: string,
) {
  const response =
    await api.get<ShipmentDetailsResponse>(
      `/shipment/${id}`,
    );

  return response.data;
}

/* -------------------------------------------------------------------------- */
/* Create shipment                                                             */
/* -------------------------------------------------------------------------- */

export async function createShipment(
  data: CreateShipmentInput,
) {
  const response =
    await api.post<ShipmentResponse>(
      "/shipment/create",
      data,
    );

  return response.data;
}

/* -------------------------------------------------------------------------- */
/* Update shipment                                                             */
/* -------------------------------------------------------------------------- */

export async function updateShipment(
  id: string,
  data: UpdateShipmentInput,
) {
  const response =
    await api.put<ShipmentResponse>(
      `/shipment/edit/${id}`,
      data,
    );

  return response.data;
}

/* -------------------------------------------------------------------------- */
/* Delete shipment                                                             */
/* -------------------------------------------------------------------------- */

export async function deleteShipment(
  id: string,
) {
  const response =
    await api.delete<ShipmentResponse>(
      `/shipment/${id}`,
    );

  return response.data;
}

/* -------------------------------------------------------------------------- */
/* Public tracking                                                             */
/* -------------------------------------------------------------------------- */

export async function trackShipment(
  trackingNumber: string,
) {
  const response =
    await api.get<ShipmentResponse>(
      `/shipment/track/${encodeURIComponent(
        trackingNumber,
      )}`,
    );

  return response.data;
}

