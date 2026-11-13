import { z } from "zod";

export const setupFormSchema = z.object({
  tenant_id: z.string().min(2, { message: "Tenant ID is required" }),
  client_id: z.string().min(2, { message: "Client ID is required" }),
  subscription_id: z.string().optional(),
  client_secret: z.string().min(2, { message: "Client secret is required" }),
});
