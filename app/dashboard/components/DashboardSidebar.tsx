"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  BarChart3,
  CreditCard,
  FileText,
  LayoutDashboard,
  LogOut,
  Package,
  Settings,
  Truck,
  Users,
  Warehouse,
  X,
} from "lucide-react";
import { useAuth } from "@/app/context/AuthContext";



const navigation = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },

  {
    label: "Expéditions",
    href: "/dashboard/shipments",
    icon: Truck,
  },

  {
    label: "Colis",
    href: "/dashboard/packages",
    icon: Package,
  },

  {
    label: "Clients",
    href: "/dashboard/customers",
    icon: Users,
  },

  {
    label: "Entrepôts",
    href: "/dashboard/warehouses",
    icon: Warehouse,
  },

  {
    label: "Staffs",
    href: "/dashboard/staffs",
    icon: Users,
  },

  {
    label: "Tarification",
    href: "/dashboard/pricing",
    icon: BarChart3,
  },

  {
    label: "Facturation",
    href: "/dashboard/billing",
    icon: FileText,
  },

  {
    label: "Paiements",
    href: "/dashboard/payments",
    icon: CreditCard,
  },
];

const settingsNavigation = [
  {
    label: "Paramètres",
    href: "/dashboard/settings",
    icon: Settings,
  },
];

function getInitials(name?: string) {
  if (!name) return "U";

  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((word) => word.charAt(0))
    .join("")
    .toUpperCase();
}

type DashboardSidebarProps = {
  mobileOpen: boolean;
  onClose: () => void;
};

export function DashboardSidebar({
  mobileOpen,
  onClose,
}: DashboardSidebarProps) {
  const pathname = usePathname();

  const { user, logout } = useAuth();

  function isActive(href: string) {
    if (href === "/dashboard") {
      return pathname === href;
    }

    return pathname.startsWith(href);
  }

  async function handleLogout() {
    onClose();

    await logout();
  }

  return (
    <>
      {/* Overlay mobile */}
      <div
        onClick={onClose}
        className={`
          fixed
          inset-0
          z-40
          bg-slate-950/30
          transition-opacity
          duration-300
          lg:hidden
          ${
            mobileOpen
              ? "visible opacity-100"
              : "invisible opacity-0"
          }
        `}
      />

      {/* Sidebar */}
      <aside
        className={`
          fixed
          inset-y-0
          left-0
          z-50
          flex
          w-[280px]
          flex-col
          border-r
          border-slate-200
          bg-white
          transition-transform
          duration-300
          ease-in-out
          lg:w-64
          lg:translate-x-0
          ${
            mobileOpen
              ? "translate-x-0"
              : "-translate-x-full"
          }
        `}
      >
        {/* Logo */}
        <div className="flex h-16 shrink-0 items-center justify-between border-b border-slate-200 px-5">
          <Link
            href="/dashboard"
            onClick={onClose}
            className="flex items-center gap-2"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#1677FF]">
              <span className="font-bold text-white">
                S
              </span>
            </div>

            <span className="text-lg font-bold tracking-tight text-slate-950">
              Shipora
            </span>
          </Link>

          {/* Close button mobile */}
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 lg:hidden"
            aria-label="Fermer le menu"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto px-3 py-5">
          <p className="mb-3 px-3 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
            Principal
          </p>

          <nav className="space-y-1">
            {navigation.map((item) => {
              const Icon = item.icon;

              const active = isActive(
                item.href,
              );

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onClose}
                  className={`
                    flex
                    h-10
                    items-center
                    gap-3
                    rounded-lg
                    px-3
                    text-sm
                    font-medium
                    transition
                    ${
                      active
                        ? "bg-[#EAF3FF] text-[#1677FF]"
                        : "text-slate-600 hover:bg-slate-50 hover:text-slate-950"
                    }
                  `}
                >
                  <Icon className="h-[18px] w-[18px] shrink-0" />

                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          <p className="mb-3 mt-8 px-3 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
            Système
          </p>

          <nav className="space-y-1">
            {settingsNavigation.map(
              (item) => {
                const Icon = item.icon;

                const active = isActive(
                  item.href,
                );

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={onClose}
                    className={`
                      flex
                      h-10
                      items-center
                      gap-3
                      rounded-lg
                      px-3
                      text-sm
                      font-medium
                      transition
                      ${
                        active
                          ? "bg-[#EAF3FF] text-[#1677FF]"
                          : "text-slate-600 hover:bg-slate-50 hover:text-slate-950"
                      }
                    `}
                  >
                    <Icon className="h-[18px] w-[18px]" />

                    <span>{item.label}</span>
                  </Link>
                );
              },
            )}
          </nav>
        </div>

        {/* User */}
        <div className="shrink-0 border-t border-slate-200 p-3">
          <Link href="/dashboard/profile" onClick={onClose} className="flex items-center gap-3 rounded-lg px-2 py-2 hover:bg-slate-50">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#EAF3FF] text-sm font-semibold text-[#1677FF]">
             
             {getInitials(user?.role?.charAt(0) ??
                "U")}
            </div>

            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-slate-800">
                {user?.name ??
                  "Utilisateur"}
              </p>

              <p className="truncate text-xs text-slate-400">
                  {user?.role ??
                  "OWNER"}
              </p>
            </div>

            <button
              type="button"
              onClick={handleLogout}
              className="rounded-lg p-2 cursor-pointer text-slate-400 transition hover:bg-red-50 hover:text-red-500"
              title="Déconnexion"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </Link>
        </div>
      </aside>
    </>
  );
}