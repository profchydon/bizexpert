import type { EquipEmployeeFeesBody } from "@/api/baseQueries/feesApi/getEquipEmployeeFees";
import type { IEmployees } from "@/types/employees";
import type { EquipReviewEmployee } from "./equipTypes";
import { buildEquipEmployeeOrders } from "./equipEmployeeOrders";
import type { CountryOption } from "./resolveEmployeeCountryId";

interface BuildEquipEmployeeFeesPayloadArgs {
  review: EquipReviewEmployee[];
  equipEmployees: IEmployees[] | undefined;
  countries: CountryOption[];
  companyCountryId?: string;
  paymentMethod?: "Card" | "Credit";
}

export const buildEquipEmployeeFeesPayload = ({
  review,
  equipEmployees,
  countries,
  companyCountryId,
  paymentMethod = "Credit",
}: BuildEquipEmployeeFeesPayloadArgs): EquipEmployeeFeesBody | undefined => {
  if (!companyCountryId || review.length === 0) return undefined;

  const orders = buildEquipEmployeeOrders({
    review,
    equipEmployees,
    countries,
    options: { includeFulfilmentDate: true },
  });
  if (Object.keys(orders).length === 0) return undefined;

  return {
    country_id: companyCountryId,
    payment_method: paymentMethod,
    orders,
  };
};
