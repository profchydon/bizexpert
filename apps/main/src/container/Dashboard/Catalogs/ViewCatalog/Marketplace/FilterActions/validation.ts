import { z } from "zod";

export const filterActionSchema = z.object({
  type: z
    .array(z.string())
    .refine((value) => value.some((item) => item))
    .optional(),
  assets: z
    .array(z.string())
    .refine((value) => value.some((item) => item))
    .optional(),
  from: z.string().optional(),
  to: z.string().optional(),
});
