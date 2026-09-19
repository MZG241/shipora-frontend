import { api } from "../lib/axios";

import type {
  CreateWarehouseInput,
  UpdateWarehouseInput,
  Warehouse,
} from "@/app/types/warehouse.type";

type WarehouseResponse = {
  success: boolean;
  message?: string;
  data: Warehouse;
};

type WarehousesResponse = {
  success: boolean;
  data: Warehouse[];
  meta: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
};

export async function getWarehouses(
  search?: string,
  page = 1,
  pageSize = 8,
) {
  const response =
    await api.get<WarehousesResponse>(
      "/warehouse",
      {
        params: search?.trim()
          ? { search: search.trim(), page, pageSize }
          : { page, pageSize },
      },
    );

  return response.data;
}

export async function getWarehouse(
  id: string,
) {
  const response =
    await api.get<WarehouseResponse>(
      `/warehouse/${id}`,
    );

  return response.data;
}

export async function createWarehouse(
  data: CreateWarehouseInput,
) {
  const response =
    await api.post<WarehouseResponse>(
      "/warehouse/create",
      data,
    );

  return response.data;
}

export async function updateWarehouse(
  id: string,
  data: UpdateWarehouseInput,
) {
  const response =
    await api.put<WarehouseResponse>(
      `/warehouse/edit/${id}`,
      data,
    );

  return response.data;
}

export async function deleteWarehouse(
  id: string,
) {
  const response =
    await api.delete<WarehouseResponse>(
      `/warehouse/delete/${id}`,
    );

  return response.data;
}