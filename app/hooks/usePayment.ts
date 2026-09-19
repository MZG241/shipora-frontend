"use client";

import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { CreatePaymentInput, Payment, UpdatePaymentInput } from "../types/payment.type";
import { createPayment, deletePayment, getPayment, getPayments, getPaymentsByBilling, updatePayment } from "../services/payment.service";
import { billingKeys } from "./useBilling";


/* =========================
   QUERY KEYS
========================= */

export const paymentKeys = {
  all: ["payments"] as const,

  lists: () =>
    [...paymentKeys.all, "list"] as const,

  list: () =>
    [...paymentKeys.lists()] as const,

  details: () =>
    [...paymentKeys.all, "detail"] as const,

  detail: (id: string) =>
    [...paymentKeys.details(), id] as const,

  billing: (billingId: string) =>
    [...paymentKeys.all, "billing", billingId] as const,
};

/* =========================
   GET ALL PAYMENTS
========================= */

export function usePayments() {
  return useQuery<Payment[]>({
    queryKey: paymentKeys.list(),

    queryFn: async () => {
      const response = await getPayments();

      return response.data.data;
    },

    staleTime: 60 * 1000,
  });
}

/* =========================
   GET PAYMENT BY ID
========================= */

export function usePayment(id: string) {
  return useQuery<Payment>({
    queryKey: paymentKeys.detail(id),

    queryFn: async () => {
      const response = await getPayment(id);

      return response.data.data;
    },

    enabled: !!id,

    staleTime: 30 * 1000,
  });
}

/* =========================
   GET PAYMENTS BY BILLING
========================= */

export function usePaymentsByBilling(
  billingId: string,
) {
  return useQuery<Payment[]>({
    queryKey: paymentKeys.billing(billingId),

    queryFn: async () => {
      const response =
        await getPaymentsByBilling(billingId);

      return response.data.data;
    },

    enabled: !!billingId,

    staleTime: 30 * 1000,
  });
}

/* =========================
   CREATE PAYMENT
========================= */

export function useCreatePayment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (
      data: CreatePaymentInput,
    ) => createPayment(data),

    onSuccess: (_response, variables) => {
      /*
       * Actualise les paiements
       */
      queryClient.invalidateQueries({
        queryKey: paymentKeys.billing(
          variables.billingId,
        ),
      });

      queryClient.invalidateQueries({
        queryKey: paymentKeys.list(),
      });

      /*
       * Le paiement modifie le statut
       * du Billing.
       */
      queryClient.invalidateQueries({
        queryKey: billingKeys.detail(
          variables.billingId,
        ),
      });

      queryClient.invalidateQueries({
        queryKey: billingKeys.list(),
      });
    },
  });
}

/* =========================
   DELETE PAYMENT
========================= */

export function useDeletePayment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) =>
      deletePayment(id),

    onSuccess: (_response, paymentId) => {
      /*
       * Le paiement supprimé n'est plus
       * disponible dans son détail.
       */
      queryClient.invalidateQueries({
        queryKey: paymentKeys.detail(
          paymentId,
        ),
      });

      /*
       * Actualise la liste des paiements.
       */
      queryClient.invalidateQueries({
        queryKey: paymentKeys.list(),
      });

      /*
       * Les paiements d'un Billing
       * peuvent avoir changé.
       */
      queryClient.invalidateQueries({
        queryKey: paymentKeys.all,
      });

      /*
       * Le statut du Billing peut également
       * avoir changé :
       *
       * PAID
       * ↓
       * PARTIALLY_PAID
       *
       * ou
       *
       * PARTIALLY_PAID
       * ↓
       * PENDING
       */
      queryClient.invalidateQueries({
        queryKey: billingKeys.all,
      });
    },
  });
}

export function useUpdatePayment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdatePaymentInput }) =>
      updatePayment(id, data),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: paymentKeys.all });
      queryClient.invalidateQueries({ queryKey: billingKeys.all });
      queryClient.setQueryData(paymentKeys.detail(response.data.data.id), response.data.data);
    },
  });
}