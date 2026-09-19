"use client";

import {
  useEffect,
  useState,
} from "react";

import {
  X,
  Loader2,
} from "lucide-react";

import {
  useCreatePricing,
  useUpdatePricing,
} from "@/app/hooks/usePricing";

import type {
  CreatePricingInput,
  PricingRule,
  PricingType,
  TransportMethod,
  UpdatePricingInput,
} from "@/app/types/pricing.type";

type PricingFormModalProps = {
  open: boolean;
  pricing?: PricingRule | null;
  onClose: () => void;
};

type FormData = {
  name: string;
  origin: string;
  destination: string;
  transportMethod: "" | TransportMethod;
  pricingType: PricingType;
  price: string;
  currency: string;
  isActive: boolean;
};

const initialForm: FormData = {
  name: "",
  origin: "",
  destination: "",
  transportMethod: "",
  pricingType: "PER_KG",
  price: "",
  currency: "XAF",
  isActive: true,
};

export function PricingFormModal({
  open,
  pricing,
  onClose,
}: PricingFormModalProps) {
  const isEditing = !!pricing;

  const createMutation =
    useCreatePricing();

  const updateMutation =
    useUpdatePricing();

  const [form, setForm] =
    useState<FormData>(initialForm);

  const [error, setError] =
    useState("");

  useEffect(() => {
    if (!open) {
      return;
    }

    setError("");

    if (pricing) {
      setForm({
        name: pricing.name,
        origin: pricing.origin ?? "",
        destination:
          pricing.destination ?? "",
        transportMethod:
          pricing.transportMethod ?? "",
        pricingType: pricing.pricingType,
        price: pricing.price,
        currency: pricing.currency,
        isActive: pricing.isActive,
      });

      return;
    }

    setForm(initialForm);
  }, [open, pricing]);

  if (!open) {
    return null;
  }

  const isPending =
    createMutation.isPending ||
    updateMutation.isPending;

  const handleChange = (
    field: keyof FormData,
    value: string | boolean,
  ) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    setError("");

    if (!form.name.trim()) {
      setError(
        "Le nom du tarif est requis.",
      );
      return;
    }

    if (!form.price.trim()) {
      setError("Le prix est requis.");
      return;
    }

    const priceRegex =
      /^\d+(\.\d{1,2})?$/;

    if (!priceRegex.test(form.price)) {
      setError(
        "Le prix doit être un nombre positif avec maximum 2 décimales.",
      );
      return;
    }

    if (form.currency.trim().length < 3) {
      setError("La devise est requise.");
      return;
    }

    const payload = {
      name: form.name.trim(),
      origin:
        form.origin.trim() || null,
      destination:
        form.destination.trim() || null,
      transportMethod:
        form.transportMethod || null,
      pricingType: form.pricingType,
      price: form.price.trim(),
      currency:
        form.currency.trim().toUpperCase(),
      isActive: form.isActive,
    };

    try {
      if (pricing) {
        await updateMutation.mutateAsync({
          id: pricing.id,
          data:
            payload satisfies UpdatePricingInput,
        });
      } else {
        await createMutation.mutateAsync(
          payload satisfies CreatePricingInput,
        );
      }

      onClose();
    } catch (error: any) {
      setError(
        error?.response?.data?.message ||
          "Une erreur est survenue. Veuillez réessayer.",
      );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Overlay */}
      <button
        type="button"
        aria-label="Fermer"
        onClick={onClose}
        className="absolute inset-0 bg-slate-950/40"
      />

      {/* Modal */}
      <div className="relative z-10 w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">
              {isEditing
                ? "Modifier le tarif"
                : "Nouveau tarif"}
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              {isEditing
                ? "Modifiez les informations du tarif."
                : "Configurez une nouvelle règle de tarification."}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={isPending}
            className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600 disabled:cursor-not-allowed disabled:opacity-50"
            aria-label="Fermer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="max-h-[75vh] overflow-y-auto"
        >
          <div className="space-y-5 p-6">
            {error && (
              <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                {error}
              </div>
            )}

            {/* Nom */}
            <div>
              <label
                htmlFor="pricing-name"
                className="mb-1.5 block text-sm font-medium text-slate-700"
              >
                Nom du tarif
              </label>

              <input
                id="pricing-name"
                type="text"
                value={form.name}
                onChange={(event) =>
                  handleChange(
                    "name",
                    event.target.value,
                  )
                }
                placeholder="Ex. Fret aérien Chine"
                disabled={isPending}
                className="h-11 w-full rounded-lg border border-slate-200 px-3 text-sm text-slate-900 outline-none transition focus:border-[#1677FF] focus:ring-2 focus:ring-[#1677FF]/10 disabled:bg-slate-50"
              />
            </div>

            {/* Origin / Destination */}
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="pricing-origin"
                  className="mb-1.5 block text-sm font-medium text-slate-700"
                >
                  Origine
                </label>

                <input
                  id="pricing-origin"
                  type="text"
                  value={form.origin}
                  onChange={(event) =>
                    handleChange(
                      "origin",
                      event.target.value,
                    )
                  }
                  placeholder="Ex. Guangzhou"
                  disabled={isPending}
                  className="h-11 w-full rounded-lg border border-slate-200 px-3 text-sm text-slate-900 outline-none transition focus:border-[#1677FF] focus:ring-2 focus:ring-[#1677FF]/10 disabled:bg-slate-50"
                />
              </div>

              <div>
                <label
                  htmlFor="pricing-destination"
                  className="mb-1.5 block text-sm font-medium text-slate-700"
                >
                  Destination
                </label>

                <input
                  id="pricing-destination"
                  type="text"
                  value={form.destination}
                  onChange={(event) =>
                    handleChange(
                      "destination",
                      event.target.value,
                    )
                  }
                  placeholder="Ex. Libreville"
                  disabled={isPending}
                  className="h-11 w-full rounded-lg border border-slate-200 px-3 text-sm text-slate-900 outline-none transition focus:border-[#1677FF] focus:ring-2 focus:ring-[#1677FF]/10 disabled:bg-slate-50"
                />
              </div>
            </div>

            {/* Transport / Pricing type */}
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="pricing-transport"
                  className="mb-1.5 block text-sm font-medium text-slate-700"
                >
                  Méthode de transport
                </label>

                <select
                  id="pricing-transport"
                  value={form.transportMethod}
                  onChange={(event) =>
                    handleChange(
                      "transportMethod",
                      event.target.value,
                    )
                  }
                  disabled={isPending}
                  className="h-11 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none transition focus:border-[#1677FF] focus:ring-2 focus:ring-[#1677FF]/10 disabled:bg-slate-50"
                >
                  <option value="">
                    Toutes les méthodes
                  </option>
                  <option value="AIR">
                    Aérien
                  </option>
                  <option value="SEA">
                    Maritime
                  </option>
                  <option value="ROAD">
                    Routier
                  </option>
                  <option value="RAIL">
                    Ferroviaire
                  </option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="pricing-type"
                  className="mb-1.5 block text-sm font-medium text-slate-700"
                >
                  Type de tarification
                </label>

                <select
                  id="pricing-type"
                  value={form.pricingType}
                  onChange={(event) =>
                    handleChange(
                      "pricingType",
                      event.target.value as PricingType,
                    )
                  }
                  disabled={isPending}
                  className="h-11 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none transition focus:border-[#1677FF] focus:ring-2 focus:ring-[#1677FF]/10 disabled:bg-slate-50"
                >
                  <option value="PER_KG">
                    Par kilogramme
                  </option>

                  <option value="PER_CBM">
                    Par m³
                  </option>

                  <option value="FIXED">
                    Forfait fixe
                  </option>
                </select>
              </div>
            </div>

            {/* Price / Currency */}
            <div className="grid gap-5 sm:grid-cols-[1fr_140px]">
              <div>
                <label
                  htmlFor="pricing-price"
                  className="mb-1.5 block text-sm font-medium text-slate-700"
                >
                  Prix
                </label>

                <input
                  id="pricing-price"
                  type="text"
                  inputMode="decimal"
                  value={form.price}
                  onChange={(event) =>
                    handleChange(
                      "price",
                      event.target.value,
                    )
                  }
                  placeholder="Ex. 2500"
                  disabled={isPending}
                  className="h-11 w-full rounded-lg border border-slate-200 px-3 text-sm text-slate-900 outline-none transition focus:border-[#1677FF] focus:ring-2 focus:ring-[#1677FF]/10 disabled:bg-slate-50"
                />

                <p className="mt-1.5 text-xs text-slate-500">
                  {form.pricingType ===
                    "PER_KG" &&
                    "Montant facturé pour chaque kilogramme."}

                  {form.pricingType ===
                    "PER_CBM" &&
                    "Montant facturé pour chaque m³."}

                  {form.pricingType ===
                    "FIXED" &&
                    "Montant fixe pour l'expédition."}
                </p>
              </div>

              <div>
                <label
                  htmlFor="pricing-currency"
                  className="mb-1.5 block text-sm font-medium text-slate-700"
                >
                  Devise
                </label>

                <input
                  id="pricing-currency"
                  type="text"
                  maxLength={10}
                  value={form.currency}
                  onChange={(event) =>
                    handleChange(
                      "currency",
                      event.target.value.toUpperCase(),
                    )
                  }
                  placeholder="XAF"
                  disabled={isPending}
                  className="h-11 w-full rounded-lg border border-slate-200 px-3 text-sm uppercase text-slate-900 outline-none transition focus:border-[#1677FF] focus:ring-2 focus:ring-[#1677FF]/10 disabled:bg-slate-50"
                />
              </div>
            </div>

            {/* Active */}
            <div className="flex items-center justify-between rounded-lg border border-slate-200 p-4">
              <div>
                <p className="text-sm font-medium text-slate-900">
                  Tarif actif
                </p>

                <p className="mt-1 text-xs text-slate-500">
                  Un tarif inactif ne pourra pas être utilisé
                  pour de nouvelles expéditions.
                </p>
              </div>

              <button
                type="button"
                role="switch"
                aria-checked={form.isActive}
                disabled={isPending}
                onClick={() =>
                  handleChange(
                    "isActive",
                    !form.isActive,
                  )
                }
                className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${
                  form.isActive
                    ? "bg-[#1677FF]"
                    : "bg-slate-300"
                } disabled:cursor-not-allowed disabled:opacity-50`}
              >
                <span
                  className={`absolute top-1 h-4 w-4 rounded-full bg-white shadow-sm transition-transform ${
                    form.isActive
                      ? "translate-x-6"
                      : "translate-x-1"
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Footer */}
          <div className="flex flex-col-reverse gap-3 border-t border-slate-200 bg-slate-50/50 px-6 py-4 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              disabled={isPending}
              className="h-10 rounded-lg border border-slate-200 bg-white px-4 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Annuler
            </button>

            <button
              type="submit"
              disabled={isPending}
              className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-[#1677FF] px-5 text-sm font-medium text-white transition-colors hover:bg-[#0B5ED7] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isPending && (
                <Loader2 className="h-4 w-4 animate-spin" />
              )}

              {isEditing
                ? "Enregistrer"
                : "Créer le tarif"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

