import { useMemo } from "react";
import { useWorkspaceCompanyId } from "@/hooks/useWorkspaceCompanyId";
import { useGetOffboardFeesQuery } from "@/api/baseQueries/feesApi/getOffboardFees";
import { useTaxContext } from "@/hooks/useTaxContext";
import { useAuthUserDetail } from "@/utils/useAuthUser";
import type { OffboardReviewEmployee } from "@/types/offboard";
import {
  buildOffboardFeeOrders,
  extractOffboardFeeBreakdown,
  type OffboardFeeBreakdown,
} from "../OffboardDevices/offboardFeeBreakdown";

interface Result {
  breakdown: OffboardFeeBreakdown;
  isLoading: boolean;
  isError: boolean;
}

export const useOffboardReviewFees = (
  review: OffboardReviewEmployee[],
): Result => {
  const { getCompanyDetails } = useAuthUserDetail();
  const company = getCompanyDetails();
  const companyId = useWorkspaceCompanyId();
  const countryId = company?.country?.id;
  const { mode: taxMode, config } = useTaxContext();

  const orders = useMemo(() => buildOffboardFeeOrders(review), [review]);
  const employeeIds = useMemo(() => Object.keys(orders), [orders]);
  const deviceCount = useMemo(
    () => review.reduce((sum, employee) => sum + employee.devices.length, 0),
    [review],
  );

  const payload = useMemo(() => {
    if (!countryId || !companyId || employeeIds.length === 0) return undefined;
    return {
      companyId,
      service_type: "Offboarding" as const,
      payment_method: "Credit" as const,
      country_id: countryId,
      orders,
    };
  }, [companyId, countryId, employeeIds.length, orders]);

  const { data, isFetching, isError } = useGetOffboardFeesQuery(
    payload as any,
    { skip: !payload },
  );

  const breakdown = useMemo(
    () => extractOffboardFeeBreakdown(data?.data, deviceCount, taxMode, config),
    [config, data, deviceCount, taxMode],
  );

  return { breakdown, isLoading: isFetching, isError };
};
