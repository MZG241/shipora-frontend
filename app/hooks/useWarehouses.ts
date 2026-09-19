"use client";

import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import {
  createWarehouse,
  deleteWarehouse,
  getWarehouse,
  getWarehouses,
  updateWarehouse,
} from "@/app/services/warehouse.service";

import type {
  CreateWarehouseInput,
  UpdateWarehouseInput,
} from "@/app/types/warehouse.type";

export const warehouseKeys = {
  all: ["warehouses"] as const,

  lists: () =>
    [...warehouseKeys.all, "list"] as const,

  list: (search?: string, page = 1) =>
    [
      ...warehouseKeys.lists(),
      search ?? "",
      page,
    ] as const,

  details: () =>
    [...warehouseKeys.all, "detail"] as const,

  detail: (id: string) =>
    [
      ...warehouseKeys.details(),
      id,
    ] as const,
};

export function useWarehouses(
  search?: string,
  page = 1,
) {
  const query = useQuery({
    queryKey:
      warehouseKeys.list(search, page),

    queryFn: async () => {
      const response =
        await getWarehouses(search, page);

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

export function useWarehouse(
  id: string,
) {
  return useQuery({
    queryKey:
      warehouseKeys.detail(id),

    queryFn: async () => {
      const response =
        await getWarehouse(id);

      return response.data;
    },

    enabled: !!id,

    staleTime: 60 * 1000,
  });
}

export function useCreateWarehouse() {
  const queryClient =
    useQueryClient();

  return useMutation({
    mutationFn: (
      data: CreateWarehouseInput,
    ) => createWarehouse(data),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey:
          warehouseKeys.lists(),
      });
    },
  });
}

export function useUpdateWarehouse() {
  const queryClient =
    useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: UpdateWarehouseInput;
    }) =>
      updateWarehouse(id, data),

    onSuccess: (
      response,
      variables,
    ) => {
      queryClient.invalidateQueries({
        queryKey:
          warehouseKeys.lists(),
      });

      queryClient.setQueryData(
        warehouseKeys.detail(
          variables.id,
        ),
        response.data,
      );
    },
  });
}

export function useDeleteWarehouse() {
  const queryClient =
    useQueryClient();

  return useMutation({
    mutationFn: (
      id: string,
    ) => deleteWarehouse(id),

    onSuccess: (
      _response,
      warehouseId,
    ) => {
      queryClient.invalidateQueries({
        queryKey:
          warehouseKeys.lists(),
      });

      queryClient.removeQueries({
        queryKey:
          warehouseKeys.detail(
            warehouseId,
          ),
      });
    },
  });
}