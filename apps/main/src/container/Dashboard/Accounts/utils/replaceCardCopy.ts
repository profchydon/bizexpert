import type { EntityCountryRef } from "@/api/baseQueries/companiesApi/entitiesApi/types";

const PROCESSOR_LABELS: Record<string, string> = {
  airwallex: "Airwallex",
  stripe: "Stripe",
};

export function mapEntityPaymentProcessor(
  country: string | EntityCountryRef | null | undefined,
): string | null {
  if (!country || typeof country === "string") return null;
  return country.payment_processor?.trim() || null;
}

export function cardProcessorLabel(processor: string | null | undefined) {
  const value = processor?.trim();
  if (!value) return "Airwallex";
  return PROCESSOR_LABELS[value.toLowerCase()] ?? value;
}

export function replaceCardCopy(
  hasCard: boolean,
  entityName: string,
  processor: string,
) {
  const name = entityName || "this entity";
  return {
    title: hasCard ? "Replace card" : "Add card",
    description: hasCard
      ? `Add a new card for ${name} on ${processor}'s secure hosted page, then come back here. It replaces the current card and billing carries on without a break.`
      : `Add a card for ${name} on ${processor}'s secure hosted page, then come back here. This entity can't bill until its card is captured.`,
    status: hasCard
      ? "A card is saved for this entity."
      : "No card captured yet.",
    confirm: `Continue to ${processor}`,
    secure: `Payments are processed securely by ${processor}. Rayda never stores your card number.`,
  };
}
