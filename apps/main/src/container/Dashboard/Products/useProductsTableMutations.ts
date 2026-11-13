"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { bizexpertApi } from "@/lib/bizexpert/api";
import { readProductsApiError } from "./productsApiError";

type Args = {
  businessId: string | null;
  onDeactivateSuccess: () => void;
  onBulkSuccess: () => void;
};

export function useProductsTableMutations({
  businessId,
  onDeactivateSuccess,
  onBulkSuccess,
}: Args) {
  const qc = useQueryClient();

  const invalidate = async () => {
    await qc.invalidateQueries({ queryKey: ["products"] });
    await qc.invalidateQueries({ queryKey: ["inventory-products"] });
  };

  const deactivate = useMutation({
    mutationFn: async (productId: string) => {
      await bizexpertApi.delete(
        `/businesses/${businessId}/products/${productId}`,
      );
    },
    onSuccess: async () => {
      toast.success("Product deactivated");
      onDeactivateSuccess();
      await invalidate();
    },
    onError: (err) =>
      toast.error(readProductsApiError(err, "Failed to deactivate")),
  });

  const bulkDeactivate = useMutation({
    mutationFn: async (ids: string[]) => {
      await bizexpertApi.post(
        `/businesses/${businessId}/products/bulk-deactivate`,
        { ids },
      );
    },
    onSuccess: async () => {
      toast.success("Products deleted");
      onBulkSuccess();
      await invalidate();
    },
    onError: (err) =>
      toast.error(readProductsApiError(err, "Bulk delete failed")),
  });

  return { deactivate, bulkDeactivate };
}
