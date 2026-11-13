import { useEffect, useMemo } from "react";
import { useWorkspaceCompanyId } from "@/hooks/useWorkspaceCompanyId";
import { useGetOffboardFeesQuery } from "@/api/baseQueries/feesApi/getOffboardFees";
import { useAuthUserDetail } from "@/utils/useAuthUser";
import type { DeviceLine } from "@/types/offboard";
import {
  buildOffboardFeesRequest,
  extractEmployeeServiceFee,
} from "./offboardFeeBreakdown";

interface Args {
  employeeId: string;
  line: DeviceLine;
  onFee?: (lineId: string, fee: number) => void;
}

export const useOffboardLineFee = ({ employeeId, line, onFee }: Args) => {
  const { getCompanyDetails } = useAuthUserDetail();
  const companyId = useWorkspaceCompanyId();
  const countryId = getCompanyDetails()?.country?.id;

  const payload = useMemo(
    () =>
      buildOffboardFeesRequest({
        companyId,
        countryId,
        employeeId,
        lines: [line],
      }),
    [companyId, countryId, employeeId, line],
  );

  const { data, isFetching } = useGetOffboardFeesQuery(payload as never, {
    skip: !payload,
  });
  const amount = extractEmployeeServiceFee(data?.data, employeeId);

  useEffect(() => {
    if (amount == null || amount === line.fee) return;
    onFee?.(line.id, amount);
  }, [amount, line.fee, line.id, onFee]);

  return { amount, isLoading: isFetching && amount == null };
};
