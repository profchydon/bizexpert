import { z } from "zod";
import { isValidPhoneNumber } from "react-phone-number-input";

export const signupFormSchema = z.object({
  first_name: z.string().min(2, { message: "First name is required" }),
  last_name: z.string().min(2, { message: "Last name is required" }),
  email: z.string().optional(),
  phone: z
    .string()
    .refine(isValidPhoneNumber, { message: "Invalid phone number" }),
  job_title: z.string().min(2, { message: "Job title is required" }),
  address: z.string().min(2, { message: "Address is required" }),
  employment_type: z.string().min(2, { message: "Employee type is required" }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long" }),
});
