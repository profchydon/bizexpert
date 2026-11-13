"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ICart } from "@/types/cart";
import formatAmount from "@/utils/formatAmount";
import { CheckCircle2, X } from "lucide-react";
import { useEffect, useMemo } from "react";
import CartPopupItem from "@/app/dashboard/NavBar/CartPopupItem";
import { CartPopupActionItem } from "@/app/dashboard/NavBar/CartPopupActionItem";
import type { CheckoutItem } from "@/container/Dashboard/Storage/Remote/hooks/useStorageCheckout";
import { StorageCartFeeSkeleton } from "@/container/Dashboard/Storage/Remote/components/cart/StorageCartFeeSkeleton";
import { useStorageServiceFees } from "@/container/Dashboard/Storage/Remote/hooks/useStorageServiceFees";
import getCurrencySymbolFromCode from "./getCurrencySymbolFromCode";
import { popupSubtotalSymbol } from "./popupSubtotalSymbol";
import { useWorkspaceCurrencySymbol } from "@/hooks/useWorkspaceCurrencySymbol";
import { InclusivePriceNote } from "@/components/Tax/InclusivePriceNote";
import { PlanSavingsCallout } from "@/components/checkout/PlanSavingsCallout";
import {
  readSubscriberSaving,
  type SubscriberSaving,
} from "@/lib/pricing/subscriberSaving";

interface CartPopupProps {
  visible: boolean;
  items: ICart[];
  actionItems?: CheckoutItem[];
  totalCount: number;
  subtotal: number;
  onDismiss: () => void;
  onGoToCart: () => void;
  onIncrement: (pricingId: string) => void;
  onDecrement: (pricingId: string) => void;
  onUpdateQuantity: (pricingId: string, quantity: number) => void;
  onRemove: (pricingId: string) => void;
  onRemoveAction?: (id: string) => void;
  savings?: SubscriberSaving | null;
}

const CartPopup: React.FC<CartPopupProps> = ({
  visible,
  items,
  actionItems = [],
  totalCount,
  subtotal,
  onDismiss,
  onGoToCart,
  onIncrement,
  onDecrement,
  onUpdateQuantity,
  onRemove,
  onRemoveAction,
  savings,
}) => {
  const {
    lineFee,
    subtotal: actionSubtotal,
    isFeesLoading,
    isFeesReady,
  } = useStorageServiceFees();
  const billingSymbol = useWorkspaceCurrencySymbol();
  const currencySymbol = getCurrencySymbolFromCode(
    items[0]?.pricing?.currency_code,
  );
  const subtotalSymbol = popupSubtotalSymbol({
    productCurrency: items[0]?.pricing?.currency_code,
    actionCurrencies: actionItems.map((item) => item.currency),
    billingSymbol,
  });
  const showFeePlaceholder =
    actionItems.length > 0 && (isFeesLoading || !isFeesReady);
  const saving = readSubscriberSaving({ savings });
  const combinedSubtotal = useMemo(() => {
    const actionTotal = isFeesReady ? actionSubtotal(actionItems) : 0;
    return subtotal + actionTotal;
  }, [actionItems, actionSubtotal, isFeesReady, subtotal]);

  useEffect(() => {
    if (!visible) {
      return;
    }

    const timer = setTimeout(onDismiss, 5000);
    return () => clearTimeout(timer);
  }, [visible, onDismiss, items, actionItems]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.2 }}
          className="absolute top-full right-0 z-50 mt-2 w-[380px] overflow-hidden rounded-xl border border-gray-200 bg-white shadow-[0px_12px_16px_-4px_rgba(16,24,40,0.08),0px_4px_6px_-2px_rgba(16,24,40,0.03)]"
          role="dialog"
          aria-label="Cart popup"
        >
          <div className="flex items-center gap-3 border-b border-gray-200 bg-success-50 p-4">
            <CheckCircle2 className="h-5 w-5 shrink-0 text-success-600" />
            <p className="flex-1 text-sm font-semibold text-success-700">
              Added to cart!
            </p>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              aria-label="Dismiss"
              className="h-6 w-6"
              onClick={onDismiss}
              data-testid="cartpopup-button"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          <div className="max-h-[280px] overflow-y-auto">
            {items.map((item, index) => (
              <CartPopupItem
                key={item.pricing.id}
                item={item}
                currencySymbol={currencySymbol}
                isLast={actionItems.length === 0 && index === items.length - 1}
                onIncrement={onIncrement}
                onDecrement={onDecrement}
                onUpdateQuantity={onUpdateQuantity}
                onRemove={onRemove}
              />
            ))}
            {actionItems.map((item, index) => (
              <CartPopupActionItem
                key={item.id}
                item={item}
                isLast={index === actionItems.length - 1}
                isFeeLoading={showFeePlaceholder}
                displayFee={isFeesReady ? lineFee(item) : undefined}
                onRemove={onRemoveAction ?? (() => undefined)}
              />
            ))}
          </div>

          <div className="border-t border-gray-200 px-4 pt-3 pb-4">
            <div className="mb-3 flex items-center justify-between">
              <span className="text-sm text-gray-600">
                Subtotal ({totalCount} {totalCount === 1 ? "item" : "items"}){" "}
                <InclusivePriceNote />
              </span>
              <span className="text-sm font-semibold text-gray-900">
                {showFeePlaceholder ? (
                  <StorageCartFeeSkeleton size="sm" />
                ) : (
                  <>
                    {subtotalSymbol}
                    {formatAmount(combinedSubtotal.toString())}
                  </>
                )}
              </span>
            </div>
            {saving ? (
              <PlanSavingsCallout
                variant="compact"
                amount={saving.amount}
                currencySymbol={subtotalSymbol}
                isSubscribed={Boolean(saving.is_subscribed)}
                className="mb-3"
              />
            ) : null}
            <Button
              size="md"
              className="w-full"
              onClick={onGoToCart}
              data-testid="cartpopup-button-2"
            >
              Go to cart
            </Button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CartPopup;
