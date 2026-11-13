import { companyBillingCurrencySymbol } from "@/utils/companyBillingCurrency";
import { useAuthUserDetail } from "@/utils/useAuthUser";
import { formatFeeAmount } from "./offboardFeeBreakdown";

export const useServiceFeeFormat = () => {
  const { getCompanyDetails } = useAuthUserDetail();
  const symbol = companyBillingCurrencySymbol(getCompanyDetails());

  return (amount: number) => formatFeeAmount(amount, symbol);
};
