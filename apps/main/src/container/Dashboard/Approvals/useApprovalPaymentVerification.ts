"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { useVerifyOrderPaymentQuery } from "@/api/baseQueries/companiesApi/transactionsApi/verifyOrderPayment";
import { useWorkspaceCompanyId } from "@/hooks/useWorkspaceCompanyId";
import {
  approvalPaymentResultUrl,
  approvalRequestIdFromUrl,
  approvalRequestUrl,
} from "./approvalUrl";

export function useApprovalPaymentVerification() {
  const companyId = useWorkspaceCompanyId();
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const catalogId = searchParams.get("catalogId");
  const requestId = approvalRequestIdFromUrl(searchParams.get("requestId"));
  const txRef = searchParams.get("tx_ref");
  const showSuccess = searchParams.get("success_instance") === "true";
  const showError = searchParams.get("error_instance") === "true";
  const [shouldVerify, setShouldVerify] = useState(false);
  const [isPromptOpen, setIsPromptOpen] = useState(Boolean(txRef));
  const [isResultDismissed, setIsResultDismissed] = useState(false);
  const verifyQuery = useVerifyOrderPaymentQuery(
    { companyId, tx_ref: txRef ?? undefined },
    { skip: !companyId || !txRef || !shouldVerify },
  );

  useEffect(() => {
    setIsPromptOpen(Boolean(txRef && !showSuccess && !showError));
    setShouldVerify(false);
    setIsResultDismissed(false);
  }, [txRef]);

  useEffect(() => {
    if (!verifyQuery.data) return;
    router.replace(
      approvalPaymentResultUrl({
        catalogId,
        isSuccess: true,
        pathname,
        requestId,
      }),
    );
  }, [catalogId, pathname, requestId, router, verifyQuery.data]);

  useEffect(() => {
    if (!verifyQuery.isError) return;
    router.replace(
      approvalPaymentResultUrl({
        catalogId,
        isSuccess: false,
        pathname,
        requestId,
      }),
    );
  }, [catalogId, pathname, requestId, router, verifyQuery.isError]);

  return {
    closeResult() {
      setIsResultDismissed(true);
      const cleanUrl = approvalRequestUrl({ pathname, requestId });
      globalThis.history.replaceState(null, "", cleanUrl);
      router.replace(cleanUrl, { scroll: false });
    },
    closePrompt() {
      setIsPromptOpen(false);
    },
    isErrorOpen: showError && !isResultDismissed,
    isPromptOpen,
    isSuccessOpen: showSuccess && !isResultDismissed,
    isVerifying: verifyQuery.isLoading || verifyQuery.isFetching,
    requestId,
    startVerification() {
      setShouldVerify(true);
    },
  };
}
