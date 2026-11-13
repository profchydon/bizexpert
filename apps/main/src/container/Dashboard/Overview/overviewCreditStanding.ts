import type { EntityApiRecord } from "@/api/baseQueries/companiesApi/entitiesApi/types";
import { mapEntityToSubsidiary } from "@/api/baseQueries/companiesApi/entitiesApi/mapEntityToSubsidiary";
import type { CreditState } from "@/container/Dashboard/Accounts/types";
import {
  creditColor,
  creditLabel,
  creditTooltip,
  statusColor,
  statusImplication,
  statusLabel,
} from "@/container/Dashboard/Accounts/utils/badgeTooltips";
import type { BadgeColors } from "@/components/base/badges/badge-types";

export type OverviewCreditView = CreditState | "suspended";

export function pickOverviewBillingEntity(
  entities: EntityApiRecord[],
  activeEntityId: string | null,
) {
  if (activeEntityId) {
    return entities.find((entity) => entity.id === activeEntityId) ?? null;
  }

  return entities.find((entity) => entity.is_primary) ?? entities[0] ?? null;
}

export function shouldListOverviewEntities(isGlobalAdmin: boolean) {
  return isGlobalAdmin;
}

export function shouldLoadOverviewEntityDetail(
  isGlobalAdmin: boolean,
  entityId?: string | null,
) {
  return Boolean(entityId) && !isGlobalAdmin;
}

export function resolveOverviewCreditEntity(
  isGlobalAdmin: boolean,
  listed: EntityApiRecord[],
  activeEntityId: string | null,
  detail: EntityApiRecord | null,
) {
  if (isGlobalAdmin) {
    return pickOverviewBillingEntity(listed, activeEntityId);
  }

  return detail;
}

export function resolveOverviewCreditView(
  entity: EntityApiRecord | null,
): OverviewCreditView | null {
  if (!entity) {
    return null;
  }

  const subsidiary = mapEntityToSubsidiary(entity);

  if (subsidiary.status === "suspended") {
    return "suspended";
  }

  return subsidiary.creditState;
}

const creditViewLabel: Record<OverviewCreditView, string> = {
  ...creditLabel,
  suspended: statusLabel.suspended,
};

const creditViewColor: Record<OverviewCreditView, BadgeColors> = {
  ...creditColor,
  suspended: statusColor.suspended,
};

const creditViewContext: Record<OverviewCreditView, string> = {
  "card-only": creditTooltip["card-only"],
  assessing: creditTooltip.assessing,
  "active-credit": creditTooltip["active-credit"],
  suspended: statusImplication.suspended,
};

export function overviewCreditCopy(view: OverviewCreditView) {
  return {
    label: creditViewLabel[view],
    color: creditViewColor[view],
    context: creditViewContext[view],
    showContext: view !== "active-credit",
  };
}

export function overviewCreditHasSpend(view: OverviewCreditView | null) {
  return view === "active-credit";
}
