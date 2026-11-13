import { z } from "zod";

export const inviteEmployeeSchema = z.object({
  emails: z.string().min(2, { message: "Emails is required" }),
  // department_id: z.string().optional(),
});
