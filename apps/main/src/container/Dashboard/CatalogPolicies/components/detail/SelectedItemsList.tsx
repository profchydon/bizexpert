"use client";

import { Headphones, Laptop, Monitor, Mouse, Package } from "lucide-react";

import { cn } from "@/lib/utils";
import { useWorkspaceCurrencySymbol } from "@/hooks/useWorkspaceCurrencySymbol";

import type { KitItem } from "../../types";
import { formatMoney } from "../../utils";

export function SelectedItemsList({ items }: { items: KitItem[] }) {
  const currencySymbol = useWorkspaceCurrencySymbol();
  return (
    <ul className="flex flex-col">
      {items.map((item, index) => {
        const lineTotal = item.unitPrice * item.quantity;
        const Icon = getItemIcon(item);
        return (
          <li
            key={item.id}
            className={cn(
              "flex items-center gap-4 py-4",
              index > 0 && "border-t border-gray-200",
            )}
          >
            <span
              className={cn(
                "flex size-14 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-gray-200",
                item.imageTone,
              )}
            >
              <Icon className="size-6" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-normal text-gray-900">
                {item.name}
              </p>
              <p className="text-xs font-normal leading-5 text-gray-500">
                {item.category} · Qty {item.quantity} ·{" "}
                {formatMoney(item.unitPrice, currencySymbol)} each
              </p>
            </div>
            <span className="shrink-0 text-sm font-medium tabular-nums text-gray-900">
              {formatMoney(lineTotal, currencySymbol)}
            </span>
          </li>
        );
      })}
    </ul>
  );
}

function getItemIcon(item: KitItem) {
  const name = item.name.toLowerCase();
  if (item.category === "Laptop") return Laptop;
  if (item.category === "Monitor") return Monitor;
  if (name.includes("mouse")) return Mouse;
  if (name.includes("headphone") || name.includes("airpod")) return Headphones;
  return Package;
}
