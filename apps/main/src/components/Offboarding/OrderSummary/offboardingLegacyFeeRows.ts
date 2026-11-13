import type { FeeRow } from "@/lib/tax/feeSummary";

export const buildOffboardingLegacyFeeRows = (calculateOffboardingFeesData?: {
  fee_summary?: Record<string, unknown>;
}): FeeRow[] => {
  if (!calculateOffboardingFeesData?.fee_summary) return [];

  return Object.entries(calculateOffboardingFeesData.fee_summary)
    .filter(([key]) => key !== "currency" && key !== "total_fee")
    .map(([key, value]) => ({
      key,
      name: key
        .replaceAll("_", " ")
        .replaceAll(/\b\w/g, (char) => char.toUpperCase()),
      value: value as number,
    }))
    .filter((fee) => Number(fee.value) !== 0);
};
