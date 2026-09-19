"use client";

import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import {
  createPackage,
  deletePackage,
  getPackage,
  getPackageByTrackingCode,
  getPackages,
  getPackagesByShipment,
  getPublicPackageTracking,
  updatePackage,
} from "../services/package.service";

import type {
  CreatePackageInput,
  Package,
  PackageBase,
  PackageScanResult,
  PublicPackageTracking,
  UpdatePackageInput,
} from "../types/package.types";

/* =========================
   QUERY KEYS
========================= */

export const packageKeys = {
  all: ["packages"] as const,

  lists: () =>
    [...packageKeys.all, "list"] as const,

  list: () =>
    [...packageKeys.lists()] as const,

  shipment: (
    shipmentId: string,
  ) =>
    [
      ...packageKeys.all,
      "shipment",
      shipmentId,
    ] as const,

  details: () =>
    [
      ...packageKeys.all,
      "detail",
    ] as const,

  detail: (
    id: string,
  ) =>
    [
      ...packageKeys.details(),
      id,
    ] as const,

  tracking: (
    trackingCode: string,
  ) =>
    [
      ...packageKeys.all,
      "tracking",
      trackingCode,
    ] as const,

  publicTracking: (
    trackingCode: string,
  ) =>
    [
      ...packageKeys.all,
      "public-tracking",
      trackingCode,
    ] as const,
};

/* =========================
   GET ALL PACKAGES
========================= */

export function usePackages() {
  return useQuery<Package[]>({
    queryKey: packageKeys.list(),

    queryFn: async () => {
      const response =
        await getPackages();

      return response.data.data;
    },

    staleTime: 60 * 1000,
  });
}

/* =========================
   GET PACKAGES BY SHIPMENT
========================= */

export function usePackagesByShipment(
  shipmentId: string,
) {
  return useQuery<PackageBase[]>({
    queryKey:
      packageKeys.shipment(
        shipmentId,
      ),

    queryFn: async () => {
      const response =
        await getPackagesByShipment(
          shipmentId,
        );

      return response.data.data;
    },

    enabled: !!shipmentId,

    staleTime: 60 * 1000,
  });
}

/* =========================
   GET ONE PACKAGE
========================= */

export function usePackage(
  id: string,
) {
  return useQuery<Package>({
    queryKey:
      packageKeys.detail(id),

    queryFn: async () => {
      const response =
        await getPackage(id);

      return response.data.data;
    },

    enabled: !!id,

    staleTime: 60 * 1000,
  });
}

/* =========================
   GET PACKAGE BY TRACKING
========================= */

export function usePackageByTrackingCode(
  trackingCode: string,
) {
  return useQuery<PackageScanResult>({
    queryKey:
      packageKeys.tracking(
        trackingCode,
      ),

    queryFn: async () => {
      const response =
        await getPackageByTrackingCode(
          trackingCode,
        );

      return {
        ...response.data.package,

        shipment:
          response.data.shipment,
      };
    },

    enabled: !!trackingCode,

    staleTime: 30 * 1000,
  });
}

/* =========================
   PUBLIC TRACKING
========================= */

export function usePublicPackageTracking(
  trackingCode: string,
) {
  return useQuery<PublicPackageTracking>({
    queryKey:
      packageKeys.publicTracking(
        trackingCode,
      ),

    queryFn: async () => {
      const response =
        await getPublicPackageTracking(
          trackingCode,
        );

      return response.data.data;
    },

    enabled: !!trackingCode,

    staleTime: 30 * 1000,
  });
}

/* =========================
   CREATE PACKAGE
========================= */

export function useCreatePackage() {
  const queryClient =
    useQueryClient();

  return useMutation({
    mutationFn: (
      data: CreatePackageInput,
    ) =>
      createPackage(data),

    onSuccess: (
      _response,
      variables,
    ) => {
      queryClient.invalidateQueries({
        queryKey:
          packageKeys.shipment(
            variables.shipmentId,
          ),
      });

      queryClient.invalidateQueries({
        queryKey:
          packageKeys.list(),
      });
    },
  });
}

/* =========================
   UPDATE PACKAGE
========================= */

export function useUpdatePackage() {
  const queryClient =
    useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: UpdatePackageInput;
    }) =>
      updatePackage(
        id,
        data,
      ),

    onSuccess: (
      _response,
      variables,
    ) => {
      queryClient.invalidateQueries({
        queryKey:
          packageKeys.detail(
            variables.id,
          ),
      });

      queryClient.invalidateQueries({
        queryKey:
          packageKeys.all,
      });
    },
  });
}

/* =========================
   DELETE PACKAGE
========================= */

export function useDeletePackage() {
  const queryClient =
    useQueryClient();

  return useMutation({
    mutationFn: (
      id: string,
    ) =>
      deletePackage(id),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey:
          packageKeys.all,
      });
    },
  });
}