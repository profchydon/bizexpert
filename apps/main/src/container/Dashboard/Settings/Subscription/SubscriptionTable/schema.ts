import { z } from "zod";

export const subscriptionSchema = z.object({
  id: z.string(),
  name: z.string(),
  date: z.string(),
  status: z.string(),
  amount: z.string(),
  plan: z.string(),
});

export type Task = z.infer<typeof subscriptionSchema>;
