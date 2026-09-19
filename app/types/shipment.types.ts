export type TransportMethod =
  | "AIR"
  | "SEA"
  | "ROAD"
  | "RAIL";

export type ShipmentStatus =
  | "PENDING"
  | "RECEIVED"
  | "IN_WAREHOUSE"
  | "IN_TRANSIT"
  | "ARRIVED"
  | "CUSTOMS"
  | "READY_FOR_PICKUP"
  | "PICKED_UP"
  | "CANCELLED";


export type Shipment = {
  id: string;

  organizationId: string;

  customerId: string;
  warehouseId: string | null;
  pricingRuleId: string;

  trackingNumber: string;

  origin: string;
  destination: string;

  transportMethod: TransportMethod;

  status: ShipmentStatus;

  description: string | null;

  estimatedArrival: string | null;

  deliveredAt: string | null;

  createdAt: string;
  updatedAt: string;

  customer: ShipmentCustomer;

  warehouse: ShipmentWarehouse | null;

  pricingRule: ShipmentPricingRule;
};

export type CreateShipmentInput = {
  customerId: string;

  warehouseId?: string | null;

  pricingRuleId: string;

  origin: string;

  destination: string;

  transportMethod: TransportMethod;

  description?: string | null;

  estimatedArrival?: string | null;
};

export type UpdateShipmentInput = {
  customerId?: string;

  warehouseId?: string | null;

  pricingRuleId?: string;

  origin?: string;

  destination?: string;

  transportMethod?: TransportMethod;

  status?: ShipmentStatus;

  description?: string | null;

  estimatedArrival?: string | null;
};

export type ShipmentCustomer = {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  address: string | null;
  city: string | null;
  country: string | null;
};

export type ShipmentWarehouse = {
  id: string;
  name: string;
  code: string;
  address: string | null;
  city: string | null;
  country: string | null;
};

export type ShipmentPricingRule = {
  id: string;
  name: string;
  origin: string | null;
  destination: string | null;
  transportMethod: string | null;
  pricingType:
    | "PER_KG"
    | "PER_CBM"
    | "FIXED";
  price: string;
  currency: string;
  isActive: boolean;
};

export type ShipmentDetails = Shipment & {
  deliveredAt: string | null;

  customer: ShipmentCustomer;

  warehouse: ShipmentWarehouse | null;

  pricingRule: ShipmentPricingRule;
};

