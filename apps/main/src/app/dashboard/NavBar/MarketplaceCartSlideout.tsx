"use client";

import { useState } from "react";
import { ArrowRight } from "@untitledui/icons";
import { SlideoutMenu } from "@/components/application/slideout-menus/slideout-menu";
import { Button } from "@/components/base/buttons/button";
import type { CheckoutItem } from "@/container/Dashboard/Storage/Remote/hooks/useStorageCheckout";
import { StorageCartFeeSkeleton } from "@/container/Dashboard/Storage/Remote/components/cart/StorageCartFeeSkeleton";
import formatAmount from "@/utils/formatAmount";
import { CartActionsSection } from "./CartActionsSection";
import CartCountryHeader from "./CartCountryHeader";
import CartSlideoutItem from "./CartSlideoutItem";
import ClearCartDialog from "./ClearCartDialog";
import type { CountryGroup } from "./groupCartItemsByCountry";
import { cartItemUnitAmount } from "./cartItemSource";
import { displayDeviceAmount } from "@/lib/tax/display";
import type { TaxContext } from "@/hooks/useTaxContext";
import { useTransitionRouter } from "@/hooks/useTransitionRouter";
import { PlanSavingsCallout } from "@/components/checkout/PlanSavingsCallout";
import {
  readSubscriberSaving,
  type SubscriberSaving,
} from "@/lib/pricing/subscriberSaving";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  totalCount: number;
  groupedItems: CountryGroup[];
  actionItems: CheckoutItem[];
  combinedTotal: number;
  currencySymbol: string;
  subtotalLabel: string;
  showTaxNote: boolean;
  showFeePlaceholder: boolean;
  isClearingDisabled: boolean;
  isProceedLoading: boolean;
  taxCtx: TaxContext;
  onClearCart: () => void | Promise<void>;
  onProceed: () => void;
  onUpdateQuantity: (pricingId: string, quantity: number) => void;
  onRemoveProduct: (pricingId: string) => void;
  onRemoveAction: (id: string) => void;
  savings?: SubscriberSaving | null;
}

export function MarketplaceCartSlideout({
  isOpen,
  onClose,
  totalCount,
  groupedItems,
  actionItems,
  combinedTotal,
  currencySymbol,
  subtotalLabel,
  showTaxNote,
  showFeePlaceholder,
  isClearingDisabled,
  isProceedLoading,
  taxCtx,
  onClearCart,
  onProceed,
  onUpdateQuantity,
  onRemoveProduct,
  onRemoveAction,
  savings,
}: Props) {
  const { push, isPending } = useTransitionRouter();
  const [showClearDialog, setShowClearDialog] = useState(false);

  const formatPrice = (value: number) =>
    `${currencySymbol}${formatAmount(value.toString())}`;
  const saving = readSubscriberSaving({ savings });

  const handleConfirmClear = async () => {
    await onClearCart();
    setShowClearDialog(false);
    onClose();
  };

  return (
    <>
      <SlideoutMenu
        isOpen={isOpen}
        onOpenChange={(open) => {
          if (!open && !isProceedLoading) onClose();
        }}
        isDismissable={!isProceedLoading}
        ariaLabel="Cart Overview"
      >
        <SlideoutMenu.Header
          onClose={isProceedLoading ? undefined : onClose}
          className="border-b border-secondary pb-4"
        >
          <h2 className="text-xl font-semibold leading-[30px] text-primary">
            Cart Overview
          </h2>
        </SlideoutMenu.Header>

        <SlideoutMenu.Content>
          <div className="flex items-center justify-between">
            <span className="text-sm text-tertiary">
              <span className="font-semibold text-primary">
                {totalCount} {totalCount === 1 ? "item" : "items"}
              </span>{" "}
              in your cart
            </span>
            <Button
              color="link-gray"
              size="sm"
              onClick={() => setShowClearDialog(true)}
              isDisabled={
                totalCount === 0 || isClearingDisabled || isProceedLoading
              }
              data-testid="marketplacecartslideout-button"
            >
              Clear all
            </Button>
          </div>

          {groupedItems.map((group, groupIndex) => (
            <div key={group.country.code}>
              <CartCountryHeader
                countryCode={group.country.code}
                countryLabel={group.country.label}
                itemCount={group.items.reduce(
                  (sum, item) => sum + item.quantity,
                  0,
                )}
              />
              {group.items.map((item, itemIndex) => {
                const unit = displayDeviceAmount(
                  cartItemUnitAmount(item),
                  taxCtx,
                );
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
                    onRemove={onRemoveProduct}
                  />
                );
              })}
            </div>
          ))}

          <CartActionsSection items={actionItems} onRemove={onRemoveAction} />
        </SlideoutMenu.Content>

        <SlideoutMenu.Footer>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <div className="flex items-baseline justify-between">
                <span className="text-sm text-tertiary">{subtotalLabel}</span>
                {showFeePlaceholder ? (
                  <StorageCartFeeSkeleton size="lg" />
                ) : (
                  <span className="text-xl font-semibold tabular-nums leading-[30px] text-primary">
                    {formatPrice(combinedTotal)}
                  </span>
                )}
              </div>
              {showTaxNote ? (
                <div className="flex items-baseline justify-between">
                  <span className="text-xs text-tertiary">Estimated tax</span>
                  <span className="text-xs text-quaternary">
                    Added at checkout
                  </span>
                </div>
              ) : null}
              {saving ? (
                <PlanSavingsCallout
                  variant="card"
                  amount={saving.amount}
                  currencySymbol={currencySymbol}
                  isSubscribed={Boolean(saving.is_subscribed)}
                />
              ) : null}
            </div>
            <div className="flex flex-col gap-3">
              <Button
                size="lg"
                color="primary"
                className="w-full"
                iconTrailing={ArrowRight}
                onClick={onProceed}
                isDisabled={
                  totalCount === 0 || showFeePlaceholder || isProceedLoading
                }
                isLoading={isProceedLoading}
                data-testid="marketplacecartslideout-button-2"
              >
                Proceed to checkout
              </Button>
              <Button
                size="lg"
                color="secondary"
                className="w-full"
                onClick={() => {
                  onClose();
                  push("/dashboard/storage");
                }}
                isLoading={isPending}
                isDisabled={isProceedLoading || isPending}
                data-testid="marketplacecartslideout-button-3"
              >
                Continue shopping
              </Button>
            </div>
          </div>
        </SlideoutMenu.Footer>
      </SlideoutMenu>

      <ClearCartDialog
        isOpen={showClearDialog}
        onConfirm={handleConfirmClear}
        onCancel={() => setShowClearDialog(false)}
      />
    </>
  );
}
