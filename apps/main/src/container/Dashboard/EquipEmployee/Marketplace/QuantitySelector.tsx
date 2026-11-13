import { cn } from "@/lib/utils";
import { Minus, Plus } from "lucide-react";
import React from "react";

interface QuantitySelectorProps {
  quantity: number;
  onIncrement: () => void;
  onDecrement: () => void;
  size?: "sm" | "lg" | "xl";
  disabled?: boolean;
  editable?: boolean;
  onQuantityCommit?: (value: number) => void;
}

export const QuantitySelector: React.FC<QuantitySelectorProps> = ({
  quantity,
  onIncrement,
  onDecrement,
  size = "lg",
  disabled,
  editable = false,
  onQuantityCommit,
}) => {
  const isSmall = size === "sm";
  const isExtraLarge = size === "xl";

  let wrapperGapClass = "gap-3";
  let buttonSizeClass = "rounded p-1.5";
  let iconSizeClass = "h-3 w-3";
  let quantityTextClass = "text-2xl leading-8";
  let inputSizeClass = "h-12";

  if (isSmall) {
    wrapperGapClass = "gap-2";
    buttonSizeClass = "rounded-lg p-2";
    iconSizeClass = "h-2 w-2";
    quantityTextClass = "text-base leading-6";
    inputSizeClass = "h-8";
  } else if (isExtraLarge) {
    wrapperGapClass = "gap-4";
    buttonSizeClass = "h-12 w-12 rounded-lg";
    iconSizeClass = "h-5 w-5";
    quantityTextClass = "text-2xl leading-none";
  }

  const [inputValue, setInputValue] = React.useState(String(quantity));

  React.useEffect(() => {
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
    <div className={cn("flex items-center", wrapperGapClass)}>
      <button
        type="button"
        onClick={onDecrement}
        disabled={disabled}
        className={cn(
          "flex items-center justify-center border border-gray-300 bg-white text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60",
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
            "min-w-[2ch] border-0 bg-transparent text-center font-semibold text-gray-900 outline-none [appearance:textfield]",
            "focus:border-0 focus:outline-none focus:ring-0",
            "[&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none",
            inputSizeClass,
            quantityTextClass,
          )}
          style={{ width: quantityInputWidth }}
          aria-label="Quantity"
        />
      ) : (
        <span
          className={cn(
            "min-w-[20px] text-center font-semibold text-gray-900",
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
          "flex items-center justify-center border border-gray-300 bg-white text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60",
          buttonSizeClass,
        )}
        aria-label="Increase quantity"
      >
        <Plus className={iconSizeClass} />
      </button>
    </div>
  );
};
