import type {
  CatalogPolicyApiPolicy,
  CatalogPolicyApiRule,
} from "@/types/catalogPolicy";
import { getPolicyRules } from "@/container/Dashboard/CatalogPolicies/apiAdapters";

function kitIdsFromRule(rule: CatalogPolicyApiRule) {
  const kits = rule.kits;
  if (Array.isArray(kits)) return kits.filter(Boolean);
  return (kits?.data ?? []).map((kit) => kit.id).filter(Boolean);
}

function rulesForKitSummary(policy: CatalogPolicyApiPolicy) {
  const nested = getPolicyRules(policy);
  if (!policy.main_rule) {
    return nested;
  }

  return [
    policy.main_rule,
    ...nested.filter((rule) => rule.id !== policy.main_rule?.id),
  ];
}

function countryLabelsFromRule(rule: CatalogPolicyApiRule) {
  return (rule.countries ?? []).flatMap((country) => {
    if (typeof country === "string") {
      return country.trim() ? [country.trim()] : [];
    }

    const name = country.name?.trim();
    return name ? [name] : [];
  });
}

export function policiesApplyingInCountry(
  policies: CatalogPolicyApiPolicy[],
  country?: string,
) {
  if (!country) {
    return policies;
  }

  return policies.filter((policy) => {
    const labels = rulesForKitSummary(policy).flatMap(countryLabelsFromRule);
    return labels.length === 0 || labels.includes(country);
  });
}

export function summarizeCatalogPolicies(policies: CatalogPolicyApiPolicy[]) {
  const live = policies.filter((policy) => !policy.is_archived);
  const kitIds = new Set<string>();

  for (const policy of live) {
    for (const rule of rulesForKitSummary(policy)) {
      for (const kitId of kitIdsFromRule(rule)) {
        kitIds.add(kitId);
      }
    }
  }

  return {
    activeCount: live.filter((policy) => policy.status === "active").length,
    inactiveCount: live.filter((policy) => policy.status === "inactive").length,
    kitCount: kitIds.size,
  };
}
