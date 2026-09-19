import { api } from "../lib/axios";

export type Organization = {
  id: string;
  name: string;
  description: string | null;
  slug: string;
  email: string | null;
  phone: string | null;
  city: string | null;
  address: string | null;
  country: string | null;
  logo: string | null;
  currency: string;
  createdAt: string;
  updatedAt: string;
};

export type OrganizationInput = Pick<Organization, "name" | "description" | "email" | "phone" | "city" | "address" | "country" | "currency">;

export async function getOrganization() {
  const response = await api.get<{ data: Organization }>("/organization/");
  return response.data;
}

export async function updateOrganization(data: OrganizationInput, logo?: File | null) {
  const payload = new FormData();
  Object.entries(data).forEach(([key, value]) => payload.append(key, value ?? ""));
  if (logo) payload.append("logo", logo);
  const response = await api.put<{ data: Organization }>("/organization/edit", payload, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
}
