"use client";

import { useQuery } from "@tanstack/react-query";

import {
  getDashboardOverview,
  getShipmentsOverTime,
  getShipmentStatus,
  getRevenue,
  getDestinations,
  getWeight,
} from "../services/dashboard.service";

export const dashboardKeys = {
  all: ["dashboard"] as const,

  overview: () =>
    [...dashboardKeys.all, "overview"] as const,

  shipmentsOverTime: () =>
    [...dashboardKeys.all, "shipments-over-time"] as const,

  shipmentStatus: () =>
    [...dashboardKeys.all, "shipment-status"] as const,

  revenue: () =>
    [...dashboardKeys.all, "revenue"] as const,

  destinations: () =>
    [...dashboardKeys.all, "destinations"] as const,

  weight: () =>
    [...dashboardKeys.all, "weight"] as const,
};

export function useDashboardOverview() {
  return useQuery({
    queryKey: dashboardKeys.overview(),

    queryFn: async () => {
      const response =
        await getDashboardOverview();

      return response.data;
    },

    staleTime: 60 * 1000,
  });
}

export function useShipmentsOverTime() {
  return useQuery({
    queryKey:
      dashboardKeys.shipmentsOverTime(),

    queryFn: async () => {
      const response =
        await getShipmentsOverTime(12);

      return response.data;
    },

    staleTime: 60 * 1000,
  });
}

export function useShipmentStatus() {
  return useQuery({
    queryKey:
      dashboardKeys.shipmentStatus(),

    queryFn: async () => {
      const response =
        await getShipmentStatus();

      return response.data;
    },

    staleTime: 60 * 1000,
  });
}

export function useRevenue() {
  return useQuery({
    queryKey: dashboardKeys.revenue(),

    queryFn: async () => {
      const response =
        await getRevenue(12);

      return response.data;
    },

    staleTime: 60 * 1000,
  });
}

export function useDestinations() {
  return useQuery({
    queryKey:
      dashboardKeys.destinations(),

    queryFn: async () => {
      const response =
        await getDestinations();

      return response.data;
    },

    staleTime: 60 * 1000,
  });
}

export function useWeight() {
  return useQuery({
    queryKey: dashboardKeys.weight(),

    queryFn: async () => {
      const response =
        await getWeight(12);

      return response.data;
    },

    staleTime: 60 * 1000,
  });
}