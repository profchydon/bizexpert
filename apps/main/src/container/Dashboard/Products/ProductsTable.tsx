"use client";

import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { DataTable } from "@/components/ui/data-table";
import { referenceTablePaginationClass } from "@/components/application/table/reference-table-classes";
import PageState from "@/components/PageState";
import SearchWithIcon from "@/components/SearchWithIcon";
import EmptyTableInstance from "@/components/EmptyTableInstance";
import { NativeSelect } from "@/components/base/select/select-native";
import { useTransitionRouter } from "@/hooks/useTransitionRouter";
import { bizexpertApi } from "@/lib/bizexpert/api";
import { useBizExpertBusiness } from "@/store/bizexpert/business-context";
import type { Category, Product } from "@/types/bizexpert";
import { categoriesQueryKeys } from "../Categories/categoriesQueryKeys";
import { productCategoryFilterOptions } from "./productCategoryFilterOptions";
import { productSubCategoryFilterOptions } from "./productSubCategoryFilterOptions";
import { BulkDeactivateProductsModal } from "./BulkDeactivateProductsModal";
import { DeleteProductModal } from "./DeleteProductModal";
import { filterProductsBySearch } from "./filterProductsBySearch";
import { ProductFormSlideout } from "./ProductFormSlideout";
import { productsTableColumns } from "./productColumns";
import { ProductsBulkBar } from "./ProductsBulkBar";
import { useProductsTableMutations } from "./useProductsTableMutations";
import {
  productsTableCountBadgeClass,
  productsTableShellClass,
  productsTableTitleClass,
  productsTableToolbarClass,
} from "./productsPageClasses";
import { productsQueryKeys } from "./productsQueryKeys";
import { ProductsTableActions } from "./tableActions";

type Props = {
  onCreate: () => void;
};

export function ProductsTable({ onCreate }: Props) {
  const { businessId } = useBizExpertBusiness();
  const { push, isPending } = useTransitionRouter();
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [subCategoryFilter, setSubCategoryFilter] = useState("");
  const [selectedRows, setSelectedRows] = useState<Product[]>([]);
  const [selectionResetKey, setSelectionResetKey] = useState(0);
  const [bulkOpen, setBulkOpen] = useState(false);
  const [editProduct, setEditProduct] = useState<Product | null>(null);
  const [deleteProduct, setDeleteProduct] = useState<Product | null>(null);
  const [activeId, setActiveId] = useState<string | null>(null);

  const { data: categories } = useQuery({
    queryKey: categoriesQueryKeys.list(businessId ?? ""),
    enabled: !!businessId,
    queryFn: async () => {
      const res = await bizexpertApi.get(
        `/businesses/${businessId}/categories`,
      );
      return res.data as Category[];
    },
  });

  const { data, isLoading, isError } = useQuery({
    queryKey: [
      ...productsQueryKeys.list(businessId ?? ""),
      categoryFilter,
      subCategoryFilter,
    ],
    enabled: !!businessId,
    queryFn: async () => {
      const res = await bizexpertApi.get(`/businesses/${businessId}/products`, {
        params: {
          limit: 100,
          category: categoryFilter || undefined,
          subCategory: subCategoryFilter || undefined,
        },
      });
      return res.data.data as Product[];
    },
  });

  const { deactivate, bulkDeactivate } = useProductsTableMutations({
    businessId,
    onDeactivateSuccess: () => setDeleteProduct(null),
    onBulkSuccess: () => {
      setBulkOpen(false);
      setSelectedRows([]);
      setSelectionResetKey((key) => key + 1);
    },
  });

  const clearRowSelection = () => {
    setSelectedRows([]);
    setSelectionResetKey((key) => key + 1);
  };

  const rows = useMemo(
    () => filterProductsBySearch(data ?? [], search),
    [data, search],
  );

  const selectedIds = useMemo(
    () => selectedRows.map((row) => row.id),
    [selectedRows],
  );

  const columns = useMemo(
    () =>
      productsTableColumns({
        renderActions: (item) => (
          <ProductsTableActions
            item={item}
            isNavigating={isPending && activeId === item.id}
            onEdit={() => setEditProduct(item)}
            onUnits={() => {
              setActiveId(item.id);
              push(`/dashboard/products/${item.id}`);
            }}
            onDeactivate={() => setDeleteProduct(item)}
          />
        ),
      }),
    [activeId, isPending, push],
  );

  const categoryOptions = productCategoryFilterOptions(categories ?? []);
  const subCategoryOptions = productSubCategoryFilterOptions(
    categories ?? [],
    categoryFilter,
  );

  return (
    <div className={productsTableShellClass}>
      {selectedIds.length > 0 ? (
        <ProductsBulkBar
          count={selectedIds.length}
          isDeleting={bulkDeactivate.isPending}
          onDelete={() => setBulkOpen(true)}
          onClear={clearRowSelection}
        />
      ) : null}
      <div className={productsTableToolbarClass}>
        <h3 className={productsTableTitleClass}>
          Products
          {!isLoading && rows.length > 0 ? (
            <span className={productsTableCountBadgeClass}>{rows.length}</span>
          ) : null}
        </h3>
        <div className="flex flex-col gap-2 sm:flex-row">
          <NativeSelect
            value={categoryFilter}
            onChange={(event) => {
              setCategoryFilter(event.target.value);
              setSubCategoryFilter("");
            }}
            options={categoryOptions}
            className="w-[200px]"
          />
          <NativeSelect
            value={subCategoryFilter}
            onChange={(event) => setSubCategoryFilter(event.target.value)}
            options={subCategoryOptions}
            className="w-[200px]"
            disabled={!categoryFilter}
          />
          <SearchWithIcon
            className="w-[310px]"
            placeholder="Search by name, SKU, or category"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </div>
      </div>
      <PageState isLoading={isLoading} isError={isError}>
        <DataTable
          key={selectionResetKey}
          data={rows}
          columns={columns}
          paginationClassName={referenceTablePaginationClass}
          setSeletectedValue={setSelectedRows}
          getRowId={(row) => row.id}
        >
          <EmptyTableInstance
            title="No products yet"
            description="Add catalog items to sell and track inventory."
            buttonText="Add product"
            onButtonClick={onCreate}
          />
        </DataTable>
      </PageState>
      <ProductFormSlideout
        isOpen={Boolean(editProduct)}
        product={editProduct}
        onClose={() => setEditProduct(null)}
      />
      {deleteProduct ? (
        <DeleteProductModal
          isOpen
          product={deleteProduct}
          isDeleting={deactivate.isPending}
          onClose={() => setDeleteProduct(null)}
          onConfirm={() => deactivate.mutate(deleteProduct.id)}
        />
      ) : null}
      {bulkOpen ? (
        <BulkDeactivateProductsModal
          isOpen
          count={selectedIds.length}
          isDeleting={bulkDeactivate.isPending}
          onClose={() => setBulkOpen(false)}
          onConfirm={() => bulkDeactivate.mutate(selectedIds)}
        />
      ) : null}
    </div>
  );
}
