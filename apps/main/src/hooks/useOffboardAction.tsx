import { useWorkspaceCompanyId } from "@/hooks/useWorkspaceCompanyId";
import { useGetOffboardFeesQuery } from "@/api/baseQueries/feesApi/getOffboardFees";
import { useAppSelector } from "@/store";
import { useAuthUserDetail } from "@/utils/useAuthUser";

function calculateTotalEquipment(data: any) {
  let totalEquipment = 0;

  Object.keys(data).forEach((key) => {
    data[key].equipment?.forEach((equipment: any) => {
      totalEquipment += equipment.quantity;
    });
  });

  return totalEquipment;
}

const useOffboardAction = () => {
  const { getCompanyDetails } = useAuthUserDetail();
  const { offboardActionsData, actionType } = useAppSelector(
    (state) => state.persistedReducers.offBoardAction,
  );
  const employeeId = offboardActionsData?.[0]?.employeeData?.id!;

  const company = getCompanyDetails();
  const companyId = useWorkspaceCompanyId();
  const equipments = offboardActionsData?.map((item) => ({
    equipment_id: item.equipmentDetail.id!,
    quantity: 1,
    reassign: actionType === "transfer" ? true : undefined,
    storage: actionType === "store" ? true : undefined,
    resale: actionType === "sell" ? true : undefined,
  }));
  const payload = companyId
    ? ({
        companyId,
        country_id: company?.country?.id!,
        service_type: "Offboarding",
        orders: {
          [employeeId]: {
            equipment: equipments!,
          },
        },
      } as const)
    : undefined;

  const {
    data: feesRes,
    isLoading,
    isError,
  } = useGetOffboardFeesQuery(payload!, {
    skip: !offboardActionsData || !payload,
  });

  const employeeFees = feesRes?.data?.[employeeId]?.fees;
  const totalFeesSummary = feesRes?.data?.fee_summary;
  const data = feesRes?.data;

  let additionalFee = [] as { name: string; value: string }[];
  let feeSummary = [] as { name: string; value: string }[];
  let totalItems = 0 as number;

  if (data) {
    const fees = Object.entries(employeeFees?.additional_fee!).map(
      ([name, value]) => ({
        value: value.toString(),
        name: name
          .replace(/_/g, " ")
          .replace(/\b\w/g, (char) => char.toUpperCase()),
      }),
    );
    additionalFee = fees;

    const formattedFees = Object.entries(totalFeesSummary!)
      .filter(([key, value]) => key !== "total_fee" && key !== "currency") // Exclude total_fee and currency
      .map(([name, value]) => ({
        value: value.toString(),
        name: name
          .replace(/_/g, " ")
          .replace(/\b\w/g, (char) => char.toUpperCase()),
      }));
    feeSummary = formattedFees;

    const totalEquipment = calculateTotalEquipment(data);
    totalItems = totalEquipment;
  }

  return {
    isLoading,
    isError,

    data,
    additionalFee,
    additionalTotal: employeeFees?.total_fee,
    plan: employeeFees?.plan,

    totalFeesSummary,
    feeSummary,

    totalItems,
  };
};

export default useOffboardAction;
