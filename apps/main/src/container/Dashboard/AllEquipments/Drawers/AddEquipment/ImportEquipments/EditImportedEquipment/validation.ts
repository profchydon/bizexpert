import { z } from "zod";

export const editImportedEquipmentSchema = z.object({
  title: z
    .string()
    .min(2, { message: "Title is required" })
    .max(100, { message: "Title length cannot exceed 100 characters" }),
  serial_number: z.unknown().optional(),
  make: z.unknown().optional(),
  model: z.unknown().optional(),
  year: z.unknown().optional(),
  type: z.string().min(2, { message: "Asset type is required" }),
  state: z.string().min(2, { message: "Asset state is required" }),
  assignee: z.unknown().optional(),
  country: z.unknown().optional(),
  status: z.unknown().optional(),
  details: z.unknown().optional(),
  // source: z.string().min(2, { message: "Source is required" }),
  purchase_date: z.unknown().optional(),
  purchase_price: z.union([
    z.string().min(2, {
      message:
        "Purchase price is required and cannot be less than 2 characters.",
    }),
    z
      .number()
      .positive({ message: "Purchase price must be a positive number." }),
    z.null(),
  ]),
  currency_id: z.string().min(1, { message: "Purchase currency is required" }),
  image: z.unknown().optional(),
  description: z.unknown().optional(),
});
