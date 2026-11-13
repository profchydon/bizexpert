"use client";

import { useMemo } from "react";
import { useParams } from "next/navigation";
import { useGetEquipmentsQuery } from "@/api/baseQueries/companiesApi/equipmentsApi/getEquipments";
import { EQUIPMENT_API_PAGE_SIZE } from "@/components/AllEquipments/equipmentApiPageSize";
import type { IEquipment } from "@/types/equipments";
import { useAuthUserDetail } from "@/utils/useAuthUser";
import { useWorkspaceCompanyId } from "@/hooks/useWorkspaceCompanyId";

export function useEquipmentAdjacentNavigation(
  allEquipment: IEquipment[] | null | undefined,
) {
  const { equipmentId } = useParams<{ equipmentId: string }>();
  const { getCompanyDetails } = useAuthUserDetail();
  const company = getCompanyDetails();
  const companyId = useWorkspaceCompanyId();

  const storedIds = useMemo(
    () => allEquipment?.map((item) => String(item.id)).filter(Boolean) ?? [],
    [allEquipment],
  );

  const { data: fallbackResponse, isFetching: isFallbackFetching } =
    useGetEquipmentsQuery(
      {
        companyId: companyId!,
        params: { page: 1, per_page: EQUIPMENT_API_PAGE_SIZE },
      },
      { skip: !companyId || storedIds.length > 0 },
    );

  const equipmentIds = useMemo(() => {
    if (storedIds.length > 0) return storedIds;
    const rows = fallbackResponse?.data?.data as IEquipment[] | undefined;
    return rows?.map((item) => String(item.id)).filter(Boolean) ?? [];
  }, [storedIds, fallbackResponse?.data?.data]);

  const currentIndex = equipmentIds.indexOf(String(equipmentId));
  const hasPrev = currentIndex > 0;
  const hasNext = currentIndex >= 0 && currentIndex < equipmentIds.length - 1;

  return {
    equipmentIds,
    currentIndex,
    hasPrev,
    hasNext,
    isResolvingNavigation: storedIds.length === 0 && isFallbackFetching,
  };
}
