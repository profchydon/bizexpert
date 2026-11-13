import { z } from "zod";

export const companyProfileFormSchema = z.object({
  business_name: z.string().min(1, { message: "Business name is required" }),
  email: z
    .string({
      required_error: "Work email is required",
    })
    .email(),
  employee_size: z.string().min(1, { message: "Employee size is required" }),
});
