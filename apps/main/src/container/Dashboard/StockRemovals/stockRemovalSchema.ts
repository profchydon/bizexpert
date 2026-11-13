import { z } from "zod";

export const STOCK_REMOVAL_REASONS = [
  { value: "Damaged", label: "Damaged" },
  { value: "Expired", label: "Expired" },
  { value: "Excess", label: "Excess" },
  { value: "Other", label: "Other" },
] as const;

export type StockRemovalReason =
  (typeof STOCK_REMOVAL_REASONS)[number]["value"];

export const stockRemovalFormSchema = z
  .object({
    locationId: z.string().uuid("Select a store"),
    productId: z.string().uuid("Select a product"),
    quantity: z.coerce.number().positive("Enter a quantity"),
    reason: z.enum(["Damaged", "Expired", "Excess", "Other"]),
    notes: z.string().optional(),
  })
  .superRefine((values, ctx) => {
    if (values.reason === "Other" && !values.notes?.trim()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Enter a reason",
        path: ["notes"],
      });
    }
  });

export type StockRemovalFormValues = z.infer<typeof stockRemovalFormSchema>;

export const stockRemovalFormDefaults: StockRemovalFormValues = {
  locationId: "",
  productId: "",
  quantity: 1,
  reason: "Damaged",
  notes: "",
};

export function toStockRemovalPayload(values: StockRemovalFormValues) {
  const notes = values.notes?.trim();
  return {
    locationId: values.locationId,
    productId: values.productId,
    quantity: -Math.abs(values.quantity),
    reason: notes ? `${values.reason}: ${notes}` : values.reason,
    movementType: "damage" as const,
  };
}

export function removedQuantity(quantity: number | string | null | undefined) {
  return Math.abs(Number(quantity ?? 0));
}
