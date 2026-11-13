import { MoreVertical, Undo2, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import type { StockTransfer } from "@/types/bizexpert";
import { inventoryRowActionItemClass } from "./inventoryPageClasses";
import { isInTransitTransfer } from "./inventoryStatus";

type Props = {
  item: StockTransfer;
  onReceive: () => void;
  onCancel: () => void;
};

export function TransferRowActions({ item, onReceive, onCancel }: Props) {
  if (!isInTransitTransfer(item.status)) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="size-8 rounded-md p-0 text-gray-500 hover:bg-gray-50 data-[state=open]:bg-gray-50"
        >
          <span className="sr-only">Open menu</span>
          <MoreVertical className="size-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-64 overflow-hidden rounded-lg border-gray-200 p-0 shadow-lg"
      >
        <DropdownMenuItem
          onClick={onReceive}
          className={cn(
            inventoryRowActionItemClass,
            "text-gray-700 focus:text-gray-700",
          )}
        >
          <Truck className="size-4 shrink-0 text-gray-500" />
          Receive at destination
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={onCancel}
          className={cn(
            inventoryRowActionItemClass,
            "text-error-600 focus:text-error-600",
          )}
        >
          <Undo2 className="size-4 shrink-0" />
          Cancel transfer
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
