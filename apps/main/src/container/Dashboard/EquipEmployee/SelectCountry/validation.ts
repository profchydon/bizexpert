import { z } from "zod";

export const selectCountrySchema = z.object({
  // country: z.object({}).refine((obj) => Object.keys(obj).length > 0, {
  //   message: "Country is required",
  // }),
});
