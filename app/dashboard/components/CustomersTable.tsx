"use client";

import { Customer } from "@/app/types/customer.type";
import {
  Mail,
  MapPin,
  MoreHorizontal,
  Pencil,
  Phone,
  Trash2,
  User,
} from "lucide-react";



type CustomersTableProps = {
  customers: Customer[];
  onEdit: (customer: Customer) => void;
  onDelete: (customer: Customer) => void;
  onViewHistory: (customer: Customer) => void;
};

export function CustomersTable({
  customers,
  onEdit,
  onDelete,
  onViewHistory,
}: CustomersTableProps) {
  if (customers.length === 0) {
    return (
      <div className="flex min-h-[300px] flex-col items-center justify-center border-t border-slate-200 px-6 text-center">
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#EAF3FF]">
          <User className="h-5 w-5 text-[#1677FF]" />
        </div>

        <h3 className="text-sm font-semibold text-slate-900">
          Aucun client trouvé
        </h3>

        <p className="mt-1 max-w-sm text-sm text-slate-500">
          Aucun client ne correspond à votre recherche.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[850px]">
        <thead>
          <tr className="border-b border-slate-200 bg-slate-50/70">
            <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
              Client
            </th>

            <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
              Contact
            </th>

            <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
              Localisation
            </th>

            <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
              Date d’ajout
            </th>

            <th className="w-20 px-5 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
              Actions
            </th>
          </tr>
        </thead>

        <tbody>
          {customers.map((customer) => (
            <tr
              key={customer.id}
              className="border-b border-slate-100 last:border-0 hover:bg-slate-50/50"
            >
              <td className="px-5 py-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#EAF3FF] text-sm font-semibold text-[#1677FF]">
                    {getInitials(customer.name)}
                  </div>

                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-slate-800">
                      {customer.name}
                    </p>

                    <p className="text-xs text-slate-400">
                      Client
                    </p>
                  </div>
                </div>
              </td>

              <td className="px-5 py-4">
                <div className="space-y-1">
                  {customer.email && (
                    <div className="flex items-center gap-2 text-xs text-slate-600">
                      <Mail className="h-3.5 w-3.5 shrink-0 text-slate-400" />
                      <span className="max-w-[220px] truncate">
                        {customer.email}
                      </span>
                    </div>
                  )}

                  {customer.phone && (
                    <div className="flex items-center gap-2 text-xs text-slate-600">
                      <Phone className="h-3.5 w-3.5 shrink-0 text-slate-400" />
                      <span>{customer.phone}</span>
                    </div>
                  )}

                  {!customer.email &&
                    !customer.phone && (
                      <span className="text-xs text-slate-400">
                        Aucun contact
                      </span>
                    )}
                </div>
              </td>

              <td className="px-5 py-4">
                {customer.city || customer.country ? (
                  <div className="flex items-start gap-2">
                    <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />

                    <div className="min-w-0">
                      {customer.city && (
                        <p className="text-sm text-slate-700">
                          {customer.city}
                        </p>
                      )}

                      {customer.country && (
                        <p className="text-xs text-slate-400">
                          {customer.country}
                        </p>
                      )}
                    </div>
                  </div>
                ) : (
                  <span className="text-xs text-slate-400">
                    Non renseignée
                  </span>
                )}
              </td>

              <td className="px-5 py-4">
                <span className="text-sm text-slate-600">
                  {formatDate(customer.createdAt)}
                </span>
              </td>

              <td className="px-5 py-4 text-right">
                <div className="flex items-center justify-end gap-1">
                  <button
                    type="button"
                    onClick={() => onEdit(customer)}
                    className="rounded-lg p-2 text-slate-400 transition hover:bg-[#EAF3FF] hover:text-[#1677FF]"
                    title="Modifier"
                    aria-label={`Modifier ${customer.name}`}
                  >
                    <Pencil className="h-4 w-4" />
                  </button>

                  <button
                    type="button"
                    onClick={() => onDelete(customer)}
                    className="rounded-lg p-2 text-slate-400 transition hover:bg-red-50 hover:text-red-500"
                    title="Supprimer"
                    aria-label={`Supprimer ${customer.name}`}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>

                  <button
                    type="button"
                    onClick={() => onViewHistory(customer)}
                    className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                    title="Plus d’options"
                    aria-label={`Voir l'historique de ${customer.name}`}
                  >
                    <MoreHorizontal className="h-4 w-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function getInitials(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((word) => word.charAt(0))
    .join("")
    .toUpperCase();
}

function formatDate(date: string) {
  return new Intl.DateTimeFormat("fr-FR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(date));
}

