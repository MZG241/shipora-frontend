import { api } from "../lib/axios";
import {
  CreateCustomerInput,
  Customer,
  CustomerHistory,
  UpdateCustomerInput,
} from "../types/customer.type";



type CustomerResponse = {
  success: boolean;
  message?: string;
  data: Customer;
};

type CustomersResponse = {
  success: boolean;
  data: Customer[];
  meta: PaginationMeta;
};

export type PaginationMeta = {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
};

export async function getCustomers(
  search?: string,
  page = 1,
  pageSize = 8,
) {
  const response =
    await api.get<CustomersResponse>(
      "/customer",
      {
        params: search?.trim()
          ? { search: search.trim(), page, pageSize }
          : { page, pageSize },
      },
    );

  return response.data;
}

export async function getCustomer(
  id: string,
) {
  const response =
    await api.get<CustomerResponse>(
      `/customer/${id}`,
    );

  return response.data;
}

export async function getCustomerHistory(
  id: string,
) {
  const response =
    await api.get<{
      success: boolean;
      data: CustomerHistory;
    }>(`/customer/${id}/history`);

  return response.data;
}

export async function createCustomer(
  data: CreateCustomerInput,
) {
  const response =
    await api.post<CustomerResponse>(
      "/customer/create",
      data,
    );

  return response.data;
}

export async function updateCustomer(
  id: string,
  data: UpdateCustomerInput,
) {
  const response =
    await api.put<CustomerResponse>(
      `/customer/edit/${id}`,
      data,
    );

  return response.data;
}

export async function deleteCustomer(
  id: string,
) {
  const response =
    await api.delete<CustomerResponse>(
      `/customer/delete/${id}`,
    );

  return response.data;
}