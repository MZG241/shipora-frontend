"use client";

import {
  Check,
  ChevronDown,
  Search,
  X,
} from "lucide-react";
import {
  useEffect,
  useRef,
  useState,
} from "react";

export type SearchableSelectOption = {
  value: string;
  label: string;
  description?: string;
};

type SearchableSelectProps = {
  value: string;
  onChange: (value: string) => void;
  options: SearchableSelectOption[];
  placeholder?: string;
  searchPlaceholder?: string;
  emptyMessage?: string;
  disabled?: boolean;
};

export function SearchableSelect({
  value,
  onChange,
  options,
  placeholder = "Sélectionner...",
  searchPlaceholder = "Rechercher...",
  emptyMessage = "Aucun résultat.",
  disabled = false,
}: SearchableSelectProps) {
  const [open, setOpen] =
    useState(false);

  const [search, setSearch] =
    useState("");

  const containerRef =
    useRef<HTMLDivElement>(null);

  const selectedOption =
    options.find(
      (option) =>
        option.value === value,
    );

  const filteredOptions =
    options.filter((option) => {
      const query =
        search
          .trim()
          .toLowerCase();

      if (!query) {
        return true;
      }

      return (
        option.label
          .toLowerCase()
          .includes(query) ||
        option.description
          ?.toLowerCase()
          .includes(query)
      );
    });

  useEffect(() => {
    function handleClickOutside(
      event: MouseEvent,
    ) {
      if (
        containerRef.current &&
        !containerRef.current.contains(
          event.target as Node,
        )
      ) {
        setOpen(false);
        setSearch("");
      }
    }

    document.addEventListener(
      "mousedown",
      handleClickOutside,
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside,
      );
    };
  }, []);

  function handleSelect(
    option: SearchableSelectOption,
  ) {
    onChange(option.value);
    setOpen(false);
    setSearch("");
  }

  function handleClear(
    event: React.MouseEvent,
  ) {
    event.stopPropagation();

    onChange("");
    setSearch("");
  }

  return (
    <div
      ref={containerRef}
      className="relative"
    >
      {/* Trigger */}
      <button
        type="button"
        disabled={disabled}
        onClick={() => {
          if (disabled) {
            return;
          }

          setOpen((current) => !current);
        }}
        className={`flex h-10 w-full items-center justify-between rounded-lg border bg-white px-3 text-left text-sm outline-none transition ${
          open
            ? "border-[#1677FF] ring-2 ring-[#1677FF]/10"
            : "border-slate-200 hover:border-slate-300"
        } ${
          disabled
            ? "cursor-not-allowed bg-slate-50 opacity-70"
            : ""
        }`}
      >
        <div className="min-w-0 flex-1">
          {selectedOption ? (
            <div className="flex min-w-0 items-center gap-2">
              <span className="truncate font-medium text-slate-700">
                {selectedOption.label}
              </span>

              {selectedOption.description && (
                <span className="hidden truncate text-xs text-slate-400 sm:block">
                  {selectedOption.description}
                </span>
              )}
            </div>
          ) : (
            <span className="text-slate-400">
              {placeholder}
            </span>
          )}
        </div>

        <div className="ml-2 flex shrink-0 items-center gap-1">
          {selectedOption && (
            <span
              role="button"
              tabIndex={0}
              onClick={handleClear}
              onKeyDown={(event) => {
                if (
                  event.key === "Enter" ||
                  event.key === " "
                ) {
                  event.preventDefault();
                  onChange("");
                }
              }}
              className="rounded-md p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
            >
              <X className="h-3.5 w-3.5" />
            </span>
          )}

          <ChevronDown
            className={`h-4 w-4 text-slate-400 transition ${
              open
                ? "rotate-180"
                : ""
            }`}
          />
        </div>
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute left-0 right-0 top-[calc(100%+6px)] z-[70] overflow-hidden rounded-lg border border-slate-200 bg-white shadow-lg">
          {/* Search */}
          <div className="border-b border-slate-100 p-2">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

              <input
                autoFocus
                type="search"
                value={search}
                onChange={(event) =>
                  setSearch(
                    event.target.value,
                  )
                }
                placeholder={
                  searchPlaceholder
                }
                className="h-9 w-full rounded-md border border-slate-200 bg-slate-50 pl-9 pr-3 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-[#1677FF] focus:bg-white focus:ring-2 focus:ring-[#1677FF]/10"
              />
            </div>
          </div>

          {/* Options */}
          <div className="max-h-60 overflow-y-auto p-1">
            {filteredOptions.length ===
            0 ? (
              <div className="px-3 py-8 text-center">
                <Search className="mx-auto h-5 w-5 text-slate-300" />

                <p className="mt-2 text-sm text-slate-500">
                  {emptyMessage}
                </p>
              </div>
            ) : (
              filteredOptions.map(
                (option) => {
                  const selected =
                    option.value ===
                    value;

                  return (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() =>
                        handleSelect(
                          option,
                        )
                      }
                      className={`flex w-full items-center justify-between rounded-md px-3 py-2.5 text-left transition ${
                        selected
                          ? "bg-blue-50"
                          : "hover:bg-slate-50"
                      }`}
                    >
                      <div className="min-w-0">
                        <p
                          className={`truncate text-sm font-medium ${
                            selected
                              ? "text-[#1677FF]"
                              : "text-slate-700"
                          }`}
                        >
                          {
                            option.label
                          }
                        </p>

                        {option.description && (
                          <p className="mt-0.5 truncate text-xs text-slate-400">
                            {
                              option.description
                            }
                          </p>
                        )}
                      </div>

                      {selected && (
                        <Check className="ml-3 h-4 w-4 shrink-0 text-[#1677FF]" />
                      )}
                    </button>
                  );
                },
              )
            )}
          </div>
        </div>
      )}
    </div>
  );
}