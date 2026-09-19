
"use client";

import { useEffect, useState } from "react";
import { AxiosError } from "axios";
import { Loader2, X } from "lucide-react";

import {
  useCreateWarehouse,
  useUpdateWarehouse,
} from "@/app/hooks/useWarehouses";

import type {
  CreateWarehouseInput,
  UpdateWarehouseInput,
  Warehouse,
} from "@/app/types/warehouse.type";

type WarehouseFormModalProps = {
  open: boolean;
  warehouse?: Warehouse | null;
  onClose: () => void;
};

type FormData = {
  name: string;
  address: string;
  city: string;
  country: string;
  isActive: boolean;
};

type ApiError = {
  message?: string;
  errors?: Record<string, string[]>;
};

const emptyForm: FormData = {
  name: "",
  address: "",
  city: "",
  country: "",
  isActive: true,
};

export function WarehouseFormModal({
  open,
  warehouse,
  onClose,
}: WarehouseFormModalProps) {
  const isEditing = !!warehouse;

  const createMutation =
    useCreateWarehouse();

  const updateMutation =
    useUpdateWarehouse();

  const [formData, setFormData] =
    useState<FormData>({
      ...emptyForm,
    });

  const [errorMessage, setErrorMessage] =
    useState("");

  const [fieldErrors, setFieldErrors] =
    useState<Record<string, string>>({});

  const isPending =
    createMutation.isPending ||
    updateMutation.isPending;

  useEffect(() => {
    if (!open) {
      return;
    }

    setErrorMessage("");
    setFieldErrors({});

    if (warehouse) {
      setFormData({
        name: warehouse.name ?? "",
        address: warehouse.address ?? "",
        city: warehouse.city ?? "",
        country: warehouse.country ?? "",
        isActive: warehouse.isActive,
      });
    } else {
      setFormData({
        ...emptyForm,
      });
    }
  }, [open, warehouse]);

  if (!open) {
    return null;
  }

  function handleChange(
    field: keyof FormData,
    value: string | boolean,
  ) {
    setFormData((current) => ({
      ...current,
      [field]: value,
    }));

    setFieldErrors((current) => ({
      ...current,
      [field]: "",
    }));

    setErrorMessage("");
  }

  function normalizeValue(
    value: string,
  ): string | null {
    const trimmed = value.trim();

    return trimmed === ""
      ? null
      : trimmed;
  }

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    setErrorMessage("");
    setFieldErrors({});

    if (!formData.name.trim()) {
      setFieldErrors({
        name: "Le nom est requis.",
      });

      return;
    }

    const baseData = {
      name: formData.name.trim(),
      address: normalizeValue(
        formData.address,
      ),
      city: normalizeValue(
        formData.city,
      ),
      country: normalizeValue(
        formData.country,
      ),
    };

    try {
      if (isEditing && warehouse) {
        const data: UpdateWarehouseInput =
          {
            name: baseData.name,
            address: baseData.address,
            city: baseData.city,
            country: baseData.country,
            isActive: formData.isActive,
          };

        await updateMutation.mutateAsync({
          id: warehouse.id,
          data,
        });
      } else {
        const data: CreateWarehouseInput =
          {
            name: baseData.name,
            address: baseData.address,
            city: baseData.city,
            country: baseData.country,
          };

        await createMutation.mutateAsync(
          data,
        );
      }

      onClose();
    } catch (error) {
      const axiosError =
        error as AxiosError<ApiError>;

      const responseData =
        axiosError.response?.data;

      setErrorMessage(
        responseData?.message ??
          "Une erreur est survenue. Veuillez réessayer.",
      );

      if (responseData?.errors) {
        const formattedErrors: Record<
          string,
          string
        > = {};

        Object.entries(
          responseData.errors,
        ).forEach(([field, messages]) => {
          formattedErrors[field] =
            messages?.[0] ?? "";
        });

        setFieldErrors(
          formattedErrors,
        );
      }
    }
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/40 p-4">
      {/* Overlay */}
      <div
        className="absolute inset-0"
        onClick={() => {
          if (!isPending) {
            onClose();
          }
        }}
      />

      {/* Modal */}
      <div className="relative z-10 w-full max-w-2xl overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4 sm:px-6">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">
              {isEditing
                ? "Modifier l’entrepôt"
                : "Ajouter un entrepôt"}
            </h2>

            <p className="mt-0.5 text-sm text-slate-500">
              {isEditing
                ? "Modifiez les informations de l’entrepôt."
                : "Ajoutez un nouvel entrepôt à votre organisation."}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={isPending}
            className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
            aria-label="Fermer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div className="max-h-[70vh] overflow-y-auto px-5 py-5 sm:px-6">
            {errorMessage && (
              <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                {errorMessage}
              </div>
            )}

            <div className="grid gap-5 sm:grid-cols-2">
              {/* Name */}
              <div className="sm:col-span-2">
                <label
                  htmlFor="warehouse-name"
                  className="mb-1.5 block text-sm font-medium text-slate-700"
                >
                  Nom de l’entrepôt{" "}
                  <span className="text-red-500">
                    *
                  </span>
                </label>

                <input
                  id="warehouse-name"
                  type="text"
                  value={formData.name}
                  onChange={(event) =>
                    handleChange(
                      "name",
                      event.target.value,
                    )
                  }
                  placeholder="Ex. Entrepôt Central"
                  disabled={isPending}
                  className={`h-11 w-full rounded-lg border bg-white px-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-[#1677FF] focus:ring-2 focus:ring-[#1677FF]/10 disabled:cursor-not-allowed disabled:bg-slate-50 ${
                    fieldErrors.name
                      ? "border-red-400"
                      : "border-slate-200"
                  }`}
                />

                {fieldErrors.name && (
                  <p className="mt-1 text-xs text-red-500">
                    {fieldErrors.name}
                  </p>
                )}
              </div>

              {/* Address */}
              <div className="sm:col-span-2">
                <label
                  htmlFor="warehouse-address"
                  className="mb-1.5 block text-sm font-medium text-slate-700"
                >
                  Adresse
                </label>

                <input
                  id="warehouse-address"
                  type="text"
                  value={formData.address}
                  onChange={(event) =>
                    handleChange(
                      "address",
                      event.target.value,
                    )
                  }
                  placeholder="Adresse de l’entrepôt"
                  disabled={isPending}
                  className={`h-11 w-full rounded-lg border bg-white px-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-[#1677FF] focus:ring-2 focus:ring-[#1677FF]/10 disabled:cursor-not-allowed disabled:bg-slate-50 ${
                    fieldErrors.address
                      ? "border-red-400"
                      : "border-slate-200"
                  }`}
                />

                {fieldErrors.address && (
                  <p className="mt-1 text-xs text-red-500">
                    {fieldErrors.address}
                  </p>
                )}
              </div>

              {/* City */}
              <div>
                <label
                  htmlFor="warehouse-city"
                  className="mb-1.5 block text-sm font-medium text-slate-700"
                >
                  Ville
                </label>

                <input
                  id="warehouse-city"
                  type="text"
                  value={formData.city}
                  onChange={(event) =>
                    handleChange(
                      "city",
                      event.target.value,
                    )
                  }
                  placeholder="Ex. Kigali"
                  disabled={isPending}
                  className={`h-11 w-full rounded-lg border bg-white px-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-[#1677FF] focus:ring-2 focus:ring-[#1677FF]/10 disabled:cursor-not-allowed disabled:bg-slate-50 ${
                    fieldErrors.city
                      ? "border-red-400"
                      : "border-slate-200"
                  }`}
                />

                {fieldErrors.city && (
                  <p className="mt-1 text-xs text-red-500">
                    {fieldErrors.city}
                  </p>
                )}
              </div>

              {/* Country */}
              <div>
                <label
                  htmlFor="warehouse-country"
                  className="mb-1.5 block text-sm font-medium text-slate-700"
                >
                  Pays
                </label>

                <input
                  id="warehouse-country"
                  type="text"
                  value={formData.country}
                  onChange={(event) =>
                    handleChange(
                      "country",
                      event.target.value,
                    )
                  }
                  placeholder="Ex. Rwanda"
                  disabled={isPending}
                  className={`h-11 w-full rounded-lg border bg-white px-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-[#1677FF] focus:ring-2 focus:ring-[#1677FF]/10 disabled:cursor-not-allowed disabled:bg-slate-50 ${
                    fieldErrors.country
                      ? "border-red-400"
                      : "border-slate-200"
                  }`}
                />

                {fieldErrors.country && (
                  <p className="mt-1 text-xs text-red-500">
                    {fieldErrors.country}
                  </p>
                )}
              </div>

              {/* Status - edit only */}
              {isEditing && (
                <div className="sm:col-span-2">
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">
                    Statut
                  </label>

                  <button
                    type="button"
                    onClick={() =>
                      handleChange(
                        "isActive",
                        !formData.isActive,
                      )
                    }
                    disabled={isPending}
                    className="flex w-full items-center justify-between rounded-lg border border-slate-200 px-4 py-3 text-left transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <div>
                      <p className="text-sm font-medium text-slate-800">
                        {formData.isActive
                          ? "Entrepôt actif"
                          : "Entrepôt inactif"}
                      </p>

                      <p className="mt-0.5 text-xs text-slate-400">
                        {formData.isActive
                          ? "Cet entrepôt peut être utilisé."
                          : "Cet entrepôt n'est plus disponible."}
                      </p>
                    </div>

                    <div
                      className={`relative h-6 w-11 rounded-full transition ${
                        formData.isActive
                          ? "bg-[#1677FF]"
                          : "bg-slate-300"
                      }`}
                    >
                      <span
                        className={`absolute top-1 h-4 w-4 rounded-full bg-white shadow-sm transition ${
                          formData.isActive
                            ? "left-6"
                            : "left-1"
                        }`}
                      />
                    </div>
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="flex flex-col-reverse gap-3 border-t border-slate-200 bg-slate-50/50 px-5 py-4 sm:flex-row sm:justify-end sm:px-6">
            <button
              type="button"
              onClick={onClose}
              disabled={isPending}
              className="h-10 rounded-lg border border-slate-200 bg-white px-4 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Annuler
            </button>

            <button
              type="submit"
              disabled={
                isPending ||
                !formData.name.trim()
              }
              className="flex h-10 items-center justify-center gap-2 rounded-lg bg-[#1677FF] px-5 text-sm font-medium text-white transition hover:bg-[#0B5ED7] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isPending && (
                <Loader2 className="h-4 w-4 animate-spin" />
              )}

              {isEditing
                ? "Enregistrer"
                : "Ajouter l’entrepôt"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

