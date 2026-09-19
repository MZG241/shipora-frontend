import { api } from "../lib/axios";
import { Billing, CreateBillingInput, UpdateBillingInput } from "../types/billing.type";


type ApiResponse<T> = {
  data: T;
};

/* =========================
   CREATE BILLING
========================= */

export function createBilling(
  data: CreateBillingInput,
) {
  return api.post<ApiResponse<Billing>>(
    "/billing/",
    data,
  );
}

/* =========================
   GET ALL BILLINGS
========================= */

export function getBillings() {
  return api.get<ApiResponse<Billing[]>>(
    "/billing/",
  );
}

/* =========================
   GET BILLING BY ID
========================= */

export function getBilling(id: string) {
  return api.get<ApiResponse<Billing>>(
    `/billing/${id}`,
  );
}

/* =========================
   GET BILLING BY SHIPMENT
========================= */

export function getBillingByShipment(
  shipmentId: string,
) {
  return api.get<ApiResponse<Billing>>(
    `/billing/shipment/${shipmentId}`,
  );
}

/* =========================
   UPDATE BILLING
========================= */

export function updateBilling(
  id: string,
  data: UpdateBillingInput,
) {
  return api.patch<ApiResponse<Billing>>(
    `/billing/${id}`,
    data,
  );
}

/* =========================
   DELETE BILLING
========================= */

export function deleteBilling(id: string) {
  return api.delete<
    ApiResponse<{ success: boolean }>
  >(`/billing/${id}`);
}