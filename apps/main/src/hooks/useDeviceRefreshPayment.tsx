import { useDeviceRefreshPaymentMutation } from "@/api/baseQueries/companiesApi/transactionsApi/deviceRefreshPayment";
import { useTransitionRouter } from "@/hooks/useTransitionRouter";
import { useCallback, useState } from "react";

const useDeviceRefreshPayment = () => {
  const [deviceRefreshPayment, { error, isLoading }] =
    useDeviceRefreshPaymentMutation();
  const [response, setResponse] = useState<any>(null);
  const { push } = useTransitionRouter();

  const initiateDeviceRefreshPayment = useCallback(
    async (payload: any) => {
      try {
        const result = await deviceRefreshPayment(payload).unwrap();
        setResponse(result);
        //   @ts-ignore
        if (result?.data?.link) {
          //   @ts-ignore
          push(result?.data?.link);
        }
      } catch (err) {
        console.error(err);
      }
    },
    [deviceRefreshPayment, push],
  );

  return { initiateDeviceRefreshPayment, response, error, isLoading };
};

export default useDeviceRefreshPayment;
