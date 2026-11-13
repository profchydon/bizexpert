import { isValidPhoneNumber } from "react-phone-number-input";
import { z } from "zod";

export const addNewEmployeeSchema = z.object({
  first_name: z.string().min(2, { message: "First name is required" }),
  last_name: z.string().min(2, { message: "Last name is required" }),
  email: z.string().min(2, { message: "Email is required" }),
  phone: z
    .string()
    .refine(isValidPhoneNumber, { message: "Invalid phone number" }),
  job_title: z.string().optional(),
  employment_type: z.string().optional(),
  level: z.string().optional(),
  department_id: z.string().optional(),
  country_id: z.string().min(2, { message: "Country is required" }),
  address: z.string().min(2, { message: "Address is required" }),
});
