import type { ReactNode } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import type { Category } from "@/types/bizexpert";
import { cn } from "@/lib/utils";
import { isMainCategory } from "./categoryHierarchyDisplay";

type Params = {
  renderActions: (item: Category) => ReactNode;
};

export function categoriesTableColumns({
  renderActions,
}: Params): ColumnDef<Category>[] {
  return [
    {
      header: "Name",
      accessorKey: "name",
      enableSorting: false,
      cell: ({ row }) => {
        const isSub = !isMainCategory(row.original);
        return (
          <div className={cn(isSub && "pl-6")}>
            <span className="whitespace-nowrap text-sm font-medium text-gray-900">
              {row.original.name}
            </span>
            {isSub && row.original.parentName ? (
              <p className="text-xs text-gray-500">{row.original.parentName}</p>
            ) : null}
          </div>
        );
      },
    },
    {
      header: "Level",
      id: "level",
      enableSorting: false,
      cell: ({ row }) => (
        <span className="whitespace-nowrap text-sm text-gray-700">
          {isMainCategory(row.original) ? "Main" : "Sub-category"}
        </span>
      ),
    },
    {
      header: "Products",
      accessorKey: "productCount",
      enableSorting: false,
      cell: ({ row }) => (
        <span className="whitespace-nowrap text-sm text-gray-700">
          {row.original.productCount}
        </span>
      ),
    },
    {
      id: "actions",
      header: "",
      enableSorting: false,
      cell: ({ row }) => (
        <div className="flex justify-end">{renderActions(row.original)}</div>
      ),
    },
  ];
}
