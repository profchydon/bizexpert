import { z } from "zod";

export const transactionHistorySchema = z.object({
  id: z.string(),
  amount: z.string(),
  reference: z.string(),
  payment: z.string(),
  total_equipments: z.string(),
  method: z.string(),
  date: z.string(),
  status: z.string(),
});

export type I_TransactionHistory = z.infer<typeof transactionHistorySchema>;
