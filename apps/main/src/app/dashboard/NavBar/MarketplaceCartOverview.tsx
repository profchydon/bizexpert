"use client";

import { useEffect, useMemo } from "react";
import { useAppDispatch, useAppSelector } from "@/store";
import useCart from "@/hooks/useCart";
import { clearDeviceRefreshFlowState } from "@/store/slices/equipEmployeeSlice";
import { clearAllStorageCart } from "@/container/Dashboard/Storage/Remote/hooks/clearAllStorageCart";
import {
  clearStorageActionsCart,
  useUnifiedCart,
} from "@/container/Dashboard/Storage/Remote/hooks/useUnifiedCart";
import {
  StorageServiceFeesProvider,
  useStorageServiceFees,
} from "@/container/Dashboard/Storage/Remote/hooks/useStorageServiceFees";
import { prefetchStorageServiceFees } from "@/container/Dashboard/Storage/Remote/utils/prefetchStorageServiceFees";
import { useStorageActionsCheckout } from "./useStorageActionsCheckout";
import { useCloseCartAfterCheckoutNavigation } from "./useCloseCartAfterCheckoutNavigation";
import { useTaxContext } from "@/hooks/useTaxContext";
import { cartSubtotalLabel, displayDeviceAmount } from "@/lib/tax/display";
import { groupCartItemsByCountry } from "./groupCartItemsByCountry";
import { MarketplaceCartSlideout } from "./MarketplaceCartSlideout";
import { StorageActionsCartOverview } from "./StorageActionsCartOverview";
import { readCartCountryMap } from "@/hooks/cartCountryMemory";
import getCurrencySymbolFromCode from "./getCurrencySymbolFromCode";
import { cartItemTotalAmount } from "./cartItemSource";

interface MarketplaceCartOverviewProps {
  isOpen: boolean;
  onClose: () => void;
  onProceed: () => void;
  isProceedLoading?: boolean;
}

const MarketplaceCartOverviewBody: React.FC<MarketplaceCartOverviewProps> = ({
  isOpen,
  onClose,
  onProceed,
  isProceedLoading = false,
}) => {
  const dispatch = useAppDispatch();
  const taxCtx = useTaxContext();
  const {
    subtotal: actionsSubtotal,
    isFeesLoading,
    isFeesReady,
    feeTable,
  } = useStorageServiceFees();
  const { proceedToOrderSummary, isPending: isStorageActionsCheckoutPending } =
    useStorageActionsCheckout();
  const {
    equipEmployee: { country },
  } = useAppSelector((state) => state.persistedReducers);
  const {
    productItems: carts,
    actionItems,
    totalCount,
    updateQuantity,
    removeFromCart,
    removeAction,
    removeAllProductsFromCart,
  } = useUnifiedCart();
  const { isAddToCartLoading, savings } = useCart();

  const hasProducts = carts.length > 0;
  const hasActions = actionItems.length > 0;
  const actionsOnly = !hasProducts && hasActions;
  const productTotal = useMemo(
    () => carts.reduce((sum, item) => sum + cartItemTotalAmount(item), 0),
    [carts],
  );
  const combinedTotal = useMemo(() => {
    const netActions = isFeesReady ? actionsSubtotal(actionItems) : 0;
    return displayDeviceAmount(productTotal, taxCtx) + netActions;
  }, [actionItems, actionsSubtotal, isFeesReady, productTotal, taxCtx]);
  const currencySymbol = hasProducts
    ? getCurrencySymbolFromCode(carts[0]?.pricing?.currency_code)
    : "$";
  const groupedItems = useMemo(() => {
    const rememberedByPricing = readCartCountryMap();
    return groupCartItemsByCountry(
      carts,
      {
        code: country?.code?.toUpperCase() || "US",
        label: country?.name || "Selected Country",
      },
      rememberedByPricing,
    );
  }, [carts, country?.code, country?.name]);
  const subtotalLabel = cartSubtotalLabel(taxCtx, { hasProducts, hasActions });
  const showTaxNote =
    taxCtx.mode === "at-payment" &&
    (taxCtx.config.deviceRate > 0 || taxCtx.config.serviceRate > 0);
  const showFeePlaceholder = hasActions && (isFeesLoading || !isFeesReady);
  const isCheckoutNavigating = actionsOnly
    ? isStorageActionsCheckoutPending
    : isProceedLoading;

  useCloseCartAfterCheckoutNavigation(isCheckoutNavigating, onClose);

  useEffect(() => {
    if (hasActions) void prefetchStorageServiceFees();
  }, [hasActions]);

  useEffect(() => {
    if (isOpen && totalCount === 0) onClose();
  }, [isOpen, onClose, totalCount]);

  const handleProceedStorageActions = () => {
    proceedToOrderSummary(actionItems, feeTable);
  };

  const handleProceedMarketplace = () => {
    dispatch(clearDeviceRefreshFlowState());
    onProceed();
  };

  if (actionsOnly) {
    return (
      <StorageActionsCartOverview
        isOpen={isOpen}
        onClose={onClose}
        actionItems={actionItems}
        isClearingDisabled={isAddToCartLoading}
        isProceedLoading={isStorageActionsCheckoutPending}
        onRemoveAction={removeAction}
        onProceed={handleProceedStorageActions}
        onClearCart={() => clearAllStorageCart()}
      />
    );
  }

  return (
    <MarketplaceCartSlideout
      isOpen={isOpen}
      onClose={onClose}
      totalCount={totalCount}
      groupedItems={groupedItems}
      actionItems={actionItems}
      combinedTotal={combinedTotal}
      currencySymbol={currencySymbol}
      subtotalLabel={subtotalLabel}
      showTaxNote={showTaxNote}
      showFeePlaceholder={showFeePlaceholder}
      isClearingDisabled={isAddToCartLoading}
      isProceedLoading={isProceedLoading}
      taxCtx={taxCtx}
      onClearCart={async () => {
        if (hasProducts) {
          await removeAllProductsFromCart();
          await clearStorageActionsCart(actionItems, false);
        } else {
          await clearStorageActionsCart(actionItems, true);
        }
      }}
      onProceed={handleProceedMarketplace}
      onUpdateQuantity={(pricingId, quantity) => {
        if (quantity <= 0) removeFromCart(pricingId);
        else updateQuantity(pricingId, quantity);
      }}
      onRemoveProduct={removeFromCart}
      onRemoveAction={removeAction}
      savings={savings}
    />
  );
};

const MarketplaceCartOverview: React.FC<MarketplaceCartOverviewProps> = (
  props,
) => (
  <StorageServiceFeesProvider>
    <MarketplaceCartOverviewBody {...props} />
  </StorageServiceFeesProvider>
);

export default MarketplaceCartOverview;
