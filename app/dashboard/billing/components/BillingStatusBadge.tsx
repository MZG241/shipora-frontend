import {
  AlertCircle,
  CheckCircle2,
  Clock3,
  LoaderCircle,
} from "lucide-react";

import type { BillingStatus } from "@/app/types/billing.type";

type Props = {
  status: BillingStatus;
};

const statusConfig: Record<
  BillingStatus,
  {
    label: string;
    className: string;
    icon: React.ComponentType<{
      className?: string;
    }>;
  }
> = {
  PENDING: {
    label: "En attente",
    className:
      "bg-amber-50 text-amber-700 border-amber-200",
    icon: Clock3,
  },

  PARTIALLY_PAID: {
    label: "Partiellement payé",
    className:
      "bg-blue-50 text-blue-700 border-blue-200",
    icon: LoaderCircle,
  },

  PAID: {
    label: "Payé",
    className:
      "bg-emerald-50 text-emerald-700 border-emerald-200",
    icon: CheckCircle2,
  },

  CANCELLED: {
    label: "Annulé",
    className:
      "bg-red-50 text-red-700 border-red-200",
    icon: AlertCircle,
  },
};

export function BillingStatusBadge({
  status,
}: Props) {
  const config = statusConfig[status];

  const Icon = config.icon;

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium ${config.className}`}
    >
      <Icon className="h-3.5 w-3.5" />

      {config.label}
    </span>
  );
}