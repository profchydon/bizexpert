import { Eye, MoreVertical, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { customersRowActionItemClass } from "./customersPageClasses";

type Props = {
  isNavigating: boolean;
  onView: () => void;
  onEdit: () => void;
  onDelete: () => void;
};

export function CustomersTableActions({
  isNavigating,
  onView,
  onEdit,
  onDelete,
}: Props) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="size-8 rounded-md p-0 text-gray-500 hover:bg-gray-50 data-[state=open]:bg-gray-50"
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
          onClick={onView}
          className={cn(
            customersRowActionItemClass,
            "text-gray-700 focus:text-gray-700",
          )}
        >
          <Eye className="size-4 shrink-0 text-gray-500" />
          View
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={onEdit}
          className={cn(
            customersRowActionItemClass,
            "text-gray-700 focus:text-gray-700",
          )}
        >
          <Pencil className="size-4 shrink-0 text-gray-500" />
          Edit
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={onDelete}
          className={cn(
            customersRowActionItemClass,
            "text-error-600 focus:text-error-600",
          )}
        >
          <Trash2 className="size-4 shrink-0" />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
