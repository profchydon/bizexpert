import { Button } from "@/components/ui/button";
import { IAsset } from "@/types/assets";
import { QuantitySelector } from "./QuantitySelector";

interface ProductCardPurchaseActionProps {
  asset?: IAsset;
  assetExistsInCart: boolean;
  assetQuantity?: number;
  hasRfqItemsInCart: boolean;
  isAddToCartLoading: boolean;
  disableQuantityBtn?: boolean;
  onAddToCart: (asset: IAsset, pricingId: string) => Promise<void>;
  onIncrement: (pricingId: string) => Promise<void>;
  onDecrement: (pricingId: string) => Promise<void>;
  onUpdateQuantity: (pricingId: string, value: number) => Promise<void>;
}

const ProductCardPurchaseAction: React.FC<ProductCardPurchaseActionProps> = ({
  asset,
  assetExistsInCart,
  assetQuantity,
  hasRfqItemsInCart,
  isAddToCartLoading,
  disableQuantityBtn,
  onAddToCart,
  onIncrement,
  onDecrement,
  onUpdateQuantity,
}) => {
  const pricingId = asset?.asset_pricing.id;

  if (assetExistsInCart) {
    return (
      <QuantitySelector
        size="sm"
        quantity={assetQuantity || 1}
        onIncrement={() => onIncrement(pricingId!)}
        onDecrement={() => onDecrement(pricingId!)}
        editable
        onQuantityCommit={(value) => onUpdateQuantity(pricingId!, value)}
        disabled={disableQuantityBtn || isAddToCartLoading || hasRfqItemsInCart}
      />
    );
  }

  return (
    <Button
      type="button"
      size="sm"
      className="h-8 text-xs font-semibold"
      disabled={isAddToCartLoading || hasRfqItemsInCart}
      onClick={async () => {
        if (asset && pricingId) {
          await onAddToCart(asset, pricingId);
        }
      }}
      data-testid="productcardpurchaseaction-button"
    >
      Add to cart
    </Button>
  );
};

export default ProductCardPurchaseAction;
