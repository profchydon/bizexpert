import { z } from "zod";

export const setupFormSchema = z.object({
  sync_frequency: z.object({
    label: z.string({ message: "Sync Frequency is required" }),
    value: z.string({ message: "Sync Frequency is required" }),
  }),
  excluded_emails: z.array(z.string().email()).optional(),
});
