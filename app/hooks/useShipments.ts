"use client";

import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import {
  createShipment,
  deleteShipment,
  getShipment,
  getShipments,
  updateShipment,
} from "../services/shipment.service";

import type {
  CreateShipmentInput,
  UpdateShipmentInput,
} from "../types/shipment.types";

/* -------------------------------------------------------------------------- */
/* Query keys                                                                  */
/* -------------------------------------------------------------------------- */

export const shipmentKeys = {
  all: ["shipments"] as const,

  lists: () =>
    [...shipmentKeys.all, "list"] as const,

  list: (search?: string, page = 1) =>
    [
      ...shipmentKeys.lists(),
      search ?? "",
      page,
    ] as const,

  details: () =>
    [...shipmentKeys.all, "detail"] as const,

  detail: (id: string) =>
    [
      ...shipmentKeys.details(),
      id,
    ] as const,
};

/* -------------------------------------------------------------------------- */
/* Get all shipments                                                           */
/* -------------------------------------------------------------------------- */

export function useShipments(
  search?: string,
  page = 1,
) {
  const query = useQuery({
    queryKey: shipmentKeys.list(search, page),

    queryFn: async () => {
      const response =
        await getShipments(search, page);

      return response;
    },

    staleTime: 60 * 1000,
  });

  return {
    ...query,
    data: query.data?.data ?? [],
    pagination: query.data?.meta,
  };
}

/* -------------------------------------------------------------------------- */
/* Get one shipment                                                            */
/* -------------------------------------------------------------------------- */

export function useShipment(
  id: string,
) {
  return useQuery({
    queryKey: shipmentKeys.detail(id),

    queryFn: async () => {
      const response =
        await getShipment(id);

      return response.data;
    },

    enabled: !!id,

    staleTime: 60 * 1000,
  });
}

/* -------------------------------------------------------------------------- */
/* Create shipment                                                             */
/* -------------------------------------------------------------------------- */

export function useCreateShipment() {
  const queryClient =
    useQueryClient();

  return useMutation({
    mutationFn: (
      data: CreateShipmentInput,
    ) => createShipment(data),

    onSuccess: (response) => {
      queryClient.invalidateQueries({
        queryKey: shipmentKeys.lists(),
      });

      /*
       * Si le backend retourne l'expédition
       * créée, on peut immédiatement
       * alimenter son cache.
       */
      if (response.data) {
        queryClient.setQueryData(
          shipmentKeys.detail(
            response.data.id,
          ),
          response.data,
        );
      }
    },
  });
}

/* -------------------------------------------------------------------------- */
/* Update shipment                                                             */
/* -------------------------------------------------------------------------- */

export function useUpdateShipment() {
  const queryClient =
    useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: UpdateShipmentInput;
    }) =>
      updateShipment(
        id,
        data,
      ),

    onSuccess: (
      response,
      variables,
    ) => {
      /*
       * Rafraîchit les différentes
       * listes de shipments.
       */
      queryClient.invalidateQueries({
        queryKey: shipmentKeys.lists(),
      });

      /*
       * Met à jour directement
       * le détail du shipment.
       */
      queryClient.setQueryData(
        shipmentKeys.detail(
          variables.id,
        ),
        response.data,
      );
    },
  });
}

/* -------------------------------------------------------------------------- */
/* Delete shipment                                                             */
/* -------------------------------------------------------------------------- */

export function useDeleteShipment() {
  const queryClient =
    useQueryClient();

  return useMutation({
    mutationFn: (
      id: string,
    ) =>
      deleteShipment(id),

    onSuccess: (
      _response,
      shipmentId,
    ) => {
      /*
       * Rafraîchir les listes.
       */
      queryClient.invalidateQueries({
        queryKey: shipmentKeys.lists(),
      });

      /*
       * Supprimer le détail
       * du cache.
       */
      queryClient.removeQueries({
        queryKey:
          shipmentKeys.detail(
            shipmentId,
          ),
      });
    },
  });
}