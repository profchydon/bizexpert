import type { ProductKind } from "@/types/bizexpert";

export type BulkProductRow = {
  locationName: string;
  name: string;
  category?: string;
  subCategory?: string;
  sku?: string;
  barcode?: string;
  baseUnit: string;
  kind: ProductKind;
  sellingPrice: number;
  purchaseCost: number;
  openingQuantity?: number;
};
