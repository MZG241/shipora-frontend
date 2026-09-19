
import { api } from "../lib/axios";
import { CreatePricingInput, PricingRule, UpdatePricingInput } from "../types/pricing.type";



type PricingResponse = {
  message?: string;
  data: PricingRule;
};

type PricingsResponse = {
  data: PricingRule[];
  meta: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
};

export async function getPricings(
  search?: string,
  page = 1,
  pageSize = 8,
) {
  const response =
    await api.get<PricingsResponse>("/pricing", {
      params: search?.trim()
        ? { search: search.trim(), page, pageSize }
        : { page, pageSize },
    });

  return response.data;
}

export async function getPricing(id: string) {
  const response =
    await api.get<PricingResponse>(
      `/pricing/${id}`,
    );

  return response.data;
}

export async function createPricing(
  data: CreatePricingInput,
) {
  const response =
    await api.post<PricingResponse>(
      "/pricing/create",
      data,
    );

  return response.data;
}

export async function updatePricing(
  id: string,
  data: UpdatePricingInput,
) {
  const response =
    await api.put<PricingResponse>(
      `/pricing/edit/${id}`,
      data,
    );

  return response.data;
}

export async function deletePricing(
  id: string,
) {
  const response =
    await api.delete<PricingResponse>(
      `/pricing/delete/${id}`,
    );

  return response.data;
}

