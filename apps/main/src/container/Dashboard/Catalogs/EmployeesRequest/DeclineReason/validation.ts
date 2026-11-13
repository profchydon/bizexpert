import { z } from "zod";

export const declineSchema = z.object({
  rejection: z.string().min(2, { message: "State your reason for rejection" }),
});
