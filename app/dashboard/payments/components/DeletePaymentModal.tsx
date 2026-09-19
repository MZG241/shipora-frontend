"use client";

import { Trash2, X } from "lucide-react";
import { useDeletePayment } from "@/app/hooks/usePayment";
import type { Payment } from "@/app/types/payment.type";

type Props = { payment: Payment | null; onClose: () => void };

export function DeletePaymentModal({ payment, onClose }: Props) {
  const mutation = useDeletePayment();
  if (!payment) return null;
  const selectedPayment = payment;

  async function confirm() {
    await mutation.mutateAsync(selectedPayment.id);
    onClose();
  }

  return <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/30 p-4"><div role="dialog" aria-modal="true" className="w-full max-w-md rounded-xl bg-white p-6 shadow-2xl"><div className="flex items-start justify-between"><div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-50"><Trash2 className="h-5 w-5 text-red-600" /></div><button type="button" onClick={onClose} className="rounded-lg p-2 text-slate-400 hover:bg-slate-100"><X className="h-4 w-4" /></button></div><h2 className="mt-5 text-lg font-semibold text-slate-950">Supprimer ce paiement ?</h2><p className="mt-2 text-sm text-slate-500">Cette action recalculera automatiquement le statut de la facturation liée.</p><div className="mt-6 flex justify-end gap-2"><button type="button" onClick={onClose} className="rounded-lg border border-slate-200 px-4 py-2 text-sm text-slate-700">Annuler</button><button type="button" onClick={confirm} disabled={mutation.isPending} className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50">{mutation.isPending ? "Suppression..." : "Supprimer"}</button></div></div></div>;
}
