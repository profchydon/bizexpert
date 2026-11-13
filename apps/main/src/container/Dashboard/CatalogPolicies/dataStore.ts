import { initialCatalogRules } from "./dataRules";
import type { CatalogRule } from "./types";

let catalogRules: CatalogRule[] = [...initialCatalogRules];

export function getCatalogRules() {
  return catalogRules;
}

export function getCatalogRule(id: string) {
  return catalogRules.find((rule) => rule.id === id);
}

export function getChildRules(parentId: string) {
  return catalogRules.filter((rule) => rule.parentRuleId === parentId);
}

export function addCatalogRule(rule: CatalogRule) {
  catalogRules = [rule, ...catalogRules];
}

export function updateCatalogRule(id: string, updates: Partial<CatalogRule>) {
  catalogRules = catalogRules.map((rule) =>
    rule.id === id ? { ...rule, ...updates } : rule,
  );
}

export function removeCatalogRule(id: string) {
  catalogRules = catalogRules.filter((rule) => rule.id !== id);
}
