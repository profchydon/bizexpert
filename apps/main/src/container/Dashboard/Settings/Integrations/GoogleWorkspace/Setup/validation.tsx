import { z } from "zod";

export const setupSchema = z.object({
  authorize: z
    .boolean()
    .refine((val) => val === true, { message: "Accept authorization" }),
});
