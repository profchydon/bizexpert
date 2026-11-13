import type {
  CatalogRuleConflict,
  CatalogRuleConflictEmployee,
} from "@/types/catalogPolicy";

export function getConflictSignature(conflicts: CatalogRuleConflict[]) {
  return conflicts
    .map((conflict) =>
      [
        conflict.type,
        conflict.rule_id,
        conflict.policy_id ?? "",
        conflict.employees_count ?? "",
      ].join(":"),
    )
    .sort()
    .join("|");
}

export function getPrimaryConflict(conflicts: CatalogRuleConflict[]) {
  return (
    conflicts.find((conflict) => conflict.type === "amber") ??
    conflicts.find((conflict) => conflict.type === "red") ??
    null
  );
}

export function requiresConflictAcknowledgement({
  conflicts,
  requiresAcknowledgment,
}: {
  conflicts: CatalogRuleConflict[];
  requiresAcknowledgment?: boolean;
}) {
  if (requiresAcknowledgment) return conflicts.length > 0;
  return conflicts.some(
    (conflict) =>
      conflict.blocks_save_without_ack === true || conflict.type === "amber",
  );
}

export function formatConflictEmployeeName(
  employee: CatalogRuleConflictEmployee,
) {
  const name = [employee.first_name, employee.last_name]
    .filter(Boolean)
    .join(" ")
    .trim();
  return name || employee.email || "Unknown employee";
}

export function getConflictPolicyName(conflict: CatalogRuleConflict) {
  return conflict.policy_name || conflict.rule_name || "another policy";
}
