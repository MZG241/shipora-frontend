import { api } from "../lib/axios";

export type RegisterInput = {
  name: string;
  email: string;
  password: string;
  organizationName: string;
};

export type LoginInput = {
  email: string;
  password: string;
};

export type AuthUser = {
  id: string;
  name: string;
  email: string;
  role: string;
  organizationId: string;
};

export type RegisterResponse = {
  success: boolean;
  message: string;

  data: {
    user: AuthUser;

    organization: {
      id: string;
      name: string;
      slug: string;
    };
  };
};

export type LoginResponse = {
  success: boolean;
  message: string;

  data: {
    user: AuthUser;
  };
};

export type MeResponse = {
  success: boolean;

  data: {
    user: AuthUser;
  };
};

export async function register(
  data: RegisterInput,
) {
  const response =
    await api.post<RegisterResponse>(
      "/auth/register",
      data,
    );

  return response.data;
}

export async function login(
  data: LoginInput,
) {
  const response =
    await api.post<LoginResponse>(
      "/auth/login",
      data,
    );

  return response.data;
}

export async function getMe() {
  const response =
    await api.get<MeResponse>(
      "/auth/me",
    );

  return response.data;
}

export async function logout() {
  const response =
    await api.post(
      "/auth/logout",
    );

  return response.data;
}