import type { CreateEntityRequest } from "@/api/baseQueries/companiesApi/entitiesApi/types";
import routes from "@/routes";
import type { SubsidiaryDraft } from "../types";

export const ENTITY_CREATE_RETURN_PATH = routes.ACCOUNTS;

export function buildCreateEntityPayload(
  draft: SubsidiaryDraft,
): CreateEntityRequest {
  const name = draft.name.trim();
  const email = draft.email.trim();
  const country = draft.region?.trim();
  const adminUserIds = draft.adminUserIds.filter(Boolean);

  if (draft.billingMode === "delegated") {
    return {
      name,
      email,
      ...(country ? { country } : {}),
      delegated_payer_id: draft.billingEntityId,
      admin_user_ids: adminUserIds,
    };
  }

  return {
    name,
    email,
    ...(country ? { country } : {}),
    billing_currency: draft.currency ?? undefined,
    return_path: ENTITY_CREATE_RETURN_PATH,
    admin_user_ids: adminUserIds,
  };
}
