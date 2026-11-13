import { z } from "zod";

export const createCatalogSchema = z.object({
  name: z.string().min(2, { message: "Catalog is required" }),
  description: z.string().min(2, { message: "Description is required" }),
  country_ids: z.string().optional(),
  levels: z.string().optional(),
  departments: z.string().optional(),
});

export const createDeviceCatalogSchema = createCatalogSchema.refine(
  (data) => data.country_ids && data.country_ids.length > 2,
  { message: "Country is required", path: ["country_ids"] }
);

export const createBudgetCatalogSchema = createCatalogSchema.refine(
  (data) => data.country_ids && data.country_ids.length > 2,
  { message: "At least one country is required", path: ["country_ids"] }
);
