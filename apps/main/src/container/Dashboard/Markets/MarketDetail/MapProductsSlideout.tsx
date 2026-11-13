"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { SlideoutMenu } from "@/components/application/slideout-menus/slideout-menu";
import { Checkbox } from "@/components/base/checkbox/checkbox";
import { Button } from "@/components/ui/button";
import type { MarketApp } from "../marketCatalog";
import type { MarketRemoteProduct } from "../marketDummyData";
import { MARKET_FORM_SLIDEOUT_RESIZE } from "../marketsPageClasses";

type Props = {
  isOpen: boolean;
  market: MarketApp;
  products: MarketRemoteProduct[];
  selectedIds: string[];
  onClose: () => void;
  onSave: (ids: string[]) => void;
};

export function MapProductsSlideout({
  isOpen,
  market,
  products,
  selectedIds,
  onClose,
  onSave,
}: Props) {
  const [checked, setChecked] = useState<string[]>(selectedIds);

  useEffect(() => {
    if (!isOpen) return;
    setChecked(selectedIds);
  }, [isOpen, selectedIds]);

  const toggle = (id: string, next: boolean) => {
    setChecked((current) =>
      next ? [...current, id] : current.filter((value) => value !== id),
    );
  };

  return (
    <SlideoutMenu
      isOpen={isOpen}
      onOpenChange={(open) => !open && onClose()}
      isDismissable
      ariaLabel={`Map ${market.name} products`}
      resizeOptions={MARKET_FORM_SLIDEOUT_RESIZE}
    >
      <SlideoutMenu.Header
        onClose={onClose}
        className="pb-5 shadow-[inset_0px_-1px_0px_0px] shadow-border-secondary"
      >
        <h2 className="text-lg font-semibold text-primary">Map products</h2>
        <p className="mt-1 text-sm text-tertiary">
          Choose {market.name} listings to keep in sync with your catalog.
        </p>
      </SlideoutMenu.Header>
      <SlideoutMenu.Content className="space-y-3">
        {products.map((product) => (
          <Checkbox
            key={product.id}
            label={`${product.name} · ${product.sku}`}
            isSelected={checked.includes(product.id)}
            onChange={(value) => toggle(product.id, value)}
          />
        ))}
      </SlideoutMenu.Content>
      <SlideoutMenu.Footer className="flex justify-end gap-3 bg-primary">
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button
          type="button"
          onClick={() => {
            onSave(checked);
            toast.success("Product mapping saved");
            onClose();
          }}
        >
          Save mapping
        </Button>
      </SlideoutMenu.Footer>
    </SlideoutMenu>
  );
}
