"use client";

import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";

import type { ApprovalRecord } from "../types";

export function ItemThumb({ item }: { item: ApprovalRecord["items"][number] }) {
  return (
    <div className="flex size-12 shrink-0 items-center justify-center overflow-hidden rounded-md bg-gray-50">
      {item.imageUrl ? (
        <Image
          src={item.imageUrl}
          alt={item.name ?? ""}
          width={48}
          height={48}
          className="size-10 object-contain"
        />
      ) : (
        <span className="text-xs font-medium text-gray-500">
          {item.category ? item.category.slice(0, 2).toUpperCase() : "-"}
        </span>
      )}
    </div>
  );
}

export function ModalPill({
  children,
  href,
  icon,
  tone,
}: {
  children: ReactNode;
  href?: string;
  icon?: ReactNode;
  tone: "brand" | "gray";
}) {
  const style =
    tone === "brand"
      ? "bg-primary-50 text-primary-700 ring-primary-200"
      : "bg-white text-gray-700 ring-gray-300";
  const className = `inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-sm font-normal ring-1 ring-inset ${style}`;

  if (href) {
    return (
      <Link href={href} className={`${className} transition hover:opacity-80`}>
        {icon}
        {children}
      </Link>
    );
  }

  return (
    <span className={className}>
      {icon}
      {children}
    </span>
  );
}

export function CategoryPill({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full bg-gray-50 px-2 py-0.5 text-xs font-normal text-gray-700 ring-1 ring-inset ring-gray-200">
      {children}
    </span>
  );
}

export function ActionButton({
  children,
  disabled,
  onClick,
  variant,
}: {
  children: ReactNode;
  disabled?: boolean;
  onClick: () => void;
  variant: "primary" | "secondary";
}) {
  const style =
    variant === "primary"
      ? "border-primary-600 bg-primary-600 text-white hover:bg-primary-700"
      : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50";
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={`inline-flex h-10 items-center justify-center rounded-lg border px-4 text-sm font-medium shadow-sm transition disabled:cursor-not-allowed disabled:opacity-50 ${style}`}
    >
      {children}
    </button>
  );
}
