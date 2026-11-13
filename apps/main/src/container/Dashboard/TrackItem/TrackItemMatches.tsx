"use client";

import { cn } from "@/lib/utils";
import type { Product } from "@/types/bizexpert";
import { productCodeLabel } from "./trackItemLookup";
import {
  trackItemMatchButtonClass,
  trackItemMatchSelectedClass,
  trackItemTableCountBadgeClass,
  trackItemTableShellClass,
  trackItemTableTitleClass,
  trackItemTableToolbarClass,
} from "./trackItemPageClasses";

type Props = {
  matches: Product[];
  selectedId: string | null;
  onSelect: (product: Product) => void;
};

export function TrackItemMatches({ matches, selectedId, onSelect }: Props) {
  if (matches.length <= 1) return null;

  return (
    <div className={trackItemTableShellClass}>
      <div className={trackItemTableToolbarClass}>
        <h3 className={trackItemTableTitleClass}>
          Matching products
          <span className={trackItemTableCountBadgeClass}>
            {matches.length}
          </span>
        </h3>
      </div>
      <ul>
        {matches.map((product) => (
          <li
            key={product.id}
            className="border-b border-gray-100 last:border-0"
          >
            <button
              type="button"
              onClick={() => onSelect(product)}
              className={cn(
                trackItemMatchButtonClass,
                selectedId === product.id && trackItemMatchSelectedClass,
              )}
            >
              <span className="text-sm font-medium text-gray-900">
                {product.name}
              </span>
              <span className="text-sm text-gray-500">
                {productCodeLabel(product)}
              </span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
