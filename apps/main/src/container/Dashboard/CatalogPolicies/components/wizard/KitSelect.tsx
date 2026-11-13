"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Check, ChevronDown, Search } from "lucide-react";

import { cn } from "@/lib/utils";

import { useCatalogPolicyOptions } from "../../useCatalogPolicyOptions";

export function WizardKitSelect({
  selected,
  onChange,
}: {
  selected: string[];
  onChange: (kitIds: string[]) => void;
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const ref = useRef<HTMLDivElement>(null);
  const { kits } = useCatalogPolicyOptions();
  const filtered = useMemo(() => {
    const clean = query.trim().toLowerCase();
    if (!clean) return kits;
    return kits.filter((kit) => kit.name.toLowerCase().includes(clean));
  }, [kits, query]);
  const totalItems = selected
    .map((id) => {
      const kit = kits.find((item) => item.id === id);
      return kit ? (kit.itemsCount ?? kit.items.length) : 0;
    })
    .reduce((sum, count) => sum + count, 0);

  useEffect(() => {
    if (!open) return;
    const close = (event: MouseEvent) => {
      if (!ref.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, [open]);

  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium text-gray-700">Kits</label>
      <div ref={ref} className="relative">
        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          className="flex h-11 w-full items-center justify-between rounded-lg bg-white px-3.5 text-left text-sm shadow-sm ring-1 ring-inset ring-gray-300"
        >
          {selected.length ? (
            <span className="flex gap-1.5">
              <span className="font-medium text-gray-900">
                {selected.length} selected
              </span>
              <span className="text-gray-500">{totalItems} items</span>
            </span>
          ) : (
            <span className="text-gray-400">Select kits</span>
          )}
          <ChevronDown className="h-4 w-4 text-gray-400" />
        </button>
        {open ? (
          <div className="absolute left-0 right-0 top-full z-50 mt-1.5 flex flex-col overflow-hidden rounded-lg border border-gray-200 bg-white shadow-lg">
            <div className="flex items-center gap-2 border-b border-gray-200 px-3 py-2.5">
              <Search className="h-4 w-4 shrink-0 text-gray-400" />
              <input
                aria-label="Search kits"
                placeholder="Search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                className="w-full bg-transparent text-sm text-gray-900 outline-none placeholder:text-gray-400"
              />
            </div>
            <div className="max-h-64 overflow-y-auto py-1">
              {filtered.length === 0 ? (
                <div className="px-3 py-2 text-sm text-gray-500">
                  No results.
                </div>
              ) : null}
              {filtered.map((kit) => {
                const active = selected.includes(kit.id);
                return (
                  <button
                    key={kit.id}
                    type="button"
                    onClick={() =>
                      onChange(
                        active
                          ? selected.filter((id) => id !== kit.id)
                          : [...selected, kit.id],
                      )
                    }
                    className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm hover:bg-gray-50"
                  >
                    <span
                      className={cn(
                        "flex h-4 w-4 items-center justify-center rounded border",
                        active
                          ? "border-primary-600 bg-primary-600 text-white"
                          : "border-gray-300",
                      )}
                    >
                      {active ? <Check className="h-3 w-3" /> : null}
                    </span>
                    <span className="font-medium text-gray-900">
                      {kit.name}
                    </span>
                    <span className="text-gray-500">
                      {kit.itemsCount ?? kit.items.length} items
                    </span>
                  </button>
                );
              })}
            </div>
            <div className="flex items-center justify-between border-t border-gray-200 p-3">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  disabled={selected.length === 0}
                  onClick={() => onChange([])}
                  className="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm font-semibold text-gray-700 disabled:opacity-50"
                >
                  Reset
                </button>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm font-semibold text-gray-700"
                >
                  Close
                </button>
              </div>
              <button
                type="button"
                onClick={() => onChange(kits.map((kit) => kit.id))}
                className="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm font-semibold text-gray-700"
              >
                Select all
              </button>
            </div>
          </div>
        ) : null}
      </div>
      <p className="text-sm text-gray-500">
        Select one or more kits to assign.
      </p>
    </div>
  );
}
