export type EntityDetailHeaderAction =
  | "replace-card"
  | "add-card"
  | "manage-admins"
  | "edit"
  | "close";

export function entityDetailHeaderActions(input: {
  isPrimary: boolean;
  canEdit: boolean;
  canClose: boolean;
  cardOnFile: boolean;
}): EntityDetailHeaderAction[] {
  if (input.isPrimary) {
    if (!input.canEdit) return [];
    return [input.cardOnFile ? "replace-card" : "add-card", "manage-admins"];
  }

  const actions: EntityDetailHeaderAction[] = [];
  if (input.canEdit) actions.push("edit", "manage-admins");
  if (input.canClose) actions.push("close");
  return actions;
}

export function nextAdminUserIds(current: string[], added: string[]) {
  const next = [...current];
  for (const id of added) {
    if (id && !next.includes(id)) next.push(id);
  }
  return next;
}

export function adminIdsAfterRevoke(current: string[], revokeId: string) {
  if (current.length <= 1) return current;
  return current.filter((id) => id !== revokeId);
}

export function entityAdminInitials(value: string) {
  const base = value.includes("@") ? (value.split("@")[0] ?? value) : value;
  const parts = base.split(/[\s._-]+/).filter(Boolean);
  return ((parts[0]?.[0] ?? "") + (parts[1]?.[0] ?? "")).toUpperCase();
}
