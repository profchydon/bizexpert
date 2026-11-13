import { isValidPhoneNumber } from "react-phone-number-input";
import { z } from "zod";

export const setupFormSchema = z.object({
  notification_email: z.string().min(2, { message: "Tenant ID is required" }),
  activity_log: z.boolean().optional().default(false),
  name: z.string().min(2, { message: "Support name is required" }),
  email: z.string().min(2, { message: "Support email is required" }),
  phone: z
    .string()
    .refine(isValidPhoneNumber, { message: "Invalid phone number" }),
});
