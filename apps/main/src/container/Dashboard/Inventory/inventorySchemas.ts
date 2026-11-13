import { z } from "zod";

export const stockFormSchema = z.object({
  productId: z.string().min(1, "Product is required"),
  quantity: z.coerce.number().positive("Quantity must be greater than 0"),
  unitCost: z.coerce.number().positive("Unit cost must be greater than 0"),
  notes: z.string().optional(),
});

export const adjustFormSchema = z.object({
  productId: z.string().min(1, "Product is required"),
  quantity: z.coerce
    .number()
    .refine((value) => value !== 0, "Quantity cannot be zero"),
  reason: z.string().trim().min(1, "Reason is required"),
});

export const transferFormSchema = z
  .object({
    sourceLocationId: z.string().min(1, "Source is required"),
    destinationLocationId: z.string().min(1, "Destination is required"),
    productId: z.string().min(1, "Product is required"),
    quantity: z.coerce.number().positive("Quantity must be greater than 0"),
    notes: z.string().optional(),
  })
  .refine(
    (values) => values.sourceLocationId !== values.destinationLocationId,
    {
      message: "Source and destination must be different",
      path: ["destinationLocationId"],
    },
  );
