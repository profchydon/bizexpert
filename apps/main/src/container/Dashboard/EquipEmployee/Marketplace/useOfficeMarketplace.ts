import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useWorkspaceCompanyId } from "@/hooks/useWorkspaceCompanyId";
import { useGetOfficeQuery } from "@/api/baseQueries/companiesApi/officesApi/getOffice";
import { toUiOfficeFromDetail } from "@/container/Dashboard/Accounts/Offices/utils/mapServerOffice";
import {
  readOfficePreseed,
  setOfficePreseed,
} from "../AssignmentFlow/officePreseed";

export function useOfficeMarketplace() {
  const params = useSearchParams();
  const companyId = useWorkspaceCompanyId();
  const officeId = params.get("office") || readOfficePreseed();
  const { data } = useGetOfficeQuery(
    { companyId: companyId as string, officeId: officeId as string },
    { skip: !companyId || !officeId },
  );
  const office = data?.data ? toUiOfficeFromDetail(data.data) : undefined;

  useEffect(() => {
    if (officeId) setOfficePreseed(officeId);
  }, [officeId]);

  return { officeId, office };
}
