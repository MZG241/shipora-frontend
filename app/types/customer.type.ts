export type Customer = {
  id: string;
  organizationId: string;

  name: string;
  email: string | null;
  phone: string | null;

  address: string | null;
  city: string | null;
  country: string | null;

  createdAt: string;
  updatedAt: string;
};

export type CreateCustomerInput = {
  name: string;
  email?: string | null;
  phone?: string | null;
  address?: string | null;
  city?: string | null;
  country?: string | null;
};

export type UpdateCustomerInput = {
  name?: string;
  email?: string | null;
  phone?: string | null;
  address?: string | null;
  city?: string | null;
  country?: string | null;
};

export type CustomerHistory = {
  customer: Customer;
  shipments: CustomerHistoryShipment[];
  packages: CustomerHistoryPackage[];
  payments: CustomerHistoryPayment[];
};

export type CustomerHistoryShipment = {
  id: string;
  trackingNumber: string;
  origin: string;
  destination: string;
  transportMethod: string;
  status: string;
  estimatedArrival: string | null;
  deliveredAt: string | null;
  createdAt: string;
};

export type CustomerHistoryPackage = {
  id: string;
  shipmentId: string;
  trackingCode: string;
  itemName: string;
  quantity: number;
  weight: string | null;
  status: string;
  createdAt: string;
};

export type CustomerHistoryPayment = {
  id: string;
  billingId: string;
  invoiceNumber: string | null;
  shipmentId: string;
  amount: string;
  currency: string;
  method: string;
  status: string;
  reference: string | null;
  paidAt: string | null;
  createdAt: string;
};