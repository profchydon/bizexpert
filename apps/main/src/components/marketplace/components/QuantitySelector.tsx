import { useEffect, useState } from "react";
import { Minus, Plus } from "lucide-react";
import { cn } from "../utils/cn";

export interface QuantitySelectorProps {
  quantity: number;
  onIncrement: () => void;
  onDecrement: () => void;
  size?: "sm" | "lg" | "xl";
  disabled?: boolean;
  editable?: boolean;
  onQuantityCommit?: (value: number) => void;
}

export const QuantitySelector = ({
  quantity,
  onIncrement,
  onDecrement,
  size = "lg",
  disabled,
  editable = false,
  onQuantityCommit,
}: QuantitySelectorProps) => {
  const isSmall = size === "sm";
  const isExtraLarge = size === "xl";

  let wrapperGapClass = "mp-gap-3";
  let buttonSizeClass = "mp-rounded mp-p-1.5";
  let iconSizeClass = "mp-h-3 mp-w-3";
  let quantityTextClass = "mp-text-2xl mp-leading-8";
  let inputSizeClass = "mp-h-12";

  if (isSmall) {
    wrapperGapClass = "mp-gap-2";
    buttonSizeClass = "mp-rounded-lg mp-p-2";
    iconSizeClass = "mp-h-2 mp-w-2";
    quantityTextClass = "mp-text-base mp-leading-6";
    inputSizeClass = "mp-h-8";
  } else if (isExtraLarge) {
    wrapperGapClass = "mp-gap-4";
    buttonSizeClass = "mp-h-12 mp-w-12 mp-rounded-lg";
    iconSizeClass = "mp-h-5 mp-w-5";
    quantityTextClass = "mp-text-2xl mp-leading-none";
  }

  const [inputValue, setInputValue] = useState(String(quantity));

  useEffect(() => {
    setInputValue(String(quantity));
  }, [quantity]);

  const commitQuantity = () => {
    if (!editable) {
      return;
    }

    const parsed = Number.parseInt(inputValue, 10);
    if (!Number.isFinite(parsed) || parsed < 1) {
      setInputValue(String(quantity));
      return;
    }

    if (parsed !== quantity) {
      onQuantityCommit?.(parsed);
    }
  };

  const displayQuantity = inputValue || String(quantity) || "1";
  const quantityInputWidth = `${Math.max(displayQuantity.length + 1, 2)}ch`;

  return (
    <div className={cn("mp-flex mp-items-center", wrapperGapClass)}>
      <button
        type="button"
        onClick={onDecrement}
        disabled={disabled}
        className={cn(
          "mp-flex mp-items-center mp-justify-center mp-border mp-border-gray-300 mp-bg-white mp-text-gray-700 mp-transition hover:mp-bg-gray-50 disabled:mp-cursor-not-allowed disabled:mp-opacity-60",
          buttonSizeClass,
        )}
        aria-label="Decrease quantity"
      >
        <Minus className={iconSizeClass} />
      </button>

      {editable ? (
        <input
          type="number"
          min={1}
          inputMode="numeric"
          value={inputValue}
          disabled={disabled}
          onChange={(event) => {
            const digitsOnly = event.target.value.replaceAll(/\D/g, "");
            setInputValue(digitsOnly);
          }}
          onBlur={commitQuantity}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              commitQuantity();
              event.currentTarget.blur();
            }
          }}
          className={cn(
            "mp-min-w-[2ch] mp-border-0 mp-bg-transparent mp-text-center mp-font-semibold mp-text-gray-900 mp-outline-none mp-[appearance:textfield]",
            "focus:mp-border-0 focus:mp-outline-none focus:mp-ring-0",
            "[&::-webkit-inner-spin-button]:mp-appearance-none [&::-webkit-outer-spin-button]:mp-appearance-none",
            inputSizeClass,
            quantityTextClass,
          )}
          style={{ width: quantityInputWidth }}
          aria-label="Quantity"
        />
      ) : (
        <span
          className={cn(
            "mp-min-w-[20px] mp-text-center mp-font-semibold mp-text-gray-900",
            quantityTextClass,
          )}
        >
          {quantity}
        </span>
      )}

      <button
        type="button"
        onClick={onIncrement}
        disabled={disabled}
        className={cn(
          "mp-flex mp-items-center mp-justify-center mp-border mp-border-gray-300 mp-bg-white mp-text-gray-700 mp-transition hover:mp-bg-gray-50 disabled:mp-cursor-not-allowed disabled:mp-opacity-60",
          buttonSizeClass,
        )}
        aria-label="Increase quantity"
      >
        <Plus className={iconSizeClass} />
      </button>
    </div>
  );
};
