import { z } from "zod";
import { isValidPhoneNumber } from "react-phone-number-input";

export const signupFormSchema = z.object({
  first_name: z.string().min(2, { message: "First name is required" }),
  last_name: z.string().min(2, { message: "Last name is required" }),
  email: z
    .string({
      required_error: "Valid email is required",
    })
    .email(),
  phone: z
    .string()
    .refine(isValidPhoneNumber, { message: "Invalid phone number" }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long" }),
});
