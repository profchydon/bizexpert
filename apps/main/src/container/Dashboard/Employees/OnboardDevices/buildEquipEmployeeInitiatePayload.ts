import type { EquipEmployeeInitiateReq } from "@/api/baseQueries/companiesApi/transactionsApi/equipEmployeePayment";
import type { IEmployees } from "@/types/employees";
import type { EquipReviewEmployee } from "./equipTypes";
import { buildEquipEmployeeOrders } from "./equipEmployeeOrders";
import type { CountryOption } from "./resolveEmployeeCountryId";

interface BuildEquipEmployeeInitiatePayloadArgs {
  review: EquipReviewEmployee[] | undefined;
  equipEmployees: IEmployees[] | undefined;
  countries: CountryOption[];
  companyCountryId?: string;
  paymentMethod: "Card" | "Bank" | "Credit";
  redirectUrl?: string;
  additionalRecipients?: string[];
  isSignatureRequired?: boolean;
  note?: string;
}

export const buildEquipEmployeeInitiatePayload = ({
  review,
  equipEmployees,
  countries,
  companyCountryId,
  paymentMethod,
  redirectUrl,
  additionalRecipients,
  isSignatureRequired = false,
  note,
}: BuildEquipEmployeeInitiatePayloadArgs):
  | EquipEmployeeInitiateReq
  | undefined => {
  if (!companyCountryId || !redirectUrl || (review?.length ?? 0) === 0) {
    return undefined;
  }

  const orders = buildEquipEmployeeOrders({
    review: review!,
    equipEmployees,
    countries,
    options: {
      includeDeviceSetup: true,
      includeFulfilmentDate: true,
      signatureRequested: isSignatureRequired,
      note,
    },
  });
  if (Object.keys(orders).length === 0) return undefined;

  return {
    payment_method: paymentMethod,
    country_id: companyCountryId,
    redirect_url: redirectUrl,
    orders,
    ...(additionalRecipients && additionalRecipients.length > 0
      ? { additional_recipients: additionalRecipients }
      : {}),
    ...(note ? { order_note: note } : {}),
  };
};
