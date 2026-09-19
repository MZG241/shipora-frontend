import axios from "axios";

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

let isRefreshing = false;

let refreshSubscribers: Array<
  (success: boolean) => void
> = [];

function subscribeToRefresh(
  callback: (success: boolean) => void,
) {
  refreshSubscribers.push(callback);
}

function notifyRefreshSubscribers(
  success: boolean,
) {
  refreshSubscribers.forEach((callback) => {
    callback(success);
  });

  refreshSubscribers = [];
}

function redirectToLogin() {
  if (
    typeof window !== "undefined" &&
    window.location.pathname !== "/login"
  ) {
    window.location.href = "/login";
  }
}

api.interceptors.response.use(
  (response) => response,

  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status !== 401) {
      return Promise.reject(error);
    }

    if (originalRequest?.url?.includes("/auth/me")) {
      return Promise.reject(error);
    }

    // Si le refresh lui-même échoue
    if (
      originalRequest?.url?.includes("/auth/refresh")
    ) {
      redirectToLogin();

      return Promise.reject(error);
    }

    // Évite une boucle infinie
    if (originalRequest?._retry) {
      redirectToLogin();

      return Promise.reject(error);
    }

    originalRequest._retry = true;

    // Un refresh est déjà en cours
    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        subscribeToRefresh((success) => {
          if (!success) {
            reject(error);
            return;
          }

          resolve(api(originalRequest));
        });
      });
    }

    isRefreshing = true;

    try {
      await api.post("/auth/refresh");

      notifyRefreshSubscribers(true);

      return api(originalRequest);
    } catch (refreshError) {
      notifyRefreshSubscribers(false);

      redirectToLogin();

      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  },
);