import { z } from "zod";

export const ApiKeysSchema = z.object({
  secret_key: z.string().nullable().optional(),
  public_key: z.string().nullable().optional(),
  callback_url: z.string().nullable().optional(),
  webhook_url: z.string().nullable().optional(),
});
