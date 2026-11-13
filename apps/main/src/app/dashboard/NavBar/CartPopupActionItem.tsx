"use client";

import { Trash02 } from "@untitledui/icons";
import { DeviceAvatar } from "@/container/Dashboard/Storage/Remote/components/DeviceAvatar";
import { ACTION_META } from "@/container/Dashboard/Storage/Remote/data/deviceActions";
import type { CheckoutItem } from "@/container/Dashboard/Storage/Remote/hooks/useStorageCheckout";
import { StorageCartFeeSkeleton } from "@/container/Dashboard/Storage/Remote/components/cart/StorageCartFeeSkeleton";
import { formatMoney } from "@/container/Dashboard/Storage/Remote/utils/storagePricing";

interface Props {
  item: CheckoutItem;
  isLast: boolean;
  displayFee?: number;
  isFeeLoading?: boolean;
  onRemove: (id: string) => void;
}

export function CartPopupActionItem({
  item,
  isLast,
  displayFee,
  isFeeLoading = false,
  onRemove,
}: Props) {
  const meta = ACTION_META[item.kind];
  const Icon = meta.icon;

  return (
    <div
      className={isLast ? "px-4 py-3" : "border-b border-secondary px-4 py-3"}
    >
      <div className="flex items-center gap-3">
        <DeviceAvatar
          image={item.image}
          assetType={item.assetType}
          name={item.deviceName}
          size="md"
        />
        <div className="flex min-w-0 flex-1 flex-col gap-1">
          <p className="truncate text-sm font-semibold text-primary">
            {item.deviceName}
          </p>
          <span className="inline-flex items-center gap-1.5 text-xs text-tertiary">
            <Icon className="size-3.5 shrink-0" />
            {meta.label}
          </span>
        </div>
        <div className="flex shrink-0 flex-col items-end gap-2">
          <button
            type="button"
            onClick={() => onRemove(item.id)}
            aria-label="Remove from cart"
            className="text-quaternary transition hover:text-error-primary"
          >
            <Trash02 className="size-5" />
          </button>
          <span className="text-sm whitespace-nowrap text-tertiary">
            {isFeeLoading ? (
              <StorageCartFeeSkeleton size="sm" />
            ) : (
              formatMoney(displayFee ?? 0, item.currency)
            )}
          </span>
        </div>
      </div>
    </div>
  );
}
