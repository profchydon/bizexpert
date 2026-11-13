import type { Subsidiary } from "@/container/Dashboard/Accounts/types";
import type { EntityDetailApiRecord } from "./entityDetailTypes";
import {
  mapEntityAdminLabels,
  mapEntityAdminUserIds,
  mapEntityPersonLabel,
} from "./mapEntityPersonLabel";
import { mapEntityToSubsidiary } from "./mapEntityToSubsidiary";

export function mapEntityDetailToSubsidiary(
  entity: EntityDetailApiRecord,
): Subsidiary {
  const base = mapEntityToSubsidiary(entity);
  const admins = mapEntityAdminLabels(entity.admins);
  const createdBy =
    mapEntityPersonLabel(entity.created_by) || entity.email || base.createdBy;

  return {
    ...base,
    admins: admins.length > 0 ? admins : base.admins,
    createdBy,
  };
}
