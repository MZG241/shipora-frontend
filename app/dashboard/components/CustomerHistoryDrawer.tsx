"use client";

import { useState } from "react";
import {
  ArrowRight,
  CalendarDays,
  CircleDollarSign,
  Clock3,
  Mail,
  MapPin,
  Package,
  Phone,
  Ship,
  UserRound,
  X,
} from "lucide-react";

import { useCustomerHistory } from "@/app/hooks/useCustomers";
import type {
  CustomerHistoryPackage,
  CustomerHistoryPayment,
  CustomerHistoryShipment,
} from "@/app/types/customer.type";

const tabs = [
  { id: "overview", label: "Apercu" },
  { id: "shipments", label: "Expeditions" },
  { id: "packages", label: "Colis" },
  { id: "payments", label: "Paiements" },
] as const;

type TabId = (typeof tabs)[number]["id"];

type CustomerHistoryDrawerProps = {
  customerId: string | null;
  onClose: () => void;
};

export function CustomerHistoryDrawer({
  customerId,
  onClose,
}: CustomerHistoryDrawerProps) {
  const [activeTab, setActiveTab] = useState<TabId>("overview");
  const { data, isLoading, isError, refetch } =
    useCustomerHistory(customerId ?? undefined);

  const open = !!customerId;

  function handleClose() {
    setActiveTab("overview");
    onClose();
  }

  return (
    <>
      <div
        aria-hidden={!open}
        onClick={handleClose}
        className={`fixed inset-0 z-40 bg-slate-950/30 transition-opacity ${
          open ? "visible opacity-100" : "invisible opacity-0"
        }`}
      />

      <aside
        role="dialog"
        aria-modal="true"
        aria-labelledby="customer-history-title"
        className={`fixed inset-y-0 right-0 z-50 flex w-full max-w-2xl flex-col bg-white shadow-2xl transition-transform duration-300 ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex shrink-0 items-center justify-between border-b border-slate-200 px-5 py-4 sm:px-6">
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-wide text-[#1677FF]">
              Historique client
            </p>
            <h2
              id="customer-history-title"
              className="mt-1 truncate text-xl font-bold text-slate-950"
            >
              {data?.customer.name ?? "Client"}
            </h2>
          </div>

          <button
            type="button"
            onClick={handleClose}
            className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
            aria-label="Fermer l'historique"
            title="Fermer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex shrink-0 gap-1 overflow-x-auto border-b border-slate-200 px-5 sm:px-6">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`whitespace-nowrap border-b-2 px-3 py-3 text-sm font-medium transition ${
                activeTab === tab.id
                  ? "border-[#1677FF] text-[#1677FF]"
                  : "border-transparent text-slate-500 hover:text-slate-900"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto bg-slate-50 p-5 sm:p-6">
          {isLoading ? (
            <HistoryLoading />
          ) : isError || !data ? (
            <div className="flex min-h-[260px] flex-col items-center justify-center text-center">
              <p className="text-sm font-semibold text-slate-900">
                Impossible de charger l'historique
              </p>
              <p className="mt-1 max-w-sm text-sm text-slate-500">
                Verifiez votre connexion puis reessayez.
              </p>
              <button
                type="button"
                onClick={() => refetch()}
                className="mt-4 rounded-lg bg-[#1677FF] px-4 py-2 text-sm font-medium text-white hover:bg-[#0f68e8]"
              >
                Reessayer
              </button>
            </div>
          ) : (
            <>
              {activeTab === "overview" && <Overview history={data} />}
              {activeTab === "shipments" && (
                <ShipmentList shipments={data.shipments} />
              )}
              {activeTab === "packages" && (
                <PackageList packages={data.packages} />
              )}
              {activeTab === "payments" && (
                <PaymentList payments={data.payments} />
              )}
            </>
          )}
        </div>
      </aside>
    </>
  );
}

function Overview({ history }: { history: NonNullable<ReturnType<typeof useCustomerHistory>["data"]> }) {
  const { customer, shipments, packages, payments } = history;

  return (
    <div className="space-y-5">
      <section className="rounded-xl border border-slate-200 bg-white p-5">
        <div className="flex items-start gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#EAF3FF] text-sm font-bold text-[#1677FF]">
            {getInitials(customer.name)}
          </div>
          <div className="min-w-0">
            <h3 className="font-semibold text-slate-900">{customer.name}</h3>
            <div className="mt-2 space-y-1.5 text-sm text-slate-500">
              {customer.email && (
                <p className="flex items-center gap-2"><Mail className="h-4 w-4" />{customer.email}</p>
              )}
              {customer.phone && (
                <p className="flex items-center gap-2"><Phone className="h-4 w-4" />{customer.phone}</p>
              )}
              {(customer.city || customer.country) && (
                <p className="flex items-center gap-2"><MapPin className="h-4 w-4" />{[customer.city, customer.country].filter(Boolean).join(", ")}</p>
              )}
            </div>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-3 gap-3">
        <SummaryCard icon={Ship} label="Expeditions" value={shipments.length} />
        <SummaryCard icon={Package} label="Colis" value={packages.length} />
        <SummaryCard icon={CircleDollarSign} label="Paiements" value={payments.length} />
      </div>

      <section className="rounded-xl border border-slate-200 bg-white p-5">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-slate-900">Derniere activite</h3>
          <CalendarDays className="h-4 w-4 text-slate-400" />
        </div>
        <div className="mt-4 space-y-3">
          {shipments.slice(0, 3).map((shipment) => (
            <div key={shipment.id} className="flex items-center justify-between gap-3 border-b border-slate-100 pb-3 last:border-0 last:pb-0">
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-slate-800">{shipment.trackingNumber}</p>
                <p className="text-xs text-slate-500">{shipment.origin} <ArrowRight className="mx-1 inline h-3 w-3" /> {shipment.destination}</p>
              </div>
              <StatusBadge value={shipment.status} />
            </div>
          ))}
          {shipments.length === 0 && <EmptyState label="Aucune expedition pour ce client." />}
        </div>
      </section>
    </div>
  );
}

function ShipmentList({ shipments }: { shipments: CustomerHistoryShipment[] }) {
  if (shipments.length === 0) return <EmptyState label="Aucune expedition pour ce client." />;

  return (
    <div className="space-y-3">
      {shipments.map((shipment) => (
        <div key={shipment.id} className="rounded-xl border border-slate-200 bg-white p-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="font-semibold text-slate-900">{shipment.trackingNumber}</p>
              <p className="mt-1 text-sm text-slate-500">{shipment.origin} <ArrowRight className="mx-1 inline h-3 w-3" /> {shipment.destination}</p>
            </div>
            <StatusBadge value={shipment.status} />
          </div>
          <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500">
            <span>{formatValue(shipment.transportMethod)}</span>
            <span>{formatDate(shipment.createdAt)}</span>
            {shipment.deliveredAt && <span>Livree le {formatDate(shipment.deliveredAt)}</span>}
          </div>
        </div>
      ))}
    </div>
  );
}

function PackageList({ packages }: { packages: CustomerHistoryPackage[] }) {
  if (packages.length === 0) return <EmptyState label="Aucun colis pour ce client." />;

  return (
    <div className="space-y-3">
      {packages.map((item) => (
        <div key={item.id} className="rounded-xl border border-slate-200 bg-white p-4">
          <div className="flex items-start justify-between gap-3">
            <div className="flex min-w-0 items-start gap-3">
              <Package className="mt-0.5 h-5 w-5 shrink-0 text-[#1677FF]" />
              <div className="min-w-0">
                <p className="truncate font-semibold text-slate-900">{item.itemName}</p>
                <p className="mt-1 text-xs text-slate-500">{item.trackingCode} · Quantite {item.quantity}</p>
              </div>
            </div>
            <StatusBadge value={item.status} />
          </div>
          <p className="mt-3 text-xs text-slate-500">Ajoute le {formatDate(item.createdAt)}{item.weight ? ` · ${item.weight} kg` : ""}</p>
        </div>
      ))}
    </div>
  );
}

function PaymentList({ payments }: { payments: CustomerHistoryPayment[] }) {
  if (payments.length === 0) return <EmptyState label="Aucun paiement pour ce client." />;

  return (
    <div className="space-y-3">
      {payments.map((payment) => (
        <div key={payment.id} className="rounded-xl border border-slate-200 bg-white p-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="font-semibold text-slate-900">{formatMoney(payment.amount, payment.currency)}</p>
              <p className="mt-1 text-xs text-slate-500">{payment.reference ?? payment.invoiceNumber ?? "Paiement"}</p>
            </div>
            <StatusBadge value={payment.status} />
          </div>
          <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500">
            <span>{formatValue(payment.method)}</span>
            <span>{payment.paidAt ? formatDate(payment.paidAt) : formatDate(payment.createdAt)}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

function SummaryCard({ icon: Icon, label, value }: { icon: typeof Ship; label: string; value: number }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4">
      <Icon className="h-4 w-4 text-[#1677FF]" />
      <p className="mt-3 text-2xl font-bold text-slate-950">{value}</p>
      <p className="mt-1 text-xs text-slate-500">{label}</p>
    </div>
  );
}

function StatusBadge({ value }: { value: string }) {
  return <span className="whitespace-nowrap rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-semibold text-slate-600">{formatValue(value)}</span>;
}

function EmptyState({ label }: { label: string }) {
  return <div className="flex min-h-[220px] items-center justify-center rounded-xl border border-dashed border-slate-300 bg-white px-6 text-center text-sm text-slate-500">{label}</div>;
}

function HistoryLoading() {
  return <div className="space-y-3">{[1, 2, 3, 4].map((item) => <div key={item} className="h-24 animate-pulse rounded-xl bg-slate-200" />)}</div>;
}

function getInitials(name: string) {
  return name.trim().split(/\s+/).slice(0, 2).map((word) => word.charAt(0)).join("").toUpperCase();
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("fr-FR", { day: "2-digit", month: "short", year: "numeric" }).format(new Date(value));
}

function formatMoney(amount: string, currency: string) {
  return `${Number(amount).toLocaleString("fr-FR", { maximumFractionDigits: 2 })} ${currency}`;
}

function formatValue(value: string) {
  return value.replaceAll("_", " ").toLowerCase().replace(/(^|\s)\S/g, (letter) => letter.toUpperCase());
}
