import { api } from "../lib/axios";

export type StaffRole = "OWNER" | "ADMIN" | "MANAGER" | "AGENT" | "ACCOUNTANT";

export type StaffMember = {
  id: string;
  name: string;
  email: string;
  role: StaffRole;
  isActive: boolean;
  createdAt: string;
};

export type CreateStaffInput = {
  name: string;
  email: string;
  password: string;
  role: StaffRole;
};

export type UpdateStaffInput = Partial<Omit<CreateStaffInput, "password">> & {
  password?: string;
  isActive?: boolean;
};

export async function getStaff() {
  const response = await api.get<{ data: StaffMember[] }>("/user/all");
  return response.data;
}

export async function createStaff(data: CreateStaffInput) {
  const response = await api.post<{ data: StaffMember }>("/user/create-personal", data);
  return response.data;
}

export async function updateStaff(id: string, data: UpdateStaffInput) {
  const response = await api.put<{ data: StaffMember }>(`/user/edit/personal/${id}`, data);
  return response.data;
}

export async function deleteStaff(id: string) {
  const response = await api.delete<{ data: StaffMember }>(`/user/delete/personal/${id}`);
  return response.data;
}
