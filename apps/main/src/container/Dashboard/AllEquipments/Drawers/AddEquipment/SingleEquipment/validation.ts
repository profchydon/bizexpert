import { z } from "zod";

export const addSingleEquipmentSchema = z.object({
  title: z
    .string()
    .min(2, { message: "Title is required" })
    .max(60, { message: "Title must be 60 characters or less" }),
  serial_number: z.unknown().optional(),
  make: z.unknown().optional(),
  model: z.unknown().optional(),
  year: z.unknown().optional(),
  type: z.string().min(2, { message: "Asset type is required" }),
  state: z.string().min(2, { message: "Asset state is required" }),
  country: z.string().optional(),
  assignee: z.unknown().optional(),
  office_id: z.string().optional(),
  details: z.unknown().optional(),
  status: z.unknown().optional(),
  source: z.unknown().optional(),
  properties: z.array(
    z
      .object({
        fieldName: z.string().optional(),
        fieldValue: z.string().optional(),
      })
      .optional(),
  ),
  // source: z.string().min(2, { message: "Source is required" }),
  purchase_date: z.unknown().optional(),
  // purchase_price: z
  //   .union([
  //     z.string().regex(/^\d+(\.\d+)?$/, { message: "Must be a valid number" }),
  //     z.number(),
  //   ])
  //   .refine(
  //     (value) => {
  //       const numberValue =
  //         typeof value === "string" ? parseFloat(value) : value;
  //       return numberValue > 0;
  //     },
  //     { message: "Purchase price must be a positive number" },
  //   )
  //   .optional(),
  purchase_price: z.string().optional(),
  currency_id: z.string().optional(),
  // currency_id: z.string().min(1, { message: "Purchase currency is required" }),
  image: z.unknown().optional(),
  description: z.unknown().optional(),
  // hash_code: z.string().optional(),
});
