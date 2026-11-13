"use client";

import { useMemo } from "react";
import { useGetOfficeQuery } from "@/api/baseQueries/companiesApi/officesApi/getOffice";
import type { Office } from "../../types";
import type {
  OfficeCloseReadiness,
  OfficeSnapshot,
  ServerOfficeArea,
  ServerOfficeDetail,
} from "@/types/offices";
import { toUiOfficeFromDetail } from "../utils/mapServerOffice";
import { useCompanyId } from "./useOfficesServer";

export interface OfficeDetailData {
  office: Office | undefined;
  detail: ServerOfficeDetail | undefined;
  areas: ServerOfficeArea[];
  snapshot: OfficeSnapshot | undefined;
  closeReadiness: OfficeCloseReadiness | undefined;
  isLoading: boolean;
  isError: boolean;
}

export function useOfficeDetail(
  officeId: string,
  entityId?: string,
): OfficeDetailData {
  const primaryCompanyId = useCompanyId();
  const companyId = entityId || primaryCompanyId;
  const { data, isLoading, isError } = useGetOfficeQuery(
    { companyId: companyId as string, officeId },
    { skip: !companyId || !officeId },
  );

  const detail = data?.data;
  const office = useMemo(
    () => (detail ? toUiOfficeFromDetail(detail) : undefined),
    [detail],
  );

  return {
    office,
    detail,
    areas: detail?.areas ?? [],
    snapshot: detail?.snapshot,
    closeReadiness: detail?.close_readiness,
    isLoading: isLoading || !companyId,
    isError,
  };
}
