"use client";

import { useTaxContext } from "@/hooks/useTaxContext";
import { inclusiveTotalNote } from "@/lib/tax/display";
import { cn } from "@/lib/utils";

// Sits under a payable total on tax-inclusive display, where the tax is already inside the lines
// and so never gets a row of its own. Renders nothing when the client reads tax at payment, or
// when their jurisdiction applies none.
export function InclusiveTaxNote({ className }: { className?: string }) {
  const note = inclusiveTotalNote(useTaxContext());

  if (!note) return null;

  return (
    <span className={cn("text-xs font-normal text-gray-500", className)}>
      ({note})
    </span>
  );
}
