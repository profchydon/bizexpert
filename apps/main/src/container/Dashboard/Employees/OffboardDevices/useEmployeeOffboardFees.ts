import { useMemo } from "react";
import { useWorkspaceCompanyId } from "@/hooks/useWorkspaceCompanyId";
import { useGetOffboardFeesQuery } from "@/api/baseQueries/feesApi/getOffboardFees";
import { useTaxContext } from "@/hooks/useTaxContext";
import { useAuthUserDetail } from "@/utils/useAuthUser";
import type { DeviceLine } from "@/types/offboard";
import {
  buildOffboardFeesRequest,
  extractOffboardFeeBreakdown,
  type OffboardFeeBreakdown,
} from "./offboardFeeBreakdown";

interface Args {
  employeeId: string;
  lines: DeviceLine[];
}

interface Result {
  breakdown: OffboardFeeBreakdown;
  isLoading: boolean;
  isError: boolean;
}

export const useEmployeeOffboardFees = ({
  employeeId,
  lines,
}: Args): Result => {
  const { getCompanyDetails } = useAuthUserDetail();
  const company = getCompanyDetails();
  const companyId = useWorkspaceCompanyId();
  const countryId = company?.country?.id;
  const { mode: taxMode, config } = useTaxContext();

  const payload = useMemo(
    () =>
      buildOffboardFeesRequest({
        companyId,
        countryId,
        employeeId,
        lines,
      }),
    [companyId, countryId, employeeId, lines],
  );

  const { data, isFetching, isError } = useGetOffboardFeesQuery(
    payload as any,
    { skip: !payload },
  );

  const breakdown = useMemo(
    () =>
      extractOffboardFeeBreakdown(data?.data, lines.length, taxMode, config),
    [config, data, lines.length, taxMode],
  );

  return { breakdown, isLoading: isFetching, isError };
};
