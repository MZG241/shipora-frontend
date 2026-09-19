export type Warehouse = {
  id: string;
  organizationId: string;

  name: string;
  code: string;

  address: string | null;
  city: string | null;
  country: string | null;

  isActive: boolean;

  createdAt: string;
  updatedAt: string;
};

export type CreateWarehouseInput = {
  name: string;
  address?: string | null;
  city?: string | null;
  country?: string | null;
};

export type UpdateWarehouseInput = {
  name?: string;
  address?: string | null;
  city?: string | null;
  country?: string | null;
  isActive?: boolean;
};