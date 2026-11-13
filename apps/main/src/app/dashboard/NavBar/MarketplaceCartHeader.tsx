import { Button } from "@/components/base/buttons/button";
import { CartInclNote } from "@/components/Tax/CartInclNote";
import { StorageCartFeeSkeleton } from "@/container/Dashboard/Storage/Remote/components/cart/StorageCartFeeSkeleton";
import formatAmount from "@/utils/formatAmount";

interface MarketplaceCartHeaderProps {
  currencySymbol: string;
  itemCount: number;
  total: number;
  isFeesLoading?: boolean;
  hasProducts: boolean;
  hasActions: boolean;
  canClearCart: boolean;
  isClearingDisabled: boolean;
  onClearCart: () => void;
}

const MarketplaceCartHeader: React.FC<MarketplaceCartHeaderProps> = ({
  currencySymbol,
  itemCount,
  total,
  isFeesLoading = false,
  hasProducts,
  hasActions,
  canClearCart,
  isClearingDisabled,
  onClearCart,
}) => (
  <div className="sticky -top-6 z-10 -mx-6 bg-white px-6 pb-6 pt-6">
    <div className="flex items-center justify-between">
      <span className="rounded-full bg-primary-50 px-2 py-1 text-sm font-semibold text-primary-700">
        {itemCount} {itemCount === 1 ? "item" : "items"}
      </span>
      <div className="flex flex-col items-end">
        <span className="text-xl font-semibold leading-[30px] text-gray-900">
          {isFeesLoading ? (
            <StorageCartFeeSkeleton size="lg" />
          ) : (
            <>
              {currencySymbol}
              {formatAmount(total.toString())}
            </>
          )}
        </span>
        <CartInclNote hasProducts={hasProducts} hasActions={hasActions} />
      </div>
    </div>
    {canClearCart && (
      <>
        <div className="mt-6 h-px w-full bg-gray-200" />
        <Button
          color="secondary"
          size="md"
          className="mt-3 w-full"
          onClick={onClearCart}
          isDisabled={isClearingDisabled}
          data-testid="marketplacecartheader-button"
        >
          Clear all
        </Button>
      </>
    )}
  </div>
);

export default MarketplaceCartHeader;
