"use client";

import { useState } from "react";
import { ArrowRight } from "@untitledui/icons";
import { SlideoutMenu } from "@/components/application/slideout-menus/slideout-menu";
import { Button } from "@/components/base/buttons/button";
import type { CheckoutItem } from "@/container/Dashboard/Storage/Remote/hooks/useStorageCheckout";
import { StorageCartFeeSkeleton } from "@/container/Dashboard/Storage/Remote/components/cart/StorageCartFeeSkeleton";
import { useStorageServiceFees } from "@/container/Dashboard/Storage/Remote/hooks/useStorageServiceFees";
import { useTaxContext } from "@/hooks/useTaxContext";
import { cartSubtotalLabel } from "@/lib/tax/display";
import {
  cartCurrency,
  formatMoney,
} from "@/container/Dashboard/Storage/Remote/utils/storagePricing";
import { CartActionsSection } from "./CartActionsSection";
import ClearCartDialog from "./ClearCartDialog";

import { useTransitionRouter } from "@/hooks/useTransitionRouter";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  actionItems: CheckoutItem[];
  isClearingDisabled?: boolean;
  isProceedLoading?: boolean;
  onClearCart: () => void | Promise<void>;
  onRemoveAction: (id: string) => void;
  onProceed: () => void;
}

export function StorageActionsCartOverview({
  isOpen,
  onClose,
  actionItems,
  isClearingDisabled = false,
  isProceedLoading = false,
  onClearCart,
  onRemoveAction,
  onProceed,
}: Props) {
  const { push, isPending } = useTransitionRouter();
  const taxCtx = useTaxContext();
  const {
    subtotal: actionsSubtotal,
    isFeesLoading,
    isFeesReady,
  } = useStorageServiceFees();
  const [showClearDialog, setShowClearDialog] = useState(false);
  const itemCount = actionItems.length;
  const showFeePlaceholder = isFeesLoading || !isFeesReady;
  const displayTotal = showFeePlaceholder ? 0 : actionsSubtotal(actionItems);
  const subtotalLabel = cartSubtotalLabel(taxCtx, {
    hasProducts: false,
    hasActions: itemCount > 0,
  });
  const showTaxNote =
    taxCtx.mode === "at-payment" &&
    (taxCtx.config.deviceRate > 0 || taxCtx.config.serviceRate > 0);

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
                {itemCount} {itemCount === 1 ? "item" : "items"}
              </span>{" "}
              in your cart
            </span>
            <Button
              color="link-gray"
              size="sm"
              onClick={() => setShowClearDialog(true)}
              isDisabled={
                itemCount === 0 || isClearingDisabled || isProceedLoading
              }
              data-testid="storageactionscartoverview-button"
            >
              Clear all
            </Button>
          </div>

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
                  <span className="text-xl font-semibold tabular-nums text-primary">
                    {formatMoney(displayTotal, cartCurrency(actionItems))}
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
            </div>
            <div className="flex flex-col gap-3">
              <Button
                size="lg"
                color="primary"
                className="w-full"
                iconTrailing={ArrowRight}
                onClick={onProceed}
                isDisabled={
                  itemCount === 0 || showFeePlaceholder || isProceedLoading
                }
                isLoading={isProceedLoading}
                data-testid="storageactionscartoverview-button-2"
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
                data-testid="storageactionscartoverview-button-3"
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
