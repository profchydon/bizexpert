import { z } from "zod";
import type { User } from "@/types/bizexpert";

export const profileFormSchema = z.object({
  name: z.string().trim().min(1, "Name is required"),
  phone: z.string().optional(),
});

export type ProfileFormValues = z.infer<typeof profileFormSchema>;

export const profileFormDefaults: ProfileFormValues = {
  name: "",
  phone: "",
};

export function valuesFromUser(user: User): ProfileFormValues {
  return {
    name: user.name,
    phone: user.phone ?? "",
  };
}

export function toProfilePayload(values: ProfileFormValues) {
  return {
    name: values.name.trim(),
    phone: values.phone?.trim() ?? "",
  };
}

export function toPublicUser(raw: {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  isActive: boolean;
}): User {
  return {
    id: raw.id,
    name: raw.name,
    email: raw.email,
    phone: raw.phone ?? undefined,
    isActive: raw.isActive,
  };
}
