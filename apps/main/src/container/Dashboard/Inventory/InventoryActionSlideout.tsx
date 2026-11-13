"use client";

import { SlideoutMenu } from "@/components/application/slideout-menus/slideout-menu";
import { Button } from "@/components/ui/button";
import type { Location, Product } from "@/types/bizexpert";
import { AdjustForm } from "./AdjustForm";
import { inventoryActionMeta } from "./inventoryActionMeta";
import { INVENTORY_FORM_SLIDEOUT_RESIZE } from "./inventoryPageClasses";
import type {
  AdjustFormValues,
  StockFormValues,
  TransferFormValues,
} from "./inventoryPayloads";
import type { InventoryAction } from "./inventoryTabs";
import { StockForm } from "./StockForm";
import { TransferForm } from "./TransferForm";

type Props = {
  action: InventoryAction | null;
  onClose: () => void;
  loc?: string;
  locations: Location[];
  products: Product[] | undefined;
  isSubmitting: boolean;
  onOpening: (values: StockFormValues) => void;
  onReceive: (values: StockFormValues) => void;
  onAdjust: (values: AdjustFormValues) => void;
  onTransfer: (values: TransferFormValues) => void;
};

export function InventoryActionSlideout({
  action,
  onClose,
  loc,
  locations,
  products,
  isSubmitting,
  onOpening,
  onReceive,
  onAdjust,
  onTransfer,
}: Props) {
  const meta = action ? inventoryActionMeta[action] : undefined;

  return (
    <SlideoutMenu
      isOpen={Boolean(action && meta)}
      onOpenChange={(open) => !open && onClose()}
      isDismissable
      ariaLabel={meta?.ariaLabel ?? "Inventory action"}
      resizeOptions={INVENTORY_FORM_SLIDEOUT_RESIZE}
    >
      <SlideoutMenu.Header
        onClose={onClose}
        className="pb-5 shadow-[inset_0px_-1px_0px_0px] shadow-border-secondary"
      >
        <h2 className="text-lg font-semibold text-primary">
          {meta?.title ?? ""}
        </h2>
        <p className="mt-1 text-sm text-tertiary">{meta?.description ?? ""}</p>
      </SlideoutMenu.Header>
      {action === "opening" && loc ? (
        <StockForm
          products={products}
          submitLabel="Save opening stock"
          isSubmitting={isSubmitting}
          onCancel={onClose}
          onSubmit={onOpening}
        />
      ) : null}
      {action === "receive" && loc ? (
        <StockForm
          products={products}
          showNotes
          submitLabel="Receive stock"
          isSubmitting={isSubmitting}
          onCancel={onClose}
          onSubmit={onReceive}
        />
      ) : null}
      {action === "adjust" && loc ? (
        <AdjustForm
          products={products}
          isSubmitting={isSubmitting}
          onCancel={onClose}
          onSubmit={onAdjust}
        />
      ) : null}
      {action === "transfer" && loc && locations.length >= 2 ? (
        <TransferForm
          loc={loc}
          locations={locations}
          products={products}
          isSubmitting={isSubmitting}
          onCancel={onClose}
          onSubmit={onTransfer}
        />
      ) : null}
      {action === "transfer" && locations.length < 2 ? (
        <SlideoutMenu.Content>
          <p className="text-sm text-tertiary">
            Add at least two locations to transfer stock.
          </p>
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </SlideoutMenu.Content>
      ) : null}
    </SlideoutMenu>
  );
}
