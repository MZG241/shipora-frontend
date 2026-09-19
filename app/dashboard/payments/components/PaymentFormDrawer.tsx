"use client";

import { useEffect, useMemo, useState } from "react";
import { Search, Save, X } from "lucide-react";
import { useBillings } from "@/app/hooks/useBilling";
import { useCreatePayment, useUpdatePayment } from "@/app/hooks/usePayment";
import type { Payment, PaymentMethod } from "@/app/types/payment.type";

const methods: { value: PaymentMethod; label: string }[] = [
  { value: "CASH", label: "Espèces" },
  { value: "BANK_TRANSFER", label: "Virement bancaire" },
  { value: "MOBILE_MONEY", label: "Mobile Money" },
  { value: "CARD", label: "Carte bancaire" },
];

type Props = {
  open: boolean;
  payment?: Payment | null;
  onClose: () => void;
};

export function PaymentFormDrawer({ open, payment, onClose }: Props) {
  const editing = !!payment;
  const { data: billings = [] } = useBillings();
  const createMutation = useCreatePayment();
  const updateMutation = useUpdatePayment();
  const [billingId, setBillingId] = useState("");
  const [billingSearch, setBillingSearch] = useState("");
  const [amount, setAmount] = useState("");
  const [currency, setCurrency] = useState("XAF");
  const [method, setMethod] = useState<PaymentMethod>("CASH");
  const [notes, setNotes] = useState("");
  const [error, setError] = useState("");
  const pending = createMutation.isPending || updateMutation.isPending;

  const filteredBillings = useMemo(() => {
    const query = billingSearch.trim().toLowerCase();
    if (!query) return billings;

    return billings.filter((billing) =>
      [billing.invoiceNumber, billing.trackingNumber, billing.id]
        .filter(Boolean)
        .some((value) => value!.toLowerCase().includes(query)),
    );
  }, [billings, billingSearch]);

  const selectedBilling = billings.find((billing) => billing.id === billingId);

  useEffect(() => {
    if (!open) return;
    setError("");
    setBillingSearch("");
    setBillingId(payment?.billingId ?? billings[0]?.id ?? "");
    setAmount(payment?.amount ?? "");
    setCurrency(payment?.currency ?? "XAF");
    setMethod(payment?.method ?? "CASH");
    setNotes(payment?.notes ?? "");
  }, [open, payment, billings]);

  function selectBilling(id: string) {
    setBillingId(id);
    const billing = billings.find((item) => item.id === id);
    if (billing) {
      setCurrency(billing.currency);
      if (!editing && !amount) setAmount(billing.amount);
    }
  }

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    try {
      if (editing && payment) {
        await updateMutation.mutateAsync({
          id: payment.id,
          data: { amount, currency, method, notes: notes || null },
        });
      } else {
        await createMutation.mutateAsync({
          billingId,
          amount,
          currency,
          method,
          notes: notes || null,
        });
      }
      onClose();
    } catch (requestError: unknown) {
      const responseError = requestError as {
        response?: { data?: { message?: string } };
      };
      setError(
        responseError.response?.data?.message ??
          "Impossible d'enregistrer le paiement.",
      );
    }
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/30" onClick={onClose}>
      <aside
        className="absolute right-0 top-0 h-full w-full max-w-lg overflow-y-auto bg-white p-6 shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-[#1677FF]">
              Paiement
            </p>
            <h2 className="mt-1 text-xl font-bold text-slate-950">
              {editing ? "Modifier le paiement" : "Ajouter un paiement"}
            </h2>
          </div>
          <button type="button" onClick={onClose} className="rounded-lg p-2 text-slate-400 hover:bg-slate-100" aria-label="Fermer">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={submit} className="mt-8 space-y-5">
          {!editing && (
            <div>
              <label className="block text-sm font-medium text-slate-700">
                Facturation liée
              </label>
              <div className="relative mt-2">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  value={billingSearch}
                  onChange={(event) => setBillingSearch(event.target.value)}
                  placeholder="Rechercher par facture ou tracking..."
                  className="h-11 w-full rounded-lg border border-slate-200 pl-9 pr-3 text-sm outline-none focus:border-[#1677FF]"
                />
              </div>
              <div className="mt-2 max-h-48 overflow-y-auto rounded-lg border border-slate-200">
                {filteredBillings.length === 0 ? (
                  <p className="p-3 text-sm text-slate-500">Aucune facturation trouvée.</p>
                ) : (
                  filteredBillings.map((billing) => (
                    <button
                      key={billing.id}
                      type="button"
                      onClick={() => selectBilling(billing.id)}
                      className={`block w-full border-b border-slate-100 px-3 py-2.5 text-left text-sm last:border-0 hover:bg-[#EAF3FF] ${billing.id === billingId ? "bg-[#EAF3FF]" : ""}`}
                    >
                      <span className="block font-medium text-slate-800">
                        {billing.invoiceNumber ?? "Facture sans numéro"}
                      </span>
                      <span className="block text-xs text-slate-500">
                        {billing.trackingNumber} · {billing.amount} {billing.currency} · {billing.status}
                      </span>
                    </button>
                  ))
                )}
              </div>
              {selectedBilling && (
                <p className="mt-2 text-xs font-medium text-[#1677FF]">
                  Facture sélectionnée : {selectedBilling.invoiceNumber ?? selectedBilling.trackingNumber}
                </p>
              )}
              <input type="hidden" required value={billingId} readOnly />
            </div>
          )}

          <label className="block text-sm font-medium text-slate-700">
            Montant
            <input required min="0.01" step="0.01" type="number" value={amount} onChange={(event) => setAmount(event.target.value)} className="mt-2 h-11 w-full rounded-lg border border-slate-200 px-3 font-normal outline-none focus:border-[#1677FF]" />
          </label>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block text-sm font-medium text-slate-700">
              Devise
              <input required value={currency} onChange={(event) => setCurrency(event.target.value.toUpperCase())} className="mt-2 h-11 w-full rounded-lg border border-slate-200 px-3 font-normal uppercase outline-none focus:border-[#1677FF]" />
            </label>
            <label className="block text-sm font-medium text-slate-700">
              Méthode
              <select value={method} onChange={(event) => setMethod(event.target.value as PaymentMethod)} className="mt-2 h-11 w-full rounded-lg border border-slate-200 bg-white px-3 font-normal outline-none focus:border-[#1677FF]">
                {methods.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}
              </select>
            </label>
          </div>

          <label className="block text-sm font-medium text-slate-700">
            Notes
            <textarea value={notes} onChange={(event) => setNotes(event.target.value)} rows={4} className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2 font-normal outline-none focus:border-[#1677FF]" />
          </label>

          {error && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}
          <button disabled={pending} className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[#1677FF] px-4 py-3 text-sm font-medium text-white hover:bg-[#0B5ED7] disabled:opacity-50">
            <Save className="h-4 w-4" />
            {pending ? "Enregistrement..." : "Enregistrer le paiement"}
          </button>
        </form>
      </aside>
    </div>
  );
}
