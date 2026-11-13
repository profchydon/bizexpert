import { z } from "zod";

export const E164_PHONE = /^\+[1-9]\d{6,14}$/;

export const whatsappLinkSchema = z.object({
  whatsappPhone: z
    .string()
    .trim()
    .regex(E164_PHONE, "Phone must be E.164 format, e.g. +2348012345678"),
  defaultLocationId: z.string().optional(),
});

export type WhatsappLinkValues = z.infer<typeof whatsappLinkSchema>;

export const whatsappLinkDefaults: WhatsappLinkValues = {
  whatsappPhone: "",
  defaultLocationId: "",
};

export function toWhatsappLinkPayload(values: WhatsappLinkValues) {
  const defaultLocationId = values.defaultLocationId?.trim();
  return {
    whatsappPhone: values.whatsappPhone.trim(),
    ...(defaultLocationId ? { defaultLocationId } : {}),
  };
}
