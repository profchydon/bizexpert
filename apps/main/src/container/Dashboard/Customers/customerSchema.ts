import { z } from "zod";
import type { Customer } from "@/types/bizexpert";

export const customerFormSchema = z.object({
  name: z.string().trim().min(1, "Customer name is required").max(255),
  phone: z.string().optional(),
  email: z
    .string()
    .trim()
    .email("Enter a valid email")
    .optional()
    .or(z.literal("")),
  address: z.string().optional(),
  notes: z.string().optional(),
  creditLimit: z.coerce.number().min(0, "Credit limit cannot be negative"),
});

export type CustomerFormValues = z.infer<typeof customerFormSchema>;

export const customerFormDefaults: CustomerFormValues = {
  name: "",
  phone: "",
  email: "",
  address: "",
  notes: "",
  creditLimit: 0,
};

function optionalText(value?: string) {
  const next = value?.trim();
  return next ? next : undefined;
}

export function valuesFromCustomer(customer: Customer): CustomerFormValues {
  return {
    name: customer.name,
    phone: customer.phone ?? "",
    email: customer.email ?? "",
    address: customer.address ?? "",
    notes: customer.notes ?? "",
    creditLimit: Number(customer.creditLimit ?? 0),
  };
}

export function toCustomerPayload(values: CustomerFormValues) {
  return {
    name: values.name.trim(),
    phone: optionalText(values.phone),
    email: optionalText(values.email),
    address: optionalText(values.address),
    notes: optionalText(values.notes),
    creditLimit: values.creditLimit,
  };
}
