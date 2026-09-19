/* =========================
   PAYMENT METHOD
========================= */

export type PaymentMethod =
  | "CASH"
  | "BANK_TRANSFER"
  | "MOBILE_MONEY"
  | "CARD";

/* =========================
   PAYMENT STATUS
========================= */

export type PaymentStatus =
  | "PENDING"
  | "COMPLETED"
  | "FAILED"
  | "REFUNDED";

/* =========================
   PAYMENT
========================= */

export type Payment = {
  id: string;

  organizationId: string;
  billingId: string;

  invoiceNumber: string | null;

  amount: string;
  currency: string;

  method: PaymentMethod;
  status: PaymentStatus;

  reference: string | null;
  notes: string | null;

  paidAt: string | null;

  createdAt: string;
  updatedAt: string;
};

/* =========================
   CREATE
========================= */

export type CreatePaymentInput = {
  billingId: string;

  amount: string;
  currency: string;

  method: PaymentMethod;

  notes?: string | null;
};

export type UpdatePaymentInput = Omit<CreatePaymentInput, "billingId">;