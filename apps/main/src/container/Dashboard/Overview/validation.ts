import { z } from "zod";

export const overViewCountrySchema = z.object({
  add_country: z.object({}).refine((obj) => Object.keys(obj).length > 0, {
    message: "Country is required",
  }),
});
