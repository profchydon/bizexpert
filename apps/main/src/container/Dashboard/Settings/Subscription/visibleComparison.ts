import type { ComparisonFeature, ComparisonGroup } from "./catalog";

const COMPLIANCE_GROUP = "compliance and policy";
const HIDDEN_GROUPS = new Set(["fleet intelligence", "it operations / ai"]);
const HIDDEN_CODES = new Set(["byod_support", "tags"]);
const HIDDEN_NAMES = new Set(["byod support", "tags"]);

function label(value: string): string {
  return value.trim().toLowerCase();
}

function isHiddenFeature(feature: ComparisonFeature): boolean {
  return (
    HIDDEN_CODES.has(feature.code) || HIDDEN_NAMES.has(label(feature.name))
  );
}

function isHrisIntegration(feature: ComparisonFeature): boolean {
  if (feature.code === "hris_integrations") return true;
  return label(feature.name).includes("hris");
}

function keepFeature(group: ComparisonGroup, feature: ComparisonFeature) {
  if (isHiddenFeature(feature)) return false;
  if (label(group.name) === COMPLIANCE_GROUP) return isHrisIntegration(feature);
  return true;
}

export function visibleComparisonGroups<T extends ComparisonGroup>(
  groups: T[],
): T[] {
  return groups.flatMap((group): T[] => {
    if (HIDDEN_GROUPS.has(label(group.name))) return [];
    const features = group.features.filter((feature) =>
      keepFeature(group, feature),
    );
    if (!features.length) return [];
    if (features.length === group.features.length) return [group];
    return [{ ...group, features } as T];
  });
}
