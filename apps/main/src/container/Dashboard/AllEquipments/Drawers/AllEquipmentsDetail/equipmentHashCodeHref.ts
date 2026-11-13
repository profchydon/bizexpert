import { isSafeRedirectUrl } from "@/utils/auth/isSafeRedirectUrl";

export function equipmentHashCodeHref(
  hashCode: string | null | undefined,
): string | undefined {
  const trimmed = hashCode?.trim();

  if (!trimmed || !isSafeRedirectUrl(trimmed)) {
    return undefined;
  }

  return trimmed;
}
