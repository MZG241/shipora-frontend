"use client";

import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import {
  createBilling,
  deleteBilling,
  getBilling,
  getBillingByShipment,
  getBillings,
  updateBilling,
} from "../services/billing.service";
import { Billing, CreateBillingInput, UpdateBillingInput } from "../types/billing.type";


/* =========================
   QUERY KEYS
========================= */

export const billingKeys = {
  all: ["billings"] as const,

  lists: () =>
    [...billingKeys.all, "list"] as const,

  list: () =>
    [...billingKeys.lists()] as const,

  details: () =>
    [...billingKeys.all, "detail"] as const,

  detail: (id: string) =>
    [...billingKeys.details(), id] as const,

  shipment: (shipmentId: string) =>
    [...billingKeys.all, "shipment", shipmentId] as const,
};

/* =========================
   GET ALL BILLINGS
========================= */

export function useBillings() {
  return useQuery<Billing[]>({
    queryKey: billingKeys.list(),

    queryFn: async () => {
      const response = await getBillings();

      return response.data.data;
    },

    staleTime: 60 * 1000,
  });
}

/* =========================
   GET BILLING BY ID
========================= */

export function useBilling(id: string) {
  return useQuery<Billing>({
    queryKey: billingKeys.detail(id),

    queryFn: async () => {
      const response = await getBilling(id);

      return response.data.data;
    },

    enabled: !!id,

    staleTime: 30 * 1000,
  });
}

/* =========================
   GET BILLING BY SHIPMENT
========================= */

export function useBillingByShipment(
  shipmentId: string,
) {
  return useQuery<Billing>({
    queryKey: billingKeys.shipment(shipmentId),

    queryFn: async () => {
      const response =
        await getBillingByShipment(shipmentId);

      return response.data.data;
    },

    enabled: !!shipmentId,

    staleTime: 30 * 1000,
  });
}

/* =========================
   CREATE BILLING
========================= */

export function useCreateBilling() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (
      data: CreateBillingInput,
    ) => createBilling(data),

    onSuccess: (_response, variables) => {
      queryClient.invalidateQueries({
        queryKey: billingKeys.list(),
      });

      queryClient.invalidateQueries({
        queryKey: billingKeys.shipment(
          variables.shipmentId,
        ),
      });
    },
  });
}

/* =========================
   UPDATE BILLING
========================= */

export function useUpdateBilling() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: UpdateBillingInput;
    }) =>
      updateBilling(id, data),

    onSuccess: (_response, variables) => {
      queryClient.invalidateQueries({
        queryKey: billingKeys.detail(
          variables.id,
        ),
      });

      queryClient.invalidateQueries({
        queryKey: billingKeys.list(),
      });
    },
  });
}

/* =========================
   DELETE BILLING
========================= */

export function useDeleteBilling() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) =>
      deleteBilling(id),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: billingKeys.all,
      });
    },
  });
}