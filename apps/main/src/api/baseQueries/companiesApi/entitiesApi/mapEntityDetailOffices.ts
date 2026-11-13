import type { ServerOffice } from "@/types/offices";
import type { Office } from "@/container/Dashboard/Accounts/types";
import { toUiOffice } from "@/container/Dashboard/Accounts/Offices/utils/mapServerOffice";

export function mapEntityDetailOffices(
  offices: ServerOffice[] | undefined,
  entityId: string,
  entityName = "",
) {
  if (!offices?.length) return [] as Office[];
  return offices.map((office) => ({
    ...toUiOffice(office),
    subsidiaryId: office.entity?.id ?? entityId,
    subsidiaryName: office.entity?.name ?? entityName,
  }));
}
