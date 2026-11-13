import { z } from "zod";

export const trackOrderSchema = z.object({
  orderId: z
    .string()
    .min(1, "Order number is required")
    .regex(
      /^[A-Z0-9-]+$/,
      "Order number should contain only uppercase letters and numbers",
    ),
});

export type TrackOrderFormValues = z.infer<typeof trackOrderSchema>;
