import type { Office, PreFlightCheck, Subsidiary } from "../types";
import type { EntityDetailApiRecord } from "@/api/baseQueries/companiesApi/entitiesApi/entityDetailTypes";
import { mapEntityCloseReadinessChecks } from "@/api/baseQueries/companiesApi/entitiesApi/mapEntityCloseReadiness";
import {
  mapEntityAdminRows,
  mapEntityAdminUserIds,
  type EntityAdminRow,
} from "@/api/baseQueries/companiesApi/entitiesApi/mapEntityPersonLabel";
import { mapEntityCostCentreSpend } from "@/api/baseQueries/companiesApi/entitiesApi/mapEntityCostCentreSpend";
import type { UiCostCentreSpendRow } from "@/api/baseQueries/companiesApi/entitiesApi/mapEntityCostCentreSpend";
import { mapEntityDetailOffices } from "@/api/baseQueries/companiesApi/entitiesApi/mapEntityDetailOffices";
import { mapEntityDetailToSubsidiary } from "@/api/baseQueries/companiesApi/entitiesApi/mapEntityDetailToSubsidiary";
import {
  mapEntityFootprint,
  type EntityFootprintCounts,
} from "@/api/baseQueries/companiesApi/entitiesApi/mapEntityFootprint";
import { mapEntityPaymentProcessor } from "./replaceCardCopy";

export type EntityDetailViewModel = {
  subsidiary: Subsidiary;
  adminUserIds: string[];
  adminRows: EntityAdminRow[];
  closeChecks: PreFlightCheck[];
  costCentreSpend: UiCostCentreSpendRow[];
  costCentreTotal: number;
  offices: Office[];
  footprint: EntityFootprintCounts;
  paymentProcessor: string | null;
};

export function buildEntityDetailViewModel(
  entity: EntityDetailApiRecord,
): EntityDetailViewModel {
  const subsidiary = mapEntityDetailToSubsidiary(entity);
  const spend = mapEntityCostCentreSpend(entity.cost_centre_spend);

  return {
    subsidiary,
    adminUserIds: mapEntityAdminUserIds(entity.admins),
    adminRows: mapEntityAdminRows(entity.admins),
    closeChecks: mapEntityCloseReadinessChecks(entity.close_readiness?.checks),
    costCentreSpend: spend.rows,
    costCentreTotal: spend.totalThisMonth,
    offices: mapEntityDetailOffices(entity.offices, entity.id, entity.name),
    footprint: mapEntityFootprint(entity),
    paymentProcessor: mapEntityPaymentProcessor(entity.country),
  };
}
