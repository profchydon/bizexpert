"use client";

import { useState } from "react";
import { SlideoutMenu } from "@/components/application/slideout-menus/slideout-menu";
import { Button } from "@/components/base/buttons/button";
import { useTransitionRouter } from "@/hooks/useTransitionRouter";
import { type CheckoutItem } from "../../hooks/useStorageCheckout";
import { clearAllStorageCart } from "../../hooks/clearAllStorageCart";
import { removeStorageCartAction } from "../../hooks/useStorageCartActions";
import { StorageCartFeeSkeleton } from "@/container/Dashboard/Storage/Remote/components/cart/StorageCartFeeSkeleton";
import { CheckoutItemRowSkeleton } from "@/container/Dashboard/Storage/Remote/components/cart/CheckoutItemRowSkeleton";
import { useStorageServiceFees } from "../../hooks/useStorageServiceFees";
import { storageAppRoutes } from "../../storageAppRoutes";
import { cartCurrency, formatMoney } from "../../utils/storagePricing";
import { StorageCartActionRow } from "./StorageCartActionRow";
import ClearCartDialog from "@/app/dashboard/NavBar/ClearCartDialog";

interface Props {
  items: CheckoutItem[];
  isOpen: boolean;
  onClose: () => void;
}

export function StorageActionCartSlideout({ items, isOpen, onClose }: Props) {
  const { push, isPending } = useTransitionRouter();
  const [showClearDialog, setShowClearDialog] = useState(false);
  const { lineFee, subtotal, isFeesLoading, isFeesReady } =
    useStorageServiceFees();
  const total = isFeesReady ? subtotal(items) : 0;

  const handleProceed = () => {
    onClose();
    push(storageAppRoutes.storageCheckout);
  };

  const handleConfirmClear = async () => {
    await clearAllStorageCart();
    setShowClearDialog(false);
    onClose();
  };

  return (
    <>
      <SlideoutMenu
        isOpen={isOpen}
        onOpenChange={(open) => !open && onClose()}
        isDismissable
      >
        <SlideoutMenu.Header
          onClose={onClose}
          className="border-b border-secondary"
        >
          <h2 className="text-xl font-semibold text-primary">
            Queued requests
          </h2>
          <p className="text-sm text-tertiary">
            Review storage actions before submitting to Rayda Ops.
          </p>
        </SlideoutMenu.Header>
        <SlideoutMenu.Content>
          <div className="flex items-center justify-between">
            <span className="text-sm text-tertiary">
              <span className="font-semibold text-primary">{items.length}</span>{" "}
              {items.length === 1 ? "item" : "items"}
            </span>
            <Button
              color="link-gray"
              size="sm"
              onClick={() => setShowClearDialog(true)}
              isDisabled={items.length === 0}
              data-testid="storageactioncartslideout-button"
            >
              Clear all
            </Button>
          </div>
          <div className="overflow-hidden rounded-xl border border-secondary bg-primary">
            {isFeesLoading
              ? items.map((item) => <CheckoutItemRowSkeleton key={item.id} />)
              : items.map((item) => (
                  <StorageCartActionRow
                    key={item.id}
                    item={item}
                    displayFee={lineFee(item)}
                    onRemove={(id) => void removeStorageCartAction(id)}
                  />
                ))}
          </div>
        </SlideoutMenu.Content>
        <SlideoutMenu.Footer>
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm text-tertiary">Estimated service total</p>
              <p className="text-xl font-semibold text-primary">
                {isFeesLoading ? (
                  <StorageCartFeeSkeleton size="lg" />
                ) : (
                  formatMoney(total, cartCurrency(items))
                )}
              </p>
            </div>
            <Button
              size="md"
              isLoading={isPending || isFeesLoading}
              isDisabled={items.length === 0 || isFeesLoading}
              onClick={handleProceed}
              data-testid="storageactioncartslideout-button-2"
            >
              Proceed to checkout
            </Button>
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
