"use client";

import { useTaxContext } from "@/hooks/useTaxContext";
import { inclAnnotation } from "@/lib/tax/display";
import { cn } from "@/lib/utils";

// "incl. VAT" caption for a browsed device price. Marketplace prices already arrive tax-inclusive
// from the pricing service on this display mode, so this only names the tax that is inside them.
export function InclusivePriceNote({ className }: { className?: string }) {
  const note = inclAnnotation(useTaxContext());

  if (!note) return null;

  return (
    <span className={cn("text-xs font-normal text-gray-500", className)}>
      {note}
    </span>
  );
}
