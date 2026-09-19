export type BillingStatus =
  | "PENDING"
  | "PARTIALLY_PAID"
  | "PAID"
  | "CANCELLED";

export type Billing = {
  id: string;
  organizationId: string;
  shipmentId: string;
  trackingNumber: string;
  amount: string;
  currency: string;
  status: BillingStatus;
  invoiceNumber: string;
  invoiceUrl: string | null;
  createdAt: string;
  updatedAt: string;
};

export type CreateBillingInput = {
  shipmentId: string;
  invoiceUrl?: string | null;
};

export type UpdateBillingInput = {
  invoiceUrl?: string | null;
};