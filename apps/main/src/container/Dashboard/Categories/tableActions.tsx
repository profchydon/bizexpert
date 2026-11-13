import { FolderPlus, MoreVertical, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import type { Category } from "@/types/bizexpert";
import { categoriesRowActionItemClass } from "./categoriesPageClasses";
import { isMainCategory } from "./categoryHierarchyDisplay";

type Props = {
  item: Category;
  onEdit: () => void;
  onAddSub: () => void;
  onDelete: () => void;
};

export function CategoriesTableActions({
  item,
  onEdit,
  onAddSub,
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
        {isMainCategory(item) ? (
          <DropdownMenuItem
            onClick={onAddSub}
            className={cn(
              categoriesRowActionItemClass,
              "text-gray-700 focus:text-gray-700",
            )}
          >
            <FolderPlus className="size-4 shrink-0 text-gray-500" />
            Add sub-category
          </DropdownMenuItem>
        ) : null}
        <DropdownMenuItem
          onClick={onEdit}
          className={cn(
            categoriesRowActionItemClass,
            "text-gray-700 focus:text-gray-700",
          )}
        >
          <Pencil className="size-4 shrink-0 text-gray-500" />
          Edit
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={onDelete}
          className={cn(
            categoriesRowActionItemClass,
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
