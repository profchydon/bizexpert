import { z } from "zod";

export const addInviteSchema = z.object({
  emails: z.string().min(2, { message: "Valid email is required" }),
  levels: z.unknown().optional(),
  departments: z.unknown().optional(),
});
