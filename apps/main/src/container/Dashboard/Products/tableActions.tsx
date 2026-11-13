import { Boxes, MoreVertical, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import type { Product } from "@/types/bizexpert";
import { productsRowActionItemClass } from "./productsPageClasses";

type Props = {
  item: Product;
  isNavigating?: boolean;
  onEdit: () => void;
  onUnits: () => void;
  onDeactivate: () => void;
};

export function ProductsTableActions({
  item,
  isNavigating,
  onEdit,
  onUnits,
  onDeactivate,
}: Props) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="size-8 rounded-md p-0 text-gray-500 hover:bg-gray-50 data-[state=open]:bg-gray-50"
          isLoading={isNavigating}
          disabled={isNavigating}
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
          onClick={onEdit}
          className={cn(
            productsRowActionItemClass,
            "text-gray-700 focus:text-gray-700",
          )}
        >
          <Pencil className="size-4 shrink-0 text-gray-500" />
          Edit
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={onUnits}
          className={cn(
            productsRowActionItemClass,
            "text-gray-700 focus:text-gray-700",
          )}
        >
          <Boxes className="size-4 shrink-0 text-gray-500" />
          Manage units
        </DropdownMenuItem>
        {item.isActive ? (
          <DropdownMenuItem
            onClick={onDeactivate}
            className={cn(
              productsRowActionItemClass,
              "text-error-600 focus:text-error-600",
            )}
          >
            <Trash2 className="size-4 shrink-0" />
            Deactivate
          </DropdownMenuItem>
        ) : null}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
