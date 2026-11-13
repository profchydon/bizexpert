import MarketplaceCartHeader from "./MarketplaceCartHeader";
import MarketplaceCartItems from "./MarketplaceCartItems";
import { CartActionsSection } from "./CartActionsSection";
import { CartInclNote } from "@/components/Tax/CartInclNote";
import { StorageCartFeeSkeleton } from "@/container/Dashboard/Storage/Remote/components/cart/StorageCartFeeSkeleton";
import formatAmount from "@/utils/formatAmount";
import type { CheckoutItem } from "@/container/Dashboard/Storage/Remote/hooks/useStorageCheckout";
import type { CountryGroup } from "./groupCartItemsByCountry";

interface Props {
  hasProducts: boolean;
  hasActions: boolean;
  totalCount: number;
  combinedTotal: number;
  isFeesLoading?: boolean;
  currencySymbol: string;
  canClearCart: boolean;
  isClearingDisabled: boolean;
  groupedItems: CountryGroup[];
  actionItems: CheckoutItem[];
  onClearCart: () => void;
  onUpdateQuantity: (pricingId: string, quantity: number) => void;
  onRemoveProduct: (pricingId: string) => void;
  onRemoveAction: (id: string) => void;
}

export function MarketplaceCartOverviewContent({
  hasProducts,
  hasActions,
  totalCount,
  combinedTotal,
  isFeesLoading = false,
  currencySymbol,
  canClearCart,
  isClearingDisabled,
  groupedItems,
  actionItems,
  onClearCart,
  onUpdateQuantity,
  onRemoveProduct,
  onRemoveAction,
}: Props) {
  return (
    <>
      <MarketplaceCartHeader
        currencySymbol={currencySymbol}
        itemCount={totalCount}
        total={combinedTotal}
        isFeesLoading={isFeesLoading}
        hasProducts={hasProducts}
        hasActions={hasActions}
        canClearCart={canClearCart}
        isClearingDisabled={isClearingDisabled}
        onClearCart={onClearCart}
      />
      <div className={hasProducts ? "px-6 pt-5" : "px-6"}>
        {hasProducts ? (
          <MarketplaceCartItems
            groupedItems={groupedItems}
            currencySymbol={currencySymbol}
            onUpdateQuantity={onUpdateQuantity}
            onRemove={onRemoveProduct}
          />
        ) : null}
        <CartActionsSection items={actionItems} onRemove={onRemoveAction} />
      </div>
      <div className="h-px w-full bg-gray-200" />
      <div className="flex items-center justify-between px-6 py-4">
        <span className="text-sm font-medium text-gray-700">
          Subtotal{" "}
          <CartInclNote hasProducts={hasProducts} hasActions={hasActions} />
        </span>
        <span className="text-sm text-gray-600">
          {isFeesLoading ? (
            <StorageCartFeeSkeleton size="sm" />
          ) : (
            <>
              {currencySymbol}
              {formatAmount(combinedTotal.toString())}
            </>
          )}
        </span>
      </div>
    </>
  );
}
