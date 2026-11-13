import { ICart } from "@/types/cart";
import Image from "next/image";
import { product_1 } from "@/assets/images";
import { Trash2 } from "lucide-react";
import formatAmount from "@/utils/formatAmount";
import { QuantitySelector } from "@/container/Dashboard/EquipEmployee/Marketplace/QuantitySelector";

interface CartPopupItemProps {
  item: ICart;
  currencySymbol: string;
  isLast: boolean;
  onIncrement: (pricingId: string) => void;
  onDecrement: (pricingId: string) => void;
  onUpdateQuantity: (pricingId: string, quantity: number) => void;
  onRemove: (pricingId: string) => void;
}

const CartPopupItem: React.FC<CartPopupItemProps> = ({
  item,
  currencySymbol,
  isLast,
  onIncrement,
  onDecrement,
  onUpdateQuantity,
  onRemove,
}) => {
  const image =
    (Array.isArray(item.images) ? item.images[0] : item.images) ||
    item.asset?.images?.[0] ||
    product_1;

  return (
    <div
      className={isLast ? "px-4 py-3" : "border-b border-gray-200 px-4 py-3"}
    >
      <div className="flex items-center gap-3">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-lg bg-gray-100">
          <Image
            src={image}
            alt={item.asset?.name || "cart_item"}
            width={40}
            height={40}
            className="h-10 w-10 object-contain"
          />
        </div>

        <div className="flex min-w-0 flex-1 flex-col gap-2">
          <p className="truncate text-sm font-semibold text-gray-900">
            {item.asset?.name}
          </p>
          <QuantitySelector
            size="sm"
            quantity={item.quantity}
            onIncrement={() => onIncrement(item.pricing.id)}
            onDecrement={() => onDecrement(item.pricing.id)}
            editable
            onQuantityCommit={(value) =>
              onUpdateQuantity(item.pricing.id, value)
            }
          />
        </div>

        <div className="flex shrink-0 flex-col items-end gap-2">
          <button
            type="button"
            onClick={() => onRemove(item.pricing.id)}
            aria-label="Remove from cart"
            className="text-gray-400 transition-colors hover:text-error-600"
          >
            <Trash2 className="h-5 w-5" />
          </button>
          <span className="whitespace-nowrap text-base text-gray-600">
            {currencySymbol}
            {formatAmount(item.amount || item.pricing.amount)} ({item.quantity})
          </span>
        </div>
      </div>
    </div>
  );
};

export default CartPopupItem;
