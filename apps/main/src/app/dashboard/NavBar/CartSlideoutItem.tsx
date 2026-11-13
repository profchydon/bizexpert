"use client";

import Image from "next/image";
import { Trash02 } from "@untitledui/icons";
import { Button } from "@/components/base/buttons/button";
import { product_1 } from "@/assets/images";
import { QuantitySelector } from "@/container/Dashboard/EquipEmployee/Marketplace/QuantitySelector";
import type { ICart } from "@/types/cart";
import { canRemoveCartItem } from "./cartItemActions";
import { isRfqCartItem } from "./cartItemSource";

interface CartSlideoutItemProps {
  item: ICart;
  lineTotal: string;
  unitPrice: string;
  isLast: boolean;
  onUpdateQuantity: (pricingId: string, quantity: number) => void;
  onRemove: (pricingId: string) => void;
}

const CartSlideoutItem: React.FC<CartSlideoutItemProps> = ({
  item,
  lineTotal,
  unitPrice,
  isLast,
  onUpdateQuantity,
  onRemove,
}) => {
  const isRfqItem = isRfqCartItem(item);
  const canRemoveItem = canRemoveCartItem(item);
  const image =
    (Array.isArray(item.images) ? item.images[0] : item.images) ||
    item.asset?.images?.[0] ||
    product_1;

  return (
    <div className={isLast ? "py-4" : "border-b border-secondary py-4"}>
      <div className="flex gap-3">
        <div className="flex size-14 shrink-0 items-center justify-center rounded-xl border border-secondary bg-secondary">
          <Image
            src={image}
            alt={item.asset?.name || "asset_image"}
            width={40}
            height={40}
            className="size-10 object-contain"
          />
        </div>
        <div className="flex min-w-0 flex-1 flex-col gap-3">
          <div className="flex items-start justify-between gap-3">
            <p className="truncate text-sm font-semibold text-primary">
              {item.asset?.name}
            </p>
            <div className="shrink-0 text-right">
              <p className="text-sm font-semibold tabular-nums text-primary">
                {lineTotal}
              </p>
              {item.quantity > 1 ? (
                <p className="mt-0.5 whitespace-nowrap text-xs tabular-nums text-quaternary">
                  {unitPrice} each
                </p>
              ) : null}
            </div>
          </div>
          <div className="flex items-center justify-between">
            {!isRfqItem ? (
              <QuantitySelector
                size="sm"
                quantity={item.quantity}
                onIncrement={() =>
                  onUpdateQuantity(item.pricing.id, item.quantity + 1)
                }
                onDecrement={() =>
                  onUpdateQuantity(item.pricing.id, item.quantity - 1)
                }
                editable
                onQuantityCommit={(value) =>
                  onUpdateQuantity(item.pricing.id, value)
                }
              />
            ) : (
              <span />
            )}
            {canRemoveItem ? (
              <Button
                type="button"
                color="tertiary"
                onClick={() => onRemove(item.pricing.id)}
                aria-label={`Remove ${item.asset?.name ?? "item"} from cart`}
                className="!p-0 text-quaternary transition-colors hover:text-error-600"
                data-testid="cartslideoutitem-button"
              >
                <Trash02 className="size-5" />
              </Button>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartSlideoutItem;
