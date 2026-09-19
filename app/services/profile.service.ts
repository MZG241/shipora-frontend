import { api } from "../lib/axios";
import type { AuthUser } from "./auth.service";

export type ProfileInput = {
  name: string;
  email: string;
  password?: string;
};

export async function getProfile() {
  const response = await api.get<{ data: AuthUser }>("/user/me");
  return response.data;
}

export async function updateProfile(data: ProfileInput) {
  const response = await api.put<{ data: AuthUser }>("/user/me", data);
  return response.data;
}