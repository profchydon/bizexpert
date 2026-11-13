"use client";

import formatAmount from "@/utils/formatAmount";
import { useTaxContext } from "@/hooks/useTaxContext";
import { displayDeviceAmount } from "@/lib/tax/display";
import CartCountryHeader from "./CartCountryHeader";
import CartSlideoutItem from "./CartSlideoutItem";
import { cartItemUnitAmount } from "./cartItemSource";
import type { CountryGroup } from "./groupCartItemsByCountry";

interface MarketplaceCartItemsProps {
  groupedItems: CountryGroup[];
  currencySymbol: string;
  onUpdateQuantity: (pricingId: string, quantity: number) => void;
  onRemove: (pricingId: string) => void;
}

const MarketplaceCartItems: React.FC<MarketplaceCartItemsProps> = ({
  groupedItems,
  currencySymbol,
  onUpdateQuantity,
  onRemove,
}) => {
  const taxCtx = useTaxContext();
  const formatPrice = (value: number) =>
    `${currencySymbol}${formatAmount(value.toString())}`;

  return (
    <>
      {groupedItems.map((group, groupIndex) => (
        <div
          key={group.country.code}
          className={groupIndex === 0 ? "" : "mt-4"}
        >
          <CartCountryHeader
            countryCode={group.country.code}
            countryLabel={group.country.label}
            itemCount={group.items.reduce(
              (sum, item) => sum + item.quantity,
              0,
            )}
          />
          {group.items.map((item, itemIndex) => {
            const unit = displayDeviceAmount(cartItemUnitAmount(item), taxCtx);
            return (
              <CartSlideoutItem
                key={item.pricing.id}
                item={item}
                lineTotal={formatPrice(unit * item.quantity)}
                unitPrice={formatPrice(unit)}
                isLast={
                  itemIndex === group.items.length - 1 &&
                  groupIndex === groupedItems.length - 1
                }
                onUpdateQuantity={onUpdateQuantity}
                onRemove={onRemove}
              />
            );
          })}
        </div>
      ))}
    </>
  );
};

export default MarketplaceCartItems;
