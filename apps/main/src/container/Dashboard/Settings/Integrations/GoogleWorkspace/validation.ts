import { z } from "zod";

export const configureGoogleWorkspaceSchema = z.object({
  sync_frequency: z.object({
    label: z.string({ message: "Sync Frequency is required" }),
    value: z.string({ message: "Sync Frequency is required" }),
  }),
  domain: z.string().min(2, { message: "Domain is required" }),
  excluded_emails: z.array(z.string().email()).optional(),
});
