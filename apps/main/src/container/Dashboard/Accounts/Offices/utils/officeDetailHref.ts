import routes from "@/routes";
import type { Office } from "../../types";

export const OFFICE_DETAIL_ENTITY_PARAM = "entityId";
export const OFFICE_DETAIL_FROM_PARAM = "from";
export const OFFICE_DETAIL_FROM_SUBSIDIARY = "subsidiary";

export function officeDetailHref(
  office: Pick<Office, "id" | "subsidiaryId">,
  options?: { fromSubsidiary?: boolean },
) {
  const params: string[] = [];
  if (office.subsidiaryId) {
    params.push(
      `${OFFICE_DETAIL_ENTITY_PARAM}=${encodeURIComponent(office.subsidiaryId)}`,
    );
  }
  if (options?.fromSubsidiary) {
    params.push(
      `${OFFICE_DETAIL_FROM_PARAM}=${encodeURIComponent(OFFICE_DETAIL_FROM_SUBSIDIARY)}`,
    );
  }
  const base = routes.OFFICE_DETAIL(office.id);
  return params.length > 0 ? `${base}?${params.join("&")}` : base;
}

export function resolveOfficeDetailEntityId(search: {
  entityId?: string;
  entity?: string;
}) {
  const entityId = search.entityId || search.entity;
  return {
    entityId,
    rewriteLegacy: !search.entityId && Boolean(search.entity),
  };
}

export function isOfficeDetailFromSubsidiary(from?: string) {
  return from === OFFICE_DETAIL_FROM_SUBSIDIARY;
}

export function officeCloseRedirectPath(
  entityId: string | undefined,
  fromSubsidiary: boolean,
) {
  if (fromSubsidiary && entityId) {
    return routes.SUBSIDIARY_DETAIL(entityId);
  }
  return `${routes.ACCOUNTS}?tab=offices`;
}
