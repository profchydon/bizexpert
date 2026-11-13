import type { EntityConsent } from "./types";

export type EntityConsentPayload = EntityConsent & {
  card_captured?: boolean;
  customer_id?: string;
  environment?: string;
};

export function resolveEntityCardCaptureUrl(
  consent: EntityConsentPayload | null | undefined,
) {
  const url = consent?.url?.trim();
  return url || null;
}
