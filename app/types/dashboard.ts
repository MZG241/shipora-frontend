export type DashboardOverview = {
  shipments: number;
  packages: number;
  inTransit: number;
  readyForPickup: number;
  revenue: number;
  paid: number;
};

export type ShipmentsOverTimeItem = {
  month: string;
  count: number;
};

export type ShipmentStatusItem = {
  status: string;
  count: number;
};

export type RevenueItem = {
  month: string;
  revenue: number;
};

export type DestinationItem = {
  destination: string;
  count: number;
};

export type WeightItem = {
  month: string;
  weight: number;
};