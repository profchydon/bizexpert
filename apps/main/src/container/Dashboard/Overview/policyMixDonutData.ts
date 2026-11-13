export type PolicyMixSegment = {
  key: string;
  label: string;
  value: number;
  color: string;
};

const EMPTY_SLICE: PolicyMixSegment = {
  key: "empty",
  label: "Empty",
  value: 1,
  color: "var(--color-utility-gray-200)",
};

export function policyMixSegments(
  active: number,
  inactive: number,
): PolicyMixSegment[] {
  return [
    {
      key: "active",
      label: "Active",
      value: active,
      color: "var(--color-utility-brand-500)",
    },
    {
      key: "inactive",
      label: "Drafts",
      value: inactive,
      color: "var(--color-utility-gray-300)",
    },
  ];
}

export function policyMixChartData(
  segments: PolicyMixSegment[],
): PolicyMixSegment[] {
  const filled = segments.filter((segment) => segment.value > 0);
  if (filled.length > 0) return filled;
  return [EMPTY_SLICE];
}
