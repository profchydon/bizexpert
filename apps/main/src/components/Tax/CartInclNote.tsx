"use client";

import { useTaxContext } from "@/hooks/useTaxContext";
import { cartInclAnnotation } from "@/lib/tax/display";
import { cn } from "@/lib/utils";

interface CartInclNoteProps {
  hasProducts: boolean;
  hasActions: boolean;
  className?: string;
}

export function CartInclNote({
  hasProducts,
  hasActions,
  className,
}: CartInclNoteProps) {
  const note = cartInclAnnotation(useTaxContext(), { hasProducts, hasActions });

  if (!note) return null;

  return (
    <span className={cn("text-xs font-normal text-gray-500", className)}>
      {note}
    </span>
  );
}
