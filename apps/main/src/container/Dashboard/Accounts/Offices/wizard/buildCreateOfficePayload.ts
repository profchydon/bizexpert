import type { CreateOfficePayload } from "@/types/offices";
import type { OfficeDraft } from "../../types";

export function isWorkspaceOwnEntity(
  parentId: string,
  workspaceCompanyId: string | undefined,
): boolean {
  if (!workspaceCompanyId) return false;
  return parentId.trim() === workspaceCompanyId.trim();
}

export function buildCreateOfficePayload(
  draft: OfficeDraft,
  parentId: string,
  workspaceCompanyId?: string,
): CreateOfficePayload {
  const physical = draft.type === "physical";
  return {
    name: draft.name.trim(),
    type: draft.type,
    street_address: physical ? draft.address.trim() : undefined,
    ...(isWorkspaceOwnEntity(parentId, workspaceCompanyId)
      ? {}
      : { subsidiary_id: parentId }),
    admin_user_ids: draft.adminNames,
  };
}
