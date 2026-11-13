"use client";

import { useEffect, useRef, useState } from "react";
import { Minus, Plus, Trash2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import type { KitItem } from "../types";
import {
  assetSpecLabels,
  itemPreviewImage,
  itemPreviewName,
  itemPreviewUsesPlaceholder,
} from "../utils";
import KitPreviewImage from "./KitPreviewImage";
import KitPill from "./KitPill";

interface Props {
  item: KitItem;
  isUpdating?: boolean;
  isDeleting?: boolean;
  onChange: (updates: Partial<KitItem>) => void;
  onRemove: () => void;
}

const KitItemRow = ({
  item,
  isUpdating,
  isDeleting,
  onChange,
  onRemove,
}: Props) => {
  const [showToggleTip, setShowToggleTip] = useState(false);
  const tipTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const name = itemPreviewName(item) ?? "Item";
  const image = itemPreviewImage(item);
  const isPlaceholder = itemPreviewUsesPlaceholder(item);
  const specs = assetSpecLabels(item.asset_specification);

  useEffect(
    () => () => {
      if (tipTimeoutRef.current) clearTimeout(tipTimeoutRef.current);
    },
    [],
  );

  const dismissTip = () => {
    if (tipTimeoutRef.current) {
      clearTimeout(tipTimeoutRef.current);
      tipTimeoutRef.current = null;
    }
    setShowToggleTip(false);
  };

  const changeQuantity = (delta: number) => {
    const next = Math.max(1, item.quantity + delta);
    if (next === item.quantity) return;
    onChange({ quantity: next });
  };

  const handleRequiredChange = (required: boolean) => {
    if (!required) {
      if (tipTimeoutRef.current) clearTimeout(tipTimeoutRef.current);
      setShowToggleTip(true);
      tipTimeoutRef.current = setTimeout(() => {
        setShowToggleTip(false);
        tipTimeoutRef.current = null;
      }, 4000);
    } else {
      dismissTip();
    }
    onChange({ required });
  };

  return (
    <div
      className={cn(
        "flex flex-col gap-3 rounded-lg border border-gray-200 bg-white p-4 transition sm:flex-row sm:items-center sm:gap-4",
        (isUpdating || isDeleting) && "opacity-60",
      )}
    >
      <div className="flex min-w-0 flex-1 items-center gap-3">
        <KitPreviewImage
          src={image}
          alt={name}
          width={40}
          height={40}
          isPlaceholder={isPlaceholder}
          containerClassName="size-12 shrink-0 rounded-lg bg-gray-50 p-1.5"
          imageClassName="object-contain"
          labelClassName="bottom-0.5 px-1 py-0.5 text-[6px]"
        />
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium text-gray-900">{name}</p>
          <div className="mt-1 flex flex-wrap gap-1">
            {specs.map((spec) => (
              <KitPill key={spec}>{spec}</KitPill>
            ))}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between gap-3 sm:gap-4">
        <div className="relative flex flex-col items-center gap-1">
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
            <Switch
              checked={item.required}
              onCheckedChange={handleRequiredChange}
              disabled={isUpdating || isDeleting}
            />
            {item.required ? "Required" : "Optional"}
          </label>
          {showToggleTip && (
            <div
              role="status"
              className={cn(
                "absolute top-full z-10 mt-1 w-56 rounded-lg border",
                "border-gray-200 bg-white px-3 py-2 pr-6 text-xs text-gray-600 shadow-md",
              )}
            >
              <button
                type="button"
                aria-label="Dismiss"
                onClick={dismissTip}
                className="absolute right-1 top-1 rounded p-0.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
              >
                <X className="size-3" />
              </button>
              Required items must be fulfilled. Optional items are best-effort —
              skipped if unavailable, no RFQ raised.
            </div>
          )}
        </div>

        <div className="flex items-center rounded-lg border border-gray-200">
          <Button
            variant="ghost"
            size="sm"
            aria-label="Decrease quantity"
            onClick={() => changeQuantity(-1)}
            disabled={isUpdating || isDeleting}
            data-testid="kititemrow-button"
          >
            <Minus className="size-4" />
          </Button>
          <span className="flex w-8 justify-center text-sm font-medium text-gray-900">
            {item.quantity}
          </span>
          <Button
            variant="ghost"
            size="sm"
            aria-label="Increase quantity"
            onClick={() => changeQuantity(1)}
            disabled={isUpdating || isDeleting}
            data-testid="kititemrow-button-2"
          >
            <Plus className="size-4" />
          </Button>
        </div>

        <Button
          variant="ghost"
          size="sm"
          aria-label="Remove item"
          onClick={onRemove}
          disabled={isUpdating || isDeleting}
          className="text-gray-400 hover:bg-error-50 hover:text-error-600"
          data-testid="kititemrow-button-3"
        >
          <Trash2 className="size-4" />
        </Button>
      </div>
    </div>
  );
};

export default KitItemRow;
