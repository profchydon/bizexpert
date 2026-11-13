import { useOffboardActionPaymentMutation } from "@/api/baseQueries/companiesApi/transactionsApi/offboardActionPayment";
import { useOrderPaymentMutation } from "@/api/baseQueries/companiesApi/transactionsApi/orderPayment";
import { TransactionRequest } from "@/types/transactions";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";

const useOffboardingOrderPayment = () => {
  const [offboardPayment, { error, isLoading }] =
    useOffboardActionPaymentMutation();
  const [response, setResponse] = useState<any>(null);
  const router = useRouter();

  const initiateOffboardingOrderPayment = useCallback(
    async (payload: any) => {
      try {
        const result = await offboardPayment(payload).unwrap();
        setResponse(result);
        //   @ts-ignore
        if (result?.data?.link) {
          //   @ts-ignore
          router.push(result?.data?.link);
        }
        return result;
      } catch (err) {
        console.error(err);
        return null;
      }
    },
    [offboardPayment, router],
  );

  return { initiateOffboardingOrderPayment, response, error, isLoading };
};

export default useOffboardingOrderPayment;
