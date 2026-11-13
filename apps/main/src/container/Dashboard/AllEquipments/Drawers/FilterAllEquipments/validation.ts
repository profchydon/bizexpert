import { z } from "zod";

export const equipmentFilterSchema = z.object({
  type: z
    .array(z.string())
    .refine((value) => value.some((equipment) => equipment))
    .optional(),
  status: z
    .array(z.string())
    .refine((value) => value.some((equipment) => equipment))
    .optional(),
  acquisition: z
    .array(z.string())
    .refine((value) => value.some((equipment) => equipment))
    .optional(),
});
