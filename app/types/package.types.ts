export type PackageStatus =
  | "RECEIVED"
  | "IN_WAREHOUSE"
  | "IN_TRANSIT"
  | "DELIVERED"
  | "DAMAGED"
  | "LOST";

/* =========================
   SHIPMENT
========================= */

export type PackageShipment = {
  id: string;
  trackingNumber: string;
  origin: string;
  destination: string;
  transportMethod: string;
  status: string;
  estimatedArrival: string | null;
  deliveredAt: string | null;
};

/* =========================
   CUSTOMER
========================= */

export type PackageCustomer = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  address: string | null;
  city: string | null;
  country: string | null;
};

/* =========================
   BASE PACKAGE
========================= */

export type PackageBase = {
  id: string;
  organizationId: string;
  shipmentId: string;

  trackingCode: string;

  itemName: string;
  description: string | null;

  quantity: number;

  weight: string | null;
  length: string | null;
  width: string | null;
  height: string | null;

  status: PackageStatus;

  createdAt: string;
  updatedAt: string;
};

/* =========================
   PACKAGE + SHIPMENT
========================= */

export type PackageWithShipment =
  PackageBase & {
    shipment: PackageShipment;
  };

/* =========================
   PACKAGE + CUSTOMER
========================= */

export type PackageWithCustomer =
  PackageBase & {
    customer: PackageCustomer;
  };

/* =========================
   COMPLETE PACKAGE
========================= */

export type Package =
  PackageBase & {
    shipment: PackageShipment;
    customer: PackageCustomer;
  };

/* =========================
   SCANNER RESULT
========================= */

export type PackageScanResult =
  PackageBase & {
    shipment: PackageShipment;
  };

/* =========================
   CREATE PACKAGE
========================= */

export type CreatePackageInput = {
  shipmentId: string;

  itemName: string;
  description?: string | null;

  quantity: number;

  weight?: string | null;
  length?: string | null;
  width?: string | null;
  height?: string | null;
};

/* =========================
   UPDATE PACKAGE
========================= */

export type UpdatePackageInput = {
  itemName?: string;
  description?: string | null;

  quantity?: number;

  weight?: string | null;
  length?: string | null;
  width?: string | null;
  height?: string | null;

  status?: PackageStatus;
};

/* =========================
   PUBLIC TRACKING
========================= */

export type PublicPackageTracking = {
  package: {
    trackingCode: string;
    itemName: string;
    quantity: number;
    weight: string | null;
    status: PackageStatus;
  };

  shipment: {
    trackingNumber: string;
    origin: string;
    destination: string;
    transportMethod: string;
    status: string;
  };
};