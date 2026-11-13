"use client";

import { Button } from "@/components/ui/button";
import type { InventoryAction } from "./inventoryTabs";

type Props = {
  onAction: (action: InventoryAction) => void;
  canMutate: boolean;
  canTransfer: boolean;
};

export function InventoryHeaderActions({
  onAction,
  canMutate,
  canTransfer,
}: Props) {
  return (
    <div className="flex flex-wrap justify-end gap-3">
      <Button
        variant="outline"
        size="md"
        disabled={!canMutate}
        onClick={() => onAction("opening")}
      >
        Opening
      </Button>
      <Button
        variant="outline"
        size="md"
        disabled={!canMutate}
        onClick={() => onAction("adjust")}
      >
        Adjust
      </Button>
      <Button
        variant="outline"
        size="md"
        disabled={!canTransfer}
        onClick={() => onAction("transfer")}
      >
        Transfer
      </Button>
      <Button
        variant="primary"
        size="md"
        disabled={!canMutate}
        onClick={() => onAction("receive")}
      >
        Receive stock
      </Button>
    </div>
  );
}
