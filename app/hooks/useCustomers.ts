"use client";

import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import {
  createCustomer,
  deleteCustomer,
  getCustomer,
  getCustomerHistory,
  getCustomers,
  updateCustomer,
} from "../services/customer.service";
import { CreateCustomerInput, UpdateCustomerInput } from "../types/customer.type";



export const customerKeys = {
  all: ["customers"] as const,

  lists: () =>
    [...customerKeys.all, "list"] as const,

  list: (search?: string, page = 1) =>
    [
      ...customerKeys.lists(),
      search ?? "",
      page,
    ] as const,

  details: () =>
    [...customerKeys.all, "detail"] as const,

  detail: (id: string) =>
    [
      ...customerKeys.details(),
      id,
    ] as const,

  history: (id: string) =>
    [
      ...customerKeys.all,
      "history",
      id,
    ] as const,
};

export function useCustomers(
  search?: string,
  page = 1,
) {
  const query = useQuery({
    queryKey: customerKeys.list(
      search,
      page,
    ),

    queryFn: async () => {
      const response =
        await getCustomers(search, page);

      return response;
    },

    staleTime: 60 * 1000,
  });

  return {
    ...query,
    data: query.data?.data ?? [],
    pagination: query.data?.meta,
  };
}

export function useCustomer(
  id: string,
) {
  return useQuery({
    queryKey:
      customerKeys.detail(id),

    queryFn: async () => {
      const response =
        await getCustomer(id);

      return response.data;
    },

    enabled: !!id,

    staleTime: 60 * 1000,
  });
}

export function useCreateCustomer() {
  const queryClient =
    useQueryClient();

  return useMutation({
    mutationFn: (
      data: CreateCustomerInput,
    ) => createCustomer(data),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey:
          customerKeys.lists(),
      });
    },
  });
}

export function useUpdateCustomer() {
  const queryClient =
    useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: UpdateCustomerInput;
    }) =>
      updateCustomer(id, data),

    onSuccess: (
      response,
      variables,
    ) => {
      queryClient.invalidateQueries({
        queryKey:
          customerKeys.lists(),
      });

      queryClient.setQueryData(
        customerKeys.detail(
          variables.id,
        ),
        response.data,
      );
    },
  });
}

export function useDeleteCustomer() {
  const queryClient =
    useQueryClient();

  return useMutation({
    mutationFn: (
      id: string,
    ) => deleteCustomer(id),

    onSuccess: (
      _response,
      customerId,
    ) => {
      queryClient.invalidateQueries({
        queryKey:
          customerKeys.lists(),
      });

      queryClient.removeQueries({
        queryKey:
          customerKeys.detail(
            customerId,
          ),
      });
    },
  });
}

export function useCustomerHistory(
  id?: string,
) {
  return useQuery({
    queryKey: customerKeys.history(id ?? ""),

    queryFn: async () => {
      const response = await getCustomerHistory(id!);

      return response.data;
    },

    enabled: !!id,
    staleTime: 30 * 1000,
  });
}