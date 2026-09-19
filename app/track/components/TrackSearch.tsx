"use client";

import { FormEvent, useState } from "react";
import {
  ArrowRight,
  CheckCircle2,
  Clock3,
  MapPin,
  Package,
  PackageSearch,
  Ship,
  TriangleAlert,
  Truck,
} from "lucide-react";
import { motion } from "framer-motion";

type TrackingResult = {
  package: {
    trackingCode: string;
    itemName: string;
    quantity: number;
    weight: number | null;
    status: string;
  };
  shipment: {
    trackingNumber: string;
    origin: string;
    destination: string;
    transportMethod: string;
    status: string;
  };
};

const packageStatuses = [
  "RECEIVED",
  "IN_WAREHOUSE",
  "IN_TRANSIT",
  "DELIVERED",
];

const statusLabels: Record<string, string> = {
  RECEIVED: "Colis reçu",
  IN_WAREHOUSE: "En entrepôt",
  IN_TRANSIT: "En transit",
  DELIVERED: "Livré",
  DAMAGED: "Endommagé",
  LOST: "Perdu",
};

const shipmentStatusLabels: Record<string, string> = {
  PENDING: "En attente",
  RECEIVED: "Reçu",
  IN_WAREHOUSE: "En entrepôt",
  IN_TRANSIT: "En transit",
  ARRIVED: "Arrivé",
  CUSTOMS: "En douane",
  READY_FOR_PICKUP: "Prêt pour livraison",
  PICKED_UP: "Livré",
  CANCELLED: "Annulé",
};

export function TrackSearch() {
  const [trackingCode, setTrackingCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] =
    useState<TrackingResult | null>(null);
  const [error, setError] = useState("");

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    const code = trackingCode.trim();

    if (!code) return;

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/package/public-track/${encodeURIComponent(
          code,
        )}`,
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Colis introuvable",
        );
      }

      setResult(data);
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Une erreur est survenue.",
      );
    } finally {
      setLoading(false);
    }
  }

  const currentStatusIndex = result
    ? packageStatuses.indexOf(result.package.status)
    : -1;

  return (
    <section className="bg-slate-50 pt-24 pb-24 sm:pb-32">
      <div className="mx-auto max-w-4xl px-6">

        {/* SEARCH */}
        <motion.div
          initial={{
            opacity: 0,
            y: 20,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          viewport={{
            once: true,
            amount: 0.3,
          }}
          transition={{
            duration: 0.6,
          }}
          className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary-light text-primary">
              <PackageSearch size={20} />
            </div>

            <div className="min-w-0">
              <h2 className="text-lg font-bold text-slate-950">
                Rechercher un colis
              </h2>

              <p className="mt-0.5 text-sm text-slate-500">
                Utilisez votre numéro de suivi.
              </p>
            </div>
          </div>

          <form
            onSubmit={handleSubmit}
            className="mt-6"
          >
            <label
              htmlFor="trackingCode"
              className="mb-2 block text-sm font-semibold text-slate-700"
            >
              Numéro de suivi
            </label>

            <div className="flex w-full min-w-0 flex-col gap-3 sm:flex-row">
              <input
                id="trackingCode"
                type="text"
                value={trackingCode}
                onChange={(event) =>
                  setTrackingCode(event.target.value)
                }
                placeholder="Ex : PKG-20260912-5E0B0543"
                disabled={loading}
                className="h-12 min-h-12 w-full min-w-0 shrink-0 flex-1 rounded-lg border border-slate-200 bg-white px-4 text-sm font-medium text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-primary focus:ring-2 focus:ring-primary/10 disabled:cursor-not-allowed disabled:bg-slate-50 sm:w-auto"
              />

              <button
                type="submit"
                disabled={
                  loading || !trackingCode.trim()
                }
                className="inline-flex h-12 min-h-12 w-full shrink-0 cursor-pointer items-center justify-center gap-2 rounded-lg bg-primary px-6 text-sm font-bold text-white transition-colors hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-70 sm:w-auto"
              >
                {loading ? (
                  <>
                    <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />

                    <span>
                      Recherche...
                    </span>
                  </>
                ) : (
                  <>
                    <span>
                      Suivre le colis
                    </span>

                    <ArrowRight size={17} />
                  </>
                )}
              </button>
            </div>
          </form>

          {error && (
            <motion.div
              initial={{
                opacity: 0,
                y: 10,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              className="mt-5 flex gap-x-4 rounded-lg border border-red-100 bg-red-50 px-4 py-3"
            >
            <TriangleAlert size={16} className=" text-red-600" />
              <p className="text-sm font-medium text-red-600">
                {error}
              </p>
            </motion.div>
          )}

          <div className="mt-5 flex items-start gap-2 rounded-lg bg-slate-50 px-4 py-3">
            <PackageSearch
              size={16}
              className="mt-0.5 shrink-0 text-slate-400"
            />

            <p className="text-xs leading-5 text-slate-500">
              Votre numéro de suivi se trouve généralement
              sur votre étiquette ou votre confirmation
              d'expédition.
            </p>
          </div>
        </motion.div>

        {/* RESULT */}
        {result && (
          <motion.div
            initial={{
              opacity: 0,
              y: 25,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.5,
            }}
            className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white"
          >
            {/* HEADER */}
            <div className="border-b border-slate-100 px-6 py-6 sm:px-8">
              <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0">
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Numéro de suivi
                  </p>

                  <h2 className="mt-1 break-all text-xl font-bold text-slate-950">
                    {result.package.trackingCode}
                  </h2>
                </div>

                <div className="inline-flex w-fit shrink-0 items-center gap-2 rounded-full bg-primary-light px-4 py-2 text-sm font-bold text-primary">
                  <span className="h-2 w-2 rounded-full bg-primary" />

                  {statusLabels[
                    result.package.status
                  ] || result.package.status}
                </div>
              </div>
            </div>

            {/* ROUTE */}
            <div className="border-b border-slate-100 px-6 py-6 sm:px-8">
              <div className="grid gap-6 sm:grid-cols-[1fr_auto_1fr] sm:items-center">
                <div className="min-w-0">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400">
                    <MapPin size={14} />
                    Départ
                  </div>

                  <p className="mt-2 break-words text-xl font-bold text-slate-950">
                    {result.shipment.origin}
                  </p>
                </div>

                <div className="hidden h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary-light text-primary sm:flex">
                  {result.shipment.transportMethod ===
                  "SEA" ? (
                    <Ship size={19} />
                  ) : (
                    <Truck size={19} />
                  )}
                </div>

                <div className="min-w-0 sm:text-right">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400 sm:justify-end">
                    <MapPin size={14} />
                    Destination
                  </div>

                  <p className="mt-2 break-words text-xl font-bold text-slate-950">
                    {result.shipment.destination}
                  </p>
                </div>
              </div>

              <div className="mt-5 flex flex-wrap gap-2">
                <span className="max-w-full break-all rounded-lg bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-600">
                  Expédition :{" "}
                  {result.shipment.trackingNumber}
                </span>

                <span className="rounded-lg bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-600">
                  Transport :{" "}
                  {result.shipment.transportMethod}
                </span>

                <span className="rounded-lg bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-600">
                  {shipmentStatusLabels[
                    result.shipment.status
                  ] || result.shipment.status}
                </span>
              </div>
            </div>

            {/* PACKAGE INFO */}
            <div className="grid border-b border-slate-100 sm:grid-cols-3">
              <div className="border-b border-slate-100 px-6 py-5 sm:border-b-0 sm:border-r sm:px-8">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400">
                  <Package size={15} />
                  Article
                </div>

                <p className="mt-2 break-words text-sm font-bold text-slate-950">
                  {result.package.itemName}
                </p>
              </div>

              <div className="border-b border-slate-100 px-6 py-5 sm:border-b-0 sm:border-r sm:px-8">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Quantité
                </p>

                <p className="mt-2 text-sm font-bold text-slate-950">
                  {result.package.quantity}
                </p>
              </div>

              <div className="px-6 py-5 sm:px-8">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Poids
                </p>

                <p className="mt-2 text-sm font-bold text-slate-950">
                  {result.package.weight !== null
                    ? `${result.package.weight.toLocaleString(
                        "fr-FR",
                        {
                          maximumFractionDigits: 3,
                        },
                      )} kg`
                    : "-"}
                </p>
              </div>
            </div>

            {/* TIMELINE */}
            <div className="px-6 py-7 sm:px-8 sm:py-8">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Progression
                  </p>

                  <h3 className="mt-1 text-lg font-bold text-slate-950">
                    Suivi du colis
                  </h3>
                </div>

                <Clock3
                  size={20}
                  className="text-slate-300"
                />
              </div>

              <div className="mt-8">
                {packageStatuses.map(
                  (status, index) => {
                    const completed =
                      index <= currentStatusIndex;

                    const isLast =
                      index ===
                      packageStatuses.length - 1;

                    return (
                      <div
                        key={status}
                        className="relative flex gap-4"
                      >
                        {!isLast && (
                          <div
                            className={`absolute left-[15px] top-8 h-full w-px ${
                              index <
                              currentStatusIndex
                                ? "bg-primary"
                                : "bg-slate-200"
                            }`}
                          />
                        )}

                        <div
                          className={`relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                            completed
                              ? "bg-primary text-white"
                              : "border border-slate-200 bg-white text-slate-300"
                          }`}
                        >
                          <CheckCircle2
                            size={16}
                          />
                        </div>

                        <div className="pb-7">
                          <p
                            className={`text-sm font-bold ${
                              completed
                                ? "text-slate-950"
                                : "text-slate-400"
                            }`}
                          >
                            {statusLabels[status]}
                          </p>

                          {index ===
                            currentStatusIndex && (
                            <p className="mt-1 text-xs font-medium text-primary">
                              Statut actuel
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  },
                )}
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
}

