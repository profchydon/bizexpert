"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useLazyGetTransactionsQuery } from "@/api/baseQueries/companiesApi/transactionsApi/getTransactions";
import routes from "@/routes";

type Args = {
  companyId?: string;
  page: number;
  perPage: number;
  selectedType: "Credit" | "Cash" | null;
};

export function useTransactionPaymentModals({
  companyId,
  page,
  perPage,
  selectedType,
}: Args) {
  const router = useRouter();
  const [clinkToGetTransactions] = useLazyGetTransactionsQuery();
  const [isPaymentSuccessOpen, setIsPaymentSuccessOpen] = useState(false);

  const refetchThenGoToTransactions = async (closeSuccess: boolean) => {
    await clinkToGetTransactions({
      companyId: companyId!,
      params: {
        type: selectedType,
        page,
        per_page: perPage,
      },
    }).unwrap();
    if (closeSuccess) setIsPaymentSuccessOpen(false);
    router.push(routes.TRANSACTIONS);
  };

  return {
    handleClosePaymentErrorModal: () => refetchThenGoToTransactions(false),
    handleClosePaymentSuccessModal: () => refetchThenGoToTransactions(true),
    handleGotoOrder: () => refetchThenGoToTransactions(true),
    isPaymentSuccessOpen,
    setIsPaymentSuccessOpen,
  };
}
