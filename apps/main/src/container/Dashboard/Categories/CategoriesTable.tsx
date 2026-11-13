"use client";

import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { DataTable } from "@/components/ui/data-table";
import { referenceTablePaginationClass } from "@/components/application/table/reference-table-classes";
import PageState from "@/components/PageState";
import SearchWithIcon from "@/components/SearchWithIcon";
import EmptyTableInstance from "@/components/EmptyTableInstance";
import { bizexpertApi } from "@/lib/bizexpert/api";
import { useBizExpertBusiness } from "@/store/bizexpert/business-context";
import type { Category } from "@/types/bizexpert";
import { CategoryFormSlideout } from "./CategoryFormSlideout";
import { categoriesTableColumns } from "./categoryColumns";
import { DeleteCategoryModal } from "./DeleteCategoryModal";
import { sortCategoriesForTable } from "./categoryHierarchyDisplay";
import { filterCategoriesBySearch } from "./filterCategoriesBySearch";
import { readCategoryApiError } from "./categoryApiError";
import {
  categoriesTableCountBadgeClass,
  categoriesTableShellClass,
  categoriesTableTitleClass,
  categoriesTableToolbarClass,
} from "./categoriesPageClasses";
import { categoriesQueryKeys } from "./categoriesQueryKeys";
import { CategoriesTableActions } from "./tableActions";

type Props = {
  onCreate: () => void;
  onCreateSub: (parent: Category) => void;
};

export function CategoriesTable({ onCreate, onCreateSub }: Props) {
  const { businessId } = useBizExpertBusiness();
  const qc = useQueryClient();
  const [search, setSearch] = useState("");
  const [editCategory, setEditCategory] = useState<Category | null>(null);
  const [deleteCategory, setDeleteCategory] = useState<Category | null>(null);

  const { data, isLoading, isError } = useQuery({
    queryKey: categoriesQueryKeys.list(businessId ?? ""),
    enabled: !!businessId,
    queryFn: async () => {
      const res = await bizexpertApi.get(
        `/businesses/${businessId}/categories`,
      );
      return res.data as Category[];
    },
  });

  const removeCategory = useMutation({
    mutationFn: async (categoryId: string) => {
      await bizexpertApi.delete(
        `/businesses/${businessId}/categories/${categoryId}`,
      );
    },
    onSuccess: async () => {
      toast.success("Category deleted");
      setDeleteCategory(null);
      await qc.invalidateQueries({
        queryKey: categoriesQueryKeys.list(businessId ?? ""),
      });
    },
    onError: (err) => toast.error(readCategoryApiError(err, "Delete failed")),
  });

  const rows = useMemo(() => {
    const sorted = sortCategoriesForTable(data ?? []);
    return filterCategoriesBySearch(sorted, search);
  }, [data, search]);

  const columns = useMemo(
    () =>
      categoriesTableColumns({
        renderActions: (item) => (
          <CategoriesTableActions
            item={item}
            onEdit={() => setEditCategory(item)}
            onAddSub={() => onCreateSub(item)}
            onDelete={() => setDeleteCategory(item)}
          />
        ),
      }),
    [onCreateSub],
  );

  return (
    <div className="space-y-4">
      <div className={categoriesTableShellClass}>
        <div className={categoriesTableToolbarClass}>
          <h3 className={categoriesTableTitleClass}>
            Categories
            {!isLoading && rows.length > 0 && (
              <span className={categoriesTableCountBadgeClass}>
                {rows.length}
              </span>
            )}
          </h3>
          <div className="flex flex-row gap-x-2">
            <SearchWithIcon
              className="w-[310px]"
              placeholder="Search by name"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </div>
        </div>
        <PageState isLoading={isLoading} isError={isError}>
          <DataTable
            data={rows}
            columns={columns}
            paginationClassName={referenceTablePaginationClass}
          >
            <EmptyTableInstance
              title="No categories yet"
              description="Add a category to group products for stock and reports."
              buttonText="Add category"
              onButtonClick={onCreate}
            />
          </DataTable>
        </PageState>
      </div>
      <CategoryFormSlideout
        isOpen={Boolean(editCategory)}
        category={editCategory}
        onClose={() => setEditCategory(null)}
      />
      {deleteCategory ? (
        <DeleteCategoryModal
          isOpen
          category={deleteCategory}
          isDeleting={removeCategory.isPending}
          onClose={() => setDeleteCategory(null)}
          onConfirm={() => removeCategory.mutate(deleteCategory.id)}
        />
      ) : null}
    </div>
  );
}
