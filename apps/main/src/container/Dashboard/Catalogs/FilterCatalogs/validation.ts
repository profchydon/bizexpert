import { z } from "zod";

export const catalogFilterSchema = z.object({
  type: z
    .array(z.string())
    .refine((value) => value.some((type) => type))
    .optional(),

  level: z
    .array(z.string())
    .refine((value) => value.some((level) => level))
    .optional(),

  country: z
    .array(z.string())
    .refine((value) => value.some((country) => country))
    .optional(),

  department: z
    .array(z.string())
    .refine((value) => value.some((department) => department))
    .optional(),
});
