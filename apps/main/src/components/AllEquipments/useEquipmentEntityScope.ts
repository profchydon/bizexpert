import { useMemo } from "react";
import { useGetEquipmentsQuery } from "@/api/baseQueries/companiesApi/equipmentsApi/getEquipments";
import type { IEquipment } from "@/types/equipments";
import { isActiveVaultEquipment } from "@/container/Dashboard/Accounts/utils/entityFootprint";
import { resolveEquipmentListStatus } from "./equipmentListStatus";
import { mapEquipmentListRows } from "./mapEquipmentListRows";
import { EQUIPMENT_API_PAGE_SIZE } from "./equipmentApiPageSize";

const ENTITY_SCOPE_PAGE_SIZE = EQUIPMENT_API_PAGE_SIZE;

export {
  equipmentEntityScopePageSize,
  paginateEquipmentRows,
} from "./paginateEquipmentRows";

export function useEquipmentEntityScope(
  entityId: string | null,
  companyId: string | undefined,
  archived?: boolean,
) {
  const { data, isLoading, isFetching, isError } = useGetEquipmentsQuery(
    {
      companyId: (entityId ?? companyId) as string,
      params: {
        page: 1,
        per_page: ENTITY_SCOPE_PAGE_SIZE,
        status: resolveEquipmentListStatus(archived),
      },
    },
    { skip: !companyId || !entityId },
  );

  const scopedRows = useMemo(() => {
    if (!entityId) return [];
    return mapEquipmentListRows(data?.data?.data as IEquipment[]).filter(
      isActiveVaultEquipment,
    );
  }, [data, entityId]);

  return {
    scopedRows,
    scopedTotal: scopedRows.length,
    scopedLoading: isLoading || isFetching,
    scopedError: isError,
  };
}
