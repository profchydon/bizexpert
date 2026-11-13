import { useEffect, useRef } from "react";
import { useGetSingleEmployeeQuery } from "@/api/baseQueries/companiesApi/employeesApi/getSingleEmployee";
import { catalogPoliciesToEquipItems } from "./catalogPolicyToEquipItems";
import type { EquipDeviceItem } from "./equipTypes";
import { useWorkspaceCompanyId } from "@/hooks/useWorkspaceCompanyId";

type PrefillDevices = (employeeId: string, items: EquipDeviceItem[]) => void;

export const usePolicyPrefill = (
  currentId: string | undefined,
  prefillDevices: PrefillDevices,
) => {
  const companyId = useWorkspaceCompanyId();

  const { data } = useGetSingleEmployeeQuery(
    { companyId: companyId!, employeeId: currentId! },
    { skip: !companyId || !currentId },
  );

  const prefilledRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    const detail = data?.data;
    if (!detail || !currentId || String(detail.id) !== String(currentId))
      return;
    if (prefilledRef.current.has(currentId)) return;

    prefilledRef.current.add(currentId);
    const items = catalogPoliciesToEquipItems(detail.catalog_policies);
    if (items.length > 0) prefillDevices(currentId, items);
  }, [data, currentId, prefillDevices]);
};
