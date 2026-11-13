import { z } from "zod";

export const notificationSchema = z.object({
  notification: z.object({
    orders: z.array(z.string()).optional().default([]),
    billing: z.array(z.string()).optional().default([]),
    support: z.array(z.string()).optional().default([]),
  }),
});
