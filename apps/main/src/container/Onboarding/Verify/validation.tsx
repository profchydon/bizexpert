import { z } from "zod";

export const otpSchema = z.object({
  otp: z.string().min(4, {
    message: "Your one-time password must be 4 characters.",
  }),
});
