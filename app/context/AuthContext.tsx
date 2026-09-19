"use client";

import {
  createContext,
  useContext,
} from "react";

import {
  useCurrentUser,
  useLogout,
} from "../hooks/useAuth";

import type { AuthUser } from "../services/auth.service";

type AuthContextType = {
  user: AuthUser | undefined;

  loading: boolean;

  isAuthenticated: boolean;

  logout: () => Promise<void>;
};

const AuthContext =
  createContext<AuthContextType | undefined>(
    undefined,
  );

export function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const {
    data: user,
    isLoading,
  } = useCurrentUser();

  const logoutMutation =
    useLogout();

  const handleLogout = async () => {
    await logoutMutation.mutateAsync();
  };

  const loading =
    isLoading ||
    logoutMutation.isPending;

  const isAuthenticated =
    !!user;

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated,
        logout: handleLogout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context =
    useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth doit être utilisé dans AuthProvider",
    );
  }

  return context;
}