import Papa from "papaparse";
import type { BulkProductRow } from "./productBulkTypes";

const HEADERS = [
  "location_name",
  "product_name",
  "category",
  "sub_category",
  "sku",
  "barcode",
  "unit",
  "type",
  "selling_price",
  "cost_price",
  "opening_quantity",
] as const;

export function productImportTemplateCsv(): string {
  return `${HEADERS.join(",")}\n`;
}

export function parseProductImportCsv(text: string): {
  rows: BulkProductRow[];
  error?: string;
} {
  const parsed = Papa.parse<Record<string, string>>(text.trim(), {
    header: true,
    skipEmptyLines: true,
  });
  if (parsed.errors.length > 0) {
    return { rows: [], error: parsed.errors[0]?.message ?? "Invalid CSV" };
  }
  const rows: BulkProductRow[] = [];
  for (const row of parsed.data) {
    const name = row.product_name?.trim();
    const locationName = row.location_name?.trim();
    if (!name || !locationName) continue;
    const sellingPrice = Number(row.selling_price);
    const purchaseCost = Number(row.cost_price);
    if (!Number.isFinite(sellingPrice) || sellingPrice <= 0) {
      return { rows: [], error: `Invalid selling price for ${name}` };
    }
    if (!Number.isFinite(purchaseCost) || purchaseCost <= 0) {
      return { rows: [], error: `Invalid cost price for ${name}` };
    }
    const kindRaw = row.type?.trim().toLowerCase();
    rows.push({
      locationName,
      name,
      category: row.category?.trim() || undefined,
      subCategory: row.sub_category?.trim() || undefined,
      sku: row.sku?.trim() || undefined,
      barcode: row.barcode?.trim() || undefined,
      baseUnit: row.unit?.trim() || "piece",
      kind: kindRaw === "service" ? "service" : "product",
      sellingPrice,
      purchaseCost,
      openingQuantity: Number(row.opening_quantity) || 0,
    });
  }
  if (rows.length === 0) {
    return { rows: [], error: "No product rows found in CSV" };
  }
  return { rows };
}
