import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { CircleCheck } from "lucide-react";
import { RefObject } from "react";

interface ProductCardCartActionsProps {
  assetExistsInCart: boolean;
  quantity: number | "";
  isEditQty: boolean;
  isAddToCartLoading: boolean;
  disableQuantityBtn?: boolean;
  inputRef: RefObject<HTMLInputElement | null>;
  onAddToCart: () => Promise<void>;
  onDecrement: () => Promise<void>;
  onIncrement: () => void;
  onStartEdit: () => void;
  onSaveEdit: () => Promise<void>;
  onQuantityChange: (value: string) => void;
}

const ProductCardCartActions: React.FC<ProductCardCartActionsProps> = ({
  assetExistsInCart,
  quantity,
  isEditQty,
  isAddToCartLoading,
  disableQuantityBtn,
  inputRef,
  onAddToCart,
  onDecrement,
  onIncrement,
  onStartEdit,
  onSaveEdit,
  onQuantityChange,
}) => {
  if (!assetExistsInCart) {
    return (
      <Button
        type="button"
        className="text-sm font-semibold"
        disabled={isAddToCartLoading}
        onClick={onAddToCart}
        data-testid="productcardcartactions-button"
      >
        Add to cart
      </Button>
    );
  }

  return (
    <div className="flex items-center gap-x-2">
      {!isEditQty && (
        <button
          type="button"
          className={cn(
            "border border-gray-200 rounded-lg cursor-pointer h-8 w-8 grid place-content-center disabled:cursor-not-allowed",
            isAddToCartLoading && "pointer-events-none opacity-70",
          )}
          onClick={onDecrement}
          disabled={disableQuantityBtn}
        >
          <span className="text-gray-700">-</span>
        </button>
      )}

      <div>
        {!isEditQty && (
          <button
            type="button"
            className="text-gray-900 hover:border hover:border-primary-600 rounded-lg cursor-pointer h-8 p-2 grid place-content-center border-gray-200 border font-semibold text-2xl"
            onClick={onStartEdit}
          >
            {quantity}
          </button>
        )}

        {isEditQty && (
          <div className="flex gap-x-2 items-center">
            <Input
              ref={inputRef}
              className="text-gray-900 h-[33px] focus:border focus:border-primary-600 font-semibold text-2xl w-[5ch] disabled:cursor-not-allowed"
              value={quantity}
              type="number"
              disabled={isAddToCartLoading || disableQuantityBtn}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  onSaveEdit();
                }
              }}
              onBlur={onSaveEdit}
              onChange={(event) => onQuantityChange(event.target.value)}
              data-testid="productcardcartactions-input"
            />
            <div>
              <CircleCheck className="text-primary-600 cursor-pointer" />
            </div>
          </div>
        )}
      </div>

      {!isEditQty && (
        <button
          type="button"
          className={cn(
            "border border-gray-200 rounded-lg cursor-pointer h-8 w-8 grid place-content-center disabled:cursor-not-allowed",
            isAddToCartLoading && "pointer-events-none opacity-70",
          )}
          onClick={onIncrement}
          disabled={disableQuantityBtn}
        >
          <span className="text-gray-700">+</span>
        </button>
      )}
    </div>
  );
};

export default ProductCardCartActions;
