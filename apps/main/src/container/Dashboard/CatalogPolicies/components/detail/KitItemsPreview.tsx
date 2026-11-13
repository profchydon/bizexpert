"use client";

import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { useWorkspaceCurrencySymbol } from "@/hooks/useWorkspaceCurrencySymbol";
import routes from "@/routes";

import type { CatalogRule } from "../../types";
import { formatMoney, getRuleKits } from "../../utils";

export function KitItemsPreview({ rule }: { rule: CatalogRule }) {
  const currencySymbol = useWorkspaceCurrencySymbol();
  return (
    <div className="grid gap-3">
      {getRuleKits(rule).map((kit) => (
        <Link
          key={kit.id}
          href={routes.KIT_DETAIL(kit.id)}
          className="rounded-xl border p-3"
        >
          <div className="flex items-center justify-between">
            <span className="font-medium text-gray-950">{kit.name}</span>
            <Badge>{formatMoney(kit.totalCost, currencySymbol)}</Badge>
          </div>
        </Link>
      ))}
    </div>
  );
}
