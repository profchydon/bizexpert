import { z } from "zod";

export const employeeRequestFilterSchema = z.object({
  team: z
    .array(z.string())
    .refine((value) => value.some((team) => team))
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
