import { api } from "../lib/axios";

import type {
  Payment,
  CreatePaymentInput,
  UpdatePaymentInput,
} from "../types/payment.type";

type ApiResponse<T> = {
  data: T;
};

export function createPayment(
  data: CreatePaymentInput,
) {
  return api.post<ApiResponse<Payment>>(
    "/payment/create",
    data,
  );
}

export function getPayments() {
  return api.get<ApiResponse<Payment[]>>(
    "/payment/",
  );
}

export function getPaymentsByBilling(
  billingId: string,
) {
  return api.get<ApiResponse<Payment[]>>(
    `/payment/billing/${billingId}`,
  );
}

export function getPayment(id: string) {
  return api.get<ApiResponse<Payment>>(
    `/payment/${id}`,
  );
}

export function deletePayment(id: string) {
  return api.delete<ApiResponse<Payment>>(
    `/payment/delete/${id}`,
  );
}

export function updatePayment(id: string, data: UpdatePaymentInput) {
  return api.put<ApiResponse<Payment>>(
    `/payment/edit/${id}`,
    data,
  );
}