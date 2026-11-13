import { z } from "zod";

export const setupFormSchema = z.object({
  abm_id: z.string().min(2, { message: "Invalid ABM ID, Try again" }),
});
