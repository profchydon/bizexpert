import { z } from "zod";
import { isValidPhoneNumber } from "react-phone-number-input";

export const profileFormSchema = z.object({
  first_name: z.string().min(2, { message: "First name is required" }),
  last_name: z.string().min(2, { message: "Last name is required" }),
  phone: z
    .string()
    .refine(isValidPhoneNumber, { message: "Invalid phone number" }),
  email: z.string().min(2, { message: "Email is required" }),
  department: z.string().optional(),
  address: z.string().optional(),
});

export const passwordFormSchema = z.object({
  current_password: z
    .string()
    .min(2, { message: "Current password is required" }),
  new_password: z.string().min(2, { message: "New password is required" }),
  confirm_password: z
    .string()
    .min(2, { message: "Confirm password is required" }),
});
