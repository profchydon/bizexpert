import { z } from "zod";

export const passwordSchema = z.object({
  password: z
    .string()
    .min(8, { message: "Your new password must be more than 8 characters." }),
  newPassword: z
    .string()
    .min(8, { message: "Your new password must be more than 8 characters." }),
  currentPassword: z
    .string()
    .min(8, { message: "Your new password must be more than 8 characters." }),
});
