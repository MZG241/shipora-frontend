"use client";

import {
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

type PricingPaginationProps = {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

export function PricingPagination({
  currentPage,
  totalPages,
  onPageChange,
}: PricingPaginationProps) {
  if (totalPages <= 1) {
    return null;
  }

  return (
    <div className="flex items-center justify-between border-t border-slate-200 bg-white px-4 py-4 sm:px-6">
      {/* Previous */}
      <button
        type="button"
        onClick={() =>
          onPageChange(currentPage - 1)
        }
        disabled={currentPage === 1}
        className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-slate-200 px-3 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
      >
        <ChevronLeft className="h-4 w-4" />

        <span className="hidden sm:inline">
          Précédent
        </span>
      </button>

      {/* Pages */}
      <div className="flex items-center gap-1">
        {Array.from(
          { length: totalPages },
          (_, index) => index + 1,
        ).map((page) => {
          const isCurrent =
            page === currentPage;

          return (
            <button
              key={page}
              type="button"
              onClick={() =>
                onPageChange(page)
              }
              className={`h-9 min-w-9 rounded-lg px-2.5 text-sm font-medium transition-colors ${
                isCurrent
                  ? "bg-[#1677FF] text-white"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              {page}
            </button>
          );
        })}
      </div>

      {/* Next */}
      <button
        type="button"
        onClick={() =>
          onPageChange(currentPage + 1)
        }
        disabled={
          currentPage === totalPages
        }
        className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-slate-200 px-3 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
      >
        <span className="hidden sm:inline">
          Suivant
        </span>

        <ChevronRight className="h-4 w-4" />
      </button>
    </div>
  );
}

