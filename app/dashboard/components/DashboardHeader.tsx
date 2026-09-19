"use client";

import { useAuth } from "@/app/context/AuthContext";
import {
  Bell,
  Menu
} from "lucide-react";

type DashboardHeaderProps = {
  onMenuClick: () => void;
};


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

export function DashboardHeader({
  onMenuClick,
}: DashboardHeaderProps) {
  const { user } = useAuth();

  return (
    <header className="sticky top-0 z-30 h-16 border-b border-slate-200 bg-white">
      <div className="flex h-full items-center justify-between px-4 sm:px-6">
        {/* Left */}
        <div className="flex items-center gap-3">
          {/* Menu mobile */}
          <button
            type="button"
            onClick={onMenuClick}
            className="rounded-lg p-2 text-slate-600 transition hover:bg-slate-100 lg:hidden"
            aria-label="Ouvrir le menu"
          >
            <Menu className="h-5 w-5" />
          </button>

         
        </div>

        {/* Right */}
        <div className="flex items-center gap-2 sm:gap-4">
          {/* Notifications */}
          <button
            type="button"
            className="relative rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
            aria-label="Notifications"
          >
            <Bell className="h-5 w-5" />

            <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-[#1677FF]" />
          </button>

          <div className="hidden h-6 w-px bg-slate-200 sm:block" />

          {/* User */}
          <div className="flex items-center gap-2">
            {/* Avatar */}
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#EAF3FF] text-sm font-semibold uppercase text-[#1677FF]">
              {getInitials(user?.name?.charAt(0) ?? "U")}
            </div>

            {/* User information */}
            <div className="hidden sm:block">
              <p className="max-w-[160px] truncate text-sm font-semibold text-slate-800">
                {user?.name ?? "Utilisateur"}
              </p>

              <p className="text-xs text-slate-400">
                {user?.role ?? "Utilisateur"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

