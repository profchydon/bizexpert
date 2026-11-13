"use client";

import type { ReactNode } from "react";
import { Headphones, Laptop, Monitor, Mouse, Package } from "lucide-react";

import { cn } from "@/lib/utils";

import type { CatalogKit, KitItem } from "../../types";

export function PreviewSection({
  title,
  className,
  children,
}: {
  title: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <section className={className}>
      <h3 className="text-base font-medium text-gray-900">{title}</h3>
      <div className="mt-3 flex flex-col gap-4">{children}</div>
    </section>
  );
}

export function PreviewInfo({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <p className="text-xs font-normal uppercase tracking-wide text-gray-500">
        {label}
      </p>
      <p className="text-sm font-normal text-gray-900">{value}</p>
    </div>
  );
}

export function PreviewChip({
  active,
  children,
}: {
  active?: boolean;
  children: ReactNode;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-normal leading-5",
        active
          ? "border-primary-200 bg-primary-50 text-primary-700"
          : "border-gray-200 bg-gray-50 text-gray-700",
      )}
    >
      {children}
    </span>
  );
}

export function PreviewKitRow({ kit }: { kit: CatalogKit }) {
  return (
    <div className="flex w-full items-center gap-3 rounded-full border border-gray-200 bg-gray-50 py-1 pl-1 pr-1">
      <div className="flex min-w-0 items-center gap-3">
        <ItemIconStack items={kit.items.slice(0, 3)} />
        <p className="truncate text-sm font-normal text-gray-700">
          {kit.name} · {kit.itemsCount ?? kit.items.length} items
        </p>
      </div>
      <button
        type="button"
        className="ml-auto shrink-0 rounded-full border border-gray-200 bg-white px-2.5 py-1 text-xs font-normal text-gray-700 shadow-sm transition hover:bg-gray-50"
      >
        View
      </button>
    </div>
  );
}

function ItemIconStack({ items }: { items: KitItem[] }) {
  return (
    <div className="flex -space-x-2">
      {items.map((item) => {
        const Icon = getItemIcon(item);
        return (
          <span
            key={item.id}
            className={cn(
              "flex size-6 items-center justify-center rounded-full border border-white",
              item.imageTone,
            )}
          >
            <Icon className="size-3.5" />
          </span>
        );
      })}
    </div>
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
