import { isValidPhoneNumber } from "react-phone-number-input";
import { z } from "zod";
import { normalizeEmployeePhoneValue } from "@/utils/phone/parseEmployeePhone";

export const addEmployeeSchema = z.object({
  first_name: z.string().min(2, { message: "First name is required" }),
  last_name: z.string().min(2, { message: "Last name is required" }),
  email: z.string().min(2, { message: "Email is required" }),
  personal_email: z.string().nullable().optional(),
  phone: z.preprocess(
    (value) =>
      normalizeEmployeePhoneValue(
        typeof value === "string" ? value : undefined,
      ),
    z
      .string()
      .refine(
        (phoneValue) => phoneValue === "" || isValidPhoneNumber(phoneValue),
        {
          message: "Invalid phone number",
        },
      )
      .optional(),
  ),
  job_title: z.union([z.string().optional(), z.null()]),
  manager_id: z.union([z.string().optional(), z.null()]),
  employment_type: z.union([z.string().optional(), z.null()]),
  level: z.union([z.string().optional(), z.null()]),
  department_id: z.union([z.string().optional(), z.null()]),
  country_id: z.string().min(2, { message: "Country is required" }),
  address: z
    .string()
    .refine((value) => value === "" || value.trim().length >= 2, {
      message: "Address is required",
    })
    .optional(),
  landmark: z.union([z.string().optional(), z.null()]),
  tax_number: z.string().nullable().optional(),
});
