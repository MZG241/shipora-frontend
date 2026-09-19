import { api } from "../lib/axios";

import type {
  DashboardOverview,
  ShipmentsOverTimeItem,
  ShipmentStatusItem,
  RevenueItem,
  DestinationItem,
  WeightItem,
} from "../types/dashboard";

export async function getDashboardOverview() {
  const response =
    await api.get<{
      success: boolean;
      data: DashboardOverview;
    }>("/dashboard/overview");

  return response.data;
}

export async function getShipmentsOverTime(
  months = 12,
) {
  const response =
    await api.get<{
      success: boolean;
      data: ShipmentsOverTimeItem[];
    }>("/dashboard/shipments-over-time", {
      params: {
        months,
      },
    });

  return response.data;
}

export async function getShipmentStatus() {
  const response =
    await api.get<{
      success: boolean;
      data: ShipmentStatusItem[];
    }>("/dashboard/shipment-status");

  return response.data;
}

export async function getRevenue(
  months = 12,
) {
  const response =
    await api.get<{
      success: boolean;
      data: RevenueItem[];
    }>("/dashboard/revenue", {
      params: {
        months,
      },
    });

  return response.data;
}

export async function getDestinations() {
  const response =
    await api.get<{
      success: boolean;
      data: DestinationItem[];
    }>("/dashboard/destinations");

  return response.data;
}

export async function getWeight(
  months = 12,
) {
  const response =
    await api.get<{
      success: boolean;
      data: WeightItem[];
    }>("/dashboard/weight", {
      params: {
        months,
      },
    });

  return response.data;
}