export type TransportMethod =
  | "AIR"
  | "SEA"
  | "ROAD"
  | "RAIL";

export type PricingType =
  | "PER_KG"
  | "PER_CBM"
  | "FIXED";

export type PricingRule = {
  id: string;
  organizationId: string;
  name: string;
  origin: string | null;
  destination: string | null;
  transportMethod: TransportMethod | null;
  pricingType: PricingType;
  price: string;
  currency: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

export type CreatePricingInput = {
  name: string;
  origin?: string | null;
  destination?: string | null;
  transportMethod?: TransportMethod | null;
  pricingType: PricingType;
  price: string;
  currency?: string;
  isActive?: boolean;
};

export type UpdatePricingInput = {
  name?: string;
  origin?: string | null;
  destination?: string | null;
  transportMethod?: TransportMethod | null;
  pricingType?: PricingType;
  price?: string;
  currency?: string;
  isActive?: boolean;
};