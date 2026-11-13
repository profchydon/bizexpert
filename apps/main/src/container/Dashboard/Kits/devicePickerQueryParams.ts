import type { IKitAssetsParams } from "@/types/kit";

export const devicePickerPageSize = 20;

export function buildKitAssetsParams({
  categoryId,
  page,
  perPage = devicePickerPageSize,
  search,
}: {
  categoryId?: string | null;
  page: number;
  perPage?: number;
  search?: string;
}): IKitAssetsParams {
  return {
    category: categoryId ?? undefined,
    page,
    per_page: perPage,
    search: search || undefined,
  };
}
