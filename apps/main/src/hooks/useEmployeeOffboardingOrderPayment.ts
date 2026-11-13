import { useOffboardEmployeeActionPaymentMutation } from "@/api/baseQueries/companiesApi/transactionsApi/offboardEmployeeActionPayment";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import { showApiError } from "@/utils/showApiError";

const useEmployeeOffboardingOrderPayment = () => {
  const [offboardPayment, { error, isLoading }] =
    useOffboardEmployeeActionPaymentMutation();
  const [response, setResponse] = useState<any>(null);
  const router = useRouter();

  const initiateEmployeeOffboardingOrderPayment = useCallback(
    async (payload: any) => {
      try {
        const result = await offboardPayment(payload).unwrap();
        if (result?.success === false) {
          showApiError(result);
          return;
        }
        setResponse(result);
        if (result?.data?.link) {
          router.push(result?.data?.link);
        }
        return result;
      } catch (err) {
        showApiError(err);
      }
    },
    [offboardPayment, router],
  );

  return {
    initiateEmployeeOffboardingOrderPayment,
    response,
    error,
    isLoading,
  };
};

export default useEmployeeOffboardingOrderPayment;
