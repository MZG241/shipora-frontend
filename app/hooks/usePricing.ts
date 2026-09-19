"use client";

import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import {
  createPricing,
  deletePricing,
  getPricing,
  getPricings,
  updatePricing,
} from "@/app/services/pricing.service";

import type {
  CreatePricingInput,
  UpdatePricingInput,
} from "@/app/types/pricing.type";

export const pricingKeys = {
  all: ["pricing"] as const,

  lists: () =>
    [...pricingKeys.all, "list"] as const,

  list: (search?: string, page = 1) =>
    [...pricingKeys.lists(), search ?? "", page] as const,

  details: () =>
    [...pricingKeys.all, "detail"] as const,

  detail: (id: string) =>
    [...pricingKeys.details(), id] as const,
};

export function usePricings(search?: string, page = 1) {
  const query = useQuery({
    queryKey: pricingKeys.list(search, page),
    queryFn: async () => {
      const response = await getPricings(search, page);

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

export function usePricing(id: string) {
  return useQuery({
    queryKey: pricingKeys.detail(id),
    queryFn: async () => {
      const response = await getPricing(id);

      return response.data;
    },
    enabled: !!id,
    staleTime: 60 * 1000,
  });
}

export function useCreatePricing() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (
      data: CreatePricingInput,
    ) => createPricing(data),

    onSuccess: (response) => {
      queryClient.invalidateQueries({
        queryKey: pricingKeys.lists(),
      });

      if (response.data) {
        queryClient.setQueryData(
          pricingKeys.detail(response.data.id),
          response.data,
        );
      }
    },
  });
}

export function useUpdatePricing() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: UpdatePricingInput;
    }) => updatePricing(id, data),

    onSuccess: (response, variables) => {
      queryClient.invalidateQueries({
        queryKey: pricingKeys.lists(),
      });

      queryClient.setQueryData(
        pricingKeys.detail(variables.id),
        response.data,
      );
    },
  });
}

export function useDeletePricing() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) =>
      deletePricing(id),

    onSuccess: (_, id) => {
      queryClient.invalidateQueries({
        queryKey: pricingKeys.lists(),
      });

      queryClient.removeQueries({
        queryKey: pricingKeys.detail(id),
      });
    },
  });
}

