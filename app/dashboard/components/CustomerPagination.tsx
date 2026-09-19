"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

type CustomerPaginationProps = {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

export function CustomerPagination({
  currentPage,
  totalPages,
  onPageChange,
}: CustomerPaginationProps) {
  if (totalPages <= 1) {
    return null;
  }

  const pages = getPages(currentPage, totalPages);

  return (
    <div className="flex items-center justify-between border-t border-slate-200 px-4 py-4 sm:px-5">
      <p className="text-xs text-slate-500 sm:text-sm">
        Page{" "}
        <span className="font-medium text-slate-700">
          {currentPage}
        </span>{" "}
        sur{" "}
        <span className="font-medium text-slate-700">
          {totalPages}
        </span>
      </p>

      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={() =>
            onPageChange(currentPage - 1)
          }
          disabled={currentPage === 1}
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition hover:bg-slate-50 hover:text-slate-900 disabled:cursor-not-allowed disabled:opacity-40"
          aria-label="Page précédente"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>

        <div className="hidden items-center gap-1 sm:flex">
          {pages.map((page, index) => {
            if (page === "...") {
              return (
                <span
                  key={`ellipsis-${index}`}
                  className="flex h-9 w-9 items-center justify-center text-sm text-slate-400"
                >
                  ...
                </span>
              );
            }

            const pageNumber = Number(page);
            const active =
              pageNumber === currentPage;

            return (
              <button
                key={pageNumber}
                type="button"
                onClick={() =>
                  onPageChange(pageNumber)
                }
                className={`flex h-9 w-9 items-center justify-center rounded-lg text-sm font-medium transition ${
                  active
                    ? "bg-[#1677FF] text-white"
                    : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                {pageNumber}
              </button>
            );
          })}
        </div>

        <span className="px-2 text-sm font-medium text-slate-700 sm:hidden">
          {currentPage}
        </span>

        <button
          type="button"
          onClick={() =>
            onPageChange(currentPage + 1)
          }
          disabled={currentPage === totalPages}
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition hover:bg-slate-50 hover:text-slate-900 disabled:cursor-not-allowed disabled:opacity-40"
          aria-label="Page suivante"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

function getPages(
  currentPage: number,
  totalPages: number,
): (number | "...")[] {
  if (totalPages <= 5) {
    return Array.from(
      { length: totalPages },
      (_, index) => index + 1,
    );
  }

  if (currentPage <= 3) {
    return [1, 2, 3, 4, "...", totalPages];
  }

  if (currentPage >= totalPages - 2) {
    return [
      1,
      "...",
      totalPages - 3,
      totalPages - 2,
      totalPages - 1,
      totalPages,
    ];
  }

  return [
    1,
    "...",
    currentPage - 1,
    currentPage,
    currentPage + 1,
    "...",
    totalPages,
  ];
}

