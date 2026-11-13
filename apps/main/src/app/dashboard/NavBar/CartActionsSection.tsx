"use client";

import type { CheckoutItem } from "@/container/Dashboard/Storage/Remote/hooks/useStorageCheckout";
import { CheckoutItemRow } from "@/container/Dashboard/Storage/Remote/components/cart/CheckoutItemRow";
import { CheckoutItemRowSkeleton } from "@/container/Dashboard/Storage/Remote/components/cart/CheckoutItemRowSkeleton";
import { StorageCartFeeSkeleton } from "@/container/Dashboard/Storage/Remote/components/cart/StorageCartFeeSkeleton";
import { useStorageServiceFees } from "@/container/Dashboard/Storage/Remote/hooks/useStorageServiceFees";
import {
  cartCurrency,
  formatMoney,
} from "@/container/Dashboard/Storage/Remote/utils/storagePricing";

interface Props {
  items: CheckoutItem[];
  onRemove: (id: string) => void;
}

export function CartActionsSection({ items, onRemove }: Props) {
  const { lineFee, subtotal, isFeesLoading, isFeesReady } =
    useStorageServiceFees();
  const showFeePlaceholder = isFeesLoading || !isFeesReady;

  if (items.length === 0) return null;

  return (
    <div className="pt-2">
      <div className="flex items-center justify-between py-2">
        <span className="text-sm font-semibold text-primary">
          Storage actions
        </span>
        {showFeePlaceholder ? (
          <StorageCartFeeSkeleton size="sm" />
        ) : (
          <span className="text-sm text-tertiary">
            {formatMoney(subtotal(items), cartCurrency(items))}
          </span>
        )}
      </div>
      <ul
        className="flex flex-col divide-y divide-secondary"
        aria-busy={showFeePlaceholder}
      >
        {items.map((item) =>
          showFeePlaceholder ? (
            <CheckoutItemRowSkeleton key={item.id} />
          ) : (
            <CheckoutItemRow
              key={item.id}
              item={item}
              displayFee={lineFee(item)}
              onRemove={onRemove}
            />
          ),
        )}
      </ul>
    </div>
  );
}
