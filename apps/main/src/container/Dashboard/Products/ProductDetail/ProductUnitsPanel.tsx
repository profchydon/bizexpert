"use client";

import { useMemo, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";
import { DataTable } from "@/components/ui/data-table";
import { referenceTablePaginationClass } from "@/components/application/table/reference-table-classes";
import PageState from "@/components/PageState";
import EmptyTableInstance from "@/components/EmptyTableInstance";
import { Button } from "@/components/ui/button";
import { bizexpertApi } from "@/lib/bizexpert/api";
import type { ProductUnit } from "@/types/bizexpert";
import { InventoryTableShell } from "../../Inventory/InventoryTableShell";
import { readProductsApiError } from "../productsApiError";
import { productsQueryKeys } from "../productsQueryKeys";
import { productUnitColumns } from "./unitColumns";

type Props = {
  businessId: string;
  productId: string;
  baseUnit: string;
  units: ProductUnit[];
  isLoading: boolean;
  isError: boolean;
  onAdd: () => void;
};

export function ProductUnitsPanel({
  businessId,
  productId,
  baseUnit,
  units,
  isLoading,
  isError,
  onAdd,
}: Props) {
  const qc = useQueryClient();
  const [removingId, setRemovingId] = useState<string | null>(null);

  const removeUnit = useMutation({
    mutationFn: async (unitId: string) => {
      await bizexpertApi.delete(
        `/businesses/${businessId}/products/${productId}/units/${unitId}`,
      );
    },
    onSuccess: async () => {
      toast.success("Unit removed");
      setRemovingId(null);
      await qc.invalidateQueries({
        queryKey: productsQueryKeys.detail(businessId, productId),
      });
    },
    onError: (err) =>
      toast.error(readProductsApiError(err, "Failed to remove unit")),
  });

  const columns = useMemo(
    () =>
      productUnitColumns({
        baseUnit,
        renderActions: (item) => (
          <Button
            variant="ghost"
            size="sm"
            className="text-error-600"
            isLoading={removeUnit.isPending && removingId === item.id}
            onClick={() => {
              setRemovingId(item.id);
              removeUnit.mutate(item.id);
            }}
          >
            <Trash2 className="size-4" />
            <span className="sr-only">Remove unit</span>
          </Button>
        ),
      }),
    [baseUnit, removeUnit, removingId],
  );

  return (
    <InventoryTableShell
      title="Packaging units"
      count={units.length || undefined}
    >
      <PageState isLoading={isLoading} isError={isError}>
        <DataTable
          data={units}
          columns={columns}
          paginationClassName={referenceTablePaginationClass}
        >
          <EmptyTableInstance
            title="No extra units"
            description={`Add cartons or packs that convert to ${baseUnit}.`}
            buttonText="Add unit"
            onButtonClick={onAdd}
          />
        </DataTable>
      </PageState>
    </InventoryTableShell>
  );
}
