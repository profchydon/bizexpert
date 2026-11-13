import { isSafeRedirectUrl } from "@/utils/auth/isSafeRedirectUrl";

const COUNTRY_SCOPED_SLUGS = new Set(["onboarding", "offboarding"]);

export type OptionCardAction =
  | { type: "none" }
  | { type: "invalid" }
  | { type: "external"; url: string }
  | { type: "internal"; path: string; storeCountry: boolean };

export function resolveOptionCardAction(
  link: string | undefined,
  slug: string,
): OptionCardAction {
  const trimmed = link?.trim();

  if (!trimmed) {
    return { type: "none" };
  }

  if (trimmed.startsWith("/") && !trimmed.startsWith("//")) {
    return {
      type: "internal",
      path: trimmed,
      storeCountry: COUNTRY_SCOPED_SLUGS.has(slug.toLowerCase()),
    };
  }

  const absolute = trimmed.startsWith("www.") ? `https://${trimmed}` : trimmed;

  if (isSafeRedirectUrl(absolute)) {
    return { type: "external", url: absolute };
  }

  return { type: "invalid" };
}
