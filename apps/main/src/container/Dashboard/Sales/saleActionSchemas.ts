import { z } from "zod";

export const cancelSaleSchema = z.object({
  reason: z.string().trim().min(3, "Enter a reason"),
});

export type CancelSaleValues = z.infer<typeof cancelSaleSchema>;

export const refundSaleSchema = z.object({
  reason: z.string().trim().min(1, "Enter a reason"),
  returnGoods: z.boolean().optional(),
});

export type RefundSaleValues = z.infer<typeof refundSaleSchema>;

export const addPaymentSchema = z.object({
  amount: z.coerce.number().positive("Enter an amount"),
  method: z.enum(["cash", "transfer", "pos", "credit"]),
  reference: z.string().optional(),
});

export type AddPaymentValues = z.infer<typeof addPaymentSchema>;

export const shareWhatsappSchema = z.object({
  phone: z.string().trim().min(8, "Enter a phone number"),
});

export type ShareWhatsappValues = z.infer<typeof shareWhatsappSchema>;
