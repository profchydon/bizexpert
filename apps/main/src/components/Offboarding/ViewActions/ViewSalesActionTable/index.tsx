import { FC, useEffect, useMemo } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import PageState from "@/components/PageState";
import { DataTable } from "@/components/ui/data-table";
import { Badge } from "@/components/ui/badge";
import ViewSalesActionsColumn from "./tableColumn";
import ViewSalesActions from "./tableActions";
import { Offboard_asset } from "@/types/offboarding";
import { useAppDispatch } from "@/store";
import { deleteOffboardingData } from "@/store/slices/offboardingSlice";
import { useGetEquipmentResaleValueMutation } from "@/api/baseQueries/offboardingApi/getEquipmentResaleValue";
import { getPriceRange } from "@/utils/getPriceRange";
import { useWorkspaceCompanyId } from "@/hooks/useWorkspaceCompanyId";
import formatAmount from "@/utils/formatAmount";
import { companyBillingCurrencySymbol } from "@/utils/companyBillingCurrency";
import { useAuthUserDetail } from "@/utils/useAuthUser";

interface Props {
  data: Offboard_asset[];
}
const ViewSalesActionTable: FC<Props> = ({ data }) => {
  const dispatch = useAppDispatch();
  const companyId = useWorkspaceCompanyId();
  const { getCompanyDetails } = useAuthUserDetail();
  const company = getCompanyDetails();
  const billingSymbol = companyBillingCurrencySymbol(company);

  const [
    getEquipmentResaleValue,
    { isLoading, isError, data: resaleValueData },
  ] = useGetEquipmentResaleValueMutation();

  const resaleValueDB = resaleValueData?.data ?? {};
  const resaleValueLoading =
    isLoading || Object.keys(resaleValueDB).length === 0;

  const priceRange = useMemo(() => {
    return getPriceRange(resaleValueDB as any);
  }, [resaleValueDB]);

  const equipment_ids = useMemo(() => {
    if (!data) {
      return;
    }
    return extractIds(data as any);
  }, [data]);

  useEffect(() => {
    if (data && (equipment_ids as string[])?.length > 0) {
      getEquipmentResaleValue({
        companyId: companyId as string,
        equipment_ids: equipment_ids as string[],
      });
    }
  }, [companyId, data, equipment_ids, getEquipmentResaleValue]);

  const handleRemove = (id: string) => {
    dispatch(deleteOffboardingData(id));
  };
  const columns: any = useMemo(
    () =>
      ViewSalesActionsColumn((item: Record<string, string>) => (
        <ViewSalesActions onRemove={() => handleRemove(item?.id as string)} />
      )),
    [],
  );

  function extractIds(input: any): string[] {
    if (Array.isArray(input)) {
      return input
        ?.map((item) => item?.id?.toString())
        ?.filter(Boolean) as string[];
    }
    return input?.id ? [input?.id?.toString()] : [];
  }

  return (
    <PageState
      isLoading={
        resaleValueLoading || !priceRange
          ? data && data.length < 1
            ? false
            : true
          : false
      }
      isError={isError}
    >
      <Card className="bg-primary-50 border-primary-300 flex flex-col gap-y-3 rounded-xl w-full text-gray-600 p-4">
        <p className="text-primary-700 font-semibold">{`${billingSymbol}${formatAmount((priceRange?.minimum as any) || "")} - ${billingSymbol}${formatAmount((priceRange?.maximum as any) || "")}`}</p>
        <p className="text-primary-700">
          This is the estimated price for sales
        </p>
      </Card>
      <Card className="mt-6">
        <CardHeader className="p-2 border-b border-border-secondary flex flex-row items-center gap-3">
          <p className="text-gray-900 text-lg font-semibold">Actions</p>
          <Badge variant="blue">{data?.length || 0} Action(s)</Badge>
        </CardHeader>

        <CardContent className="px-0 pt-0 pb-2">
          <>
            <DataTable
              data={data || []}
              columns={columns}
              // pagination={{
              //   currentPage: 1,
              //   lastPage: 3,
              //   onPageChange: () => null,
              // }}
            />
          </>
        </CardContent>
      </Card>
    </PageState>
  );
};

export default ViewSalesActionTable;
