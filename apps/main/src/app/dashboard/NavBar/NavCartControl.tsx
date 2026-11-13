"use client";

import { useEffect, useRef, useState } from "react";
import { ShoppingCart } from "lucide-react";
import useCart from "@/hooks/useCart";
import { onCartItemAdded } from "@/hooks/cartEvents";
import { useUnifiedCart } from "@/container/Dashboard/Storage/Remote/hooks/useUnifiedCart";
import { prefetchStorageServiceFees } from "@/container/Dashboard/Storage/Remote/utils/prefetchStorageServiceFees";
import CartPopup from "./CartPopup";
import { navBarIconButtonClass } from "./navBarIconButtonClass";

interface NavCartControlProps {
  isBasicUser: boolean;
  onOpenCartOverview: () => void;
  externalCartCount?: number;
  disabled?: boolean;
}

const NavCartControl: React.FC<NavCartControlProps> = ({
  disabled = false,
  isBasicUser,
  onOpenCartOverview,
  externalCartCount,
}) => {
  const {
    carts,
    totalAmount,
    incrementItem,
    decrementItem,
    updateQty,
    removeItemFromCart,
    savings,
  } = useCart();
  const { actionItems, totalCount, removeAction } = useUnifiedCart();
  const [isCartPopupOpen, setIsCartPopupOpen] = useState(false);
  const popupWrapperRef = useRef<HTMLDivElement | null>(null);

  const isExternalCartMode = externalCartCount !== undefined;
  const totalItemsInCart = isExternalCartMode ? externalCartCount : totalCount;
  const hasCartItems = totalItemsInCart > 0;
  const canOpenCartOverview =
    !disabled && hasCartItems && (isExternalCartMode || !isBasicUser);
  const sortedItems = [...carts].sort((a, b) => {
    const first = a.pricing?.created_at
      ? new Date(a.pricing.created_at).getTime()
      : 0;
    const second = b.pricing?.created_at
      ? new Date(b.pricing.created_at).getTime()
      : 0;
    return second - first;
  });

  useEffect(() => onCartItemAdded(() => setIsCartPopupOpen(true)), []);

  useEffect(() => {
    if (actionItems.length > 0) void prefetchStorageServiceFees();
  }, [actionItems.length]);

  useEffect(() => {
    if (!isCartPopupOpen) {
      return;
    }

    const handleOutsideClick = (event: MouseEvent) => {
      if (!popupWrapperRef.current?.contains(event.target as Node)) {
        setIsCartPopupOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [isCartPopupOpen]);

  return (
    <div ref={popupWrapperRef} className="relative">
      <button
        type="button"
        disabled={!canOpenCartOverview}
        className={`${navBarIconButtonClass} disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-transparent`}
        onClick={() => {
          if (canOpenCartOverview) {
            onOpenCartOverview();
          }
        }}
        aria-label="Open cart overview"
      >
        <ShoppingCart className="h-5 w-5" />
      </button>

      {hasCartItems && !disabled && (
        <button
          type="button"
          className="absolute -top-0.5 -right-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-error-600 text-[10px] font-bold text-white"
          onClick={() => {
            if (canOpenCartOverview) {
              onOpenCartOverview();
            }
          }}
        >
          {totalItemsInCart > 99 ? "99+" : totalItemsInCart}
        </button>
      )}

      <CartPopup
        visible={!isExternalCartMode && isCartPopupOpen}
        items={sortedItems}
        actionItems={actionItems}
        totalCount={totalItemsInCart}
        subtotal={totalAmount}
        onDismiss={() => setIsCartPopupOpen(false)}
        onGoToCart={() => {
          setIsCartPopupOpen(false);
          if (!isBasicUser) {
            onOpenCartOverview();
          }
        }}
        onIncrement={(pricingId) => incrementItem(pricingId)}
        onDecrement={(pricingId) => decrementItem(pricingId)}
        onUpdateQuantity={(pricingId, quantity) =>
          updateQty(pricingId, quantity)
        }
        onRemove={(pricingId) => removeItemFromCart(pricingId)}
        onRemoveAction={removeAction}
        savings={savings}
      />
    </div>
  );
};

export default NavCartControl;
