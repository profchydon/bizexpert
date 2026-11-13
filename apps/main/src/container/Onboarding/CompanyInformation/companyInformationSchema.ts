"use client";

import { z } from "zod";

export const companyInformationSchema = z.object({
  business_website: z.string().optional(),
  country: z
    .string()
    .min(2, { message: "Country is required" })
    .max(50, { message: "Country must be 50 characters or less" }),
  address: z.string().min(2, { message: "Business address is required" }),
});
