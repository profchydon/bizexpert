import { MoreVertical, Pencil, Star, Trash2, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import type { Location } from "@/types/bizexpert";
import { locationsRowActionItemClass } from "../locationsPageClasses";

type Props = {
  item: Location;
  onEdit: () => void;
  onManageStaff: () => void;
  onSetDefault: () => void;
  onDelete: () => void;
};

export function LocationsTableActions({
  item,
  onEdit,
  onManageStaff,
  onSetDefault,
  onDelete,
}: Props) {
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
          onClick={onEdit}
          className={cn(
            locationsRowActionItemClass,
            "text-gray-700 focus:text-gray-700",
          )}
        >
          <Pencil className="size-4 shrink-0 text-gray-500" />
          Edit
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={onManageStaff}
          className={cn(
            locationsRowActionItemClass,
            "text-gray-700 focus:text-gray-700",
          )}
        >
          <Users className="size-4 shrink-0 text-gray-500" />
          Manage staff
        </DropdownMenuItem>
        {!item.isDefault && (
          <DropdownMenuItem
            onClick={onSetDefault}
            className={cn(
              locationsRowActionItemClass,
              "text-gray-700 focus:text-gray-700",
            )}
          >
            <Star className="size-4 shrink-0 text-gray-500" />
            Set as default
          </DropdownMenuItem>
        )}
        <DropdownMenuItem
          onClick={onDelete}
          className={cn(
            locationsRowActionItemClass,
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
