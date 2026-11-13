"use client";

import { Trash02 } from "@untitledui/icons";
import { DeviceAvatar } from "../DeviceAvatar";
import { ACTION_META } from "../../data/deviceActions";
import type { CheckoutItem } from "../../hooks/useStorageCheckout";
import { formatMoney } from "../../utils/storagePricing";

interface Props {
  item: CheckoutItem;
  displayFee?: number;
  onRemove?: (id: string) => void;
}

export function StorageCartActionRow({ item, displayFee, onRemove }: Props) {
  const meta = ACTION_META[item.kind];
  const Icon = meta.icon;

  return (
    <div className="flex items-center gap-3 border-b border-secondary px-4 py-3 last:border-b-0">
      <DeviceAvatar
        image={item.image}
        assetType={item.assetType}
        name={item.deviceName}
        size="md"
      />
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-primary">
          {item.deviceName}
        </p>
        <span className="inline-flex items-center gap-1.5 text-xs text-tertiary">
          <Icon className="size-3.5 shrink-0" />
          {meta.label}
        </span>
      </div>
      <div className="flex shrink-0 flex-col items-end gap-2">
        {onRemove ? (
          <button
            type="button"
            onClick={() => onRemove(item.id)}
            aria-label="Remove from cart"
            className="text-quaternary transition hover:text-error-primary"
          >
            <Trash02 className="size-5" />
          </button>
        ) : null}
        <span className="text-sm whitespace-nowrap text-tertiary">
          {formatMoney(displayFee ?? 0, item.currency)}
        </span>
      </div>
    </div>
  );
}
