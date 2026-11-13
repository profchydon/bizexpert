"use client";

import { useMemo } from "react";
import { useGetInStorageEquipmentDetailQuery } from "@/api/baseQueries/companiesApi/equipmentsApi/getInStorageEquipmentDetail";
import { useWorkspaceCompanyId } from "@/hooks/useWorkspaceCompanyId";
import { useWorkspaceEquipmentDefaults } from "@/hooks/useWorkspaceEquipmentDefaults";
import { mapInStorageEquipmentDetail } from "../utils/mapInStorageEquipmentDetail";

export function useStorageEquipmentDetail(
  equipmentId: string | undefined,
  enabled: boolean,
) {
  const companyId = useWorkspaceCompanyId() ?? "";
  const { currencyCode } = useWorkspaceEquipmentDefaults();

  const query = useGetInStorageEquipmentDetailQuery(
    { companyId, equipmentId: equipmentId ?? "" },
    { skip: !companyId || !equipmentId || !enabled },
  );

  const detail = useMemo(
    () =>
      query.data?.data
        ? mapInStorageEquipmentDetail(query.data.data, currencyCode)
        : undefined,
    [currencyCode, query.data],
  );

  return {
    detail,
    isLoading: query.isLoading || query.isFetching,
    isError: query.isError,
    refetch: query.refetch,
  };
}
