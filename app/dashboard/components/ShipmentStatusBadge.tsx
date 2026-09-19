import { ShipmentStatus } from "@/app/types/shipment.types";


const statusConfig: Record<
  ShipmentStatus,
  {
    label: string;
    className: string;
  }
> = {
  PENDING: {
    label: "En attente",
    className:
      "bg-amber-50 text-amber-700",
  },

  RECEIVED: {
    label: "Reçue",
    className:
      "bg-blue-50 text-blue-700",
  },

  IN_WAREHOUSE: {
    label: "En entrepôt",
    className:
      "bg-indigo-50 text-indigo-700",
  },

  IN_TRANSIT: {
    label: "En transit",
    className:
      "bg-sky-50 text-sky-700",
  },

  ARRIVED: {
    label: "Arrivée",
    className:
      "bg-emerald-50 text-emerald-700",
  },

  CUSTOMS: {
    label: "Douane",
    className:
      "bg-orange-50 text-orange-700",
  },

  READY_FOR_PICKUP: {
    label: "Prête à récupérer",
    className:
      "bg-green-50 text-green-700",
  },

  PICKED_UP: {
    label: "Récupérée",
    className:
      "bg-slate-100 text-slate-700",
  },

  CANCELLED: {
    label: "Annulée",
    className:
      "bg-red-50 text-red-700",
  },
};

export function ShipmentStatusBadge({
  status,
}: {
  status: ShipmentStatus;
}) {
  const config = statusConfig[status];

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${config.className}`}
    >
      {config.label}
    </span>
  );
}