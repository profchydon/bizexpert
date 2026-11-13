import { z } from "zod";

export const loginFormSchema = z.object({
  email: z
    .string({
      required_error: "Valid email is required",
    })
    .email(),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long" })
    .regex(/[A-Z]/, {
      message: "Password must contain at least one uppercase letter",
    })
    .regex(/[\W_]/, { message: "Password must contain at least one symbol" }),
});
