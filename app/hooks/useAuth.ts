"use client";

import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import {
  getMe,
  login,
  logout,
  register,
} from "../services/auth.service";

export const authKeys = {
  all: ["auth"] as const,

  me: () =>
    [...authKeys.all, "me"] as const,
};

export function useCurrentUser() {
  return useQuery({
    queryKey: authKeys.me(),

    queryFn: async () => {
      const response = await getMe();

      return response.data.user;
    },

    retry: false,
  });
}

export function useLogin() {
  const queryClient =
    useQueryClient();

  return useMutation({
    mutationFn: login,

    onSuccess: async (response) => {
      await queryClient.cancelQueries({
        queryKey: authKeys.me(),
      });

      queryClient.removeQueries({
        predicate: (query) =>
          query.queryKey[0] !== authKeys.all[0],
      });

      /*
       * Le login nous donne déjà l'utilisateur.
       * On le met directement dans React Query.
       */
      queryClient.setQueryData(
        authKeys.me(),
        response.data.user,
      );
    },
  });
}

export function useRegister() {
  return useMutation({
    mutationFn: register,
  });
}

export function useLogout() {
  const queryClient =
    useQueryClient();

  return useMutation({
    mutationFn: logout,

    onSuccess: () => {
      queryClient.clear();
    },
  });
}