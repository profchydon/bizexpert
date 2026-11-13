"use client";

import { useEffect, useRef, useState } from "react";
import { companiesApi } from "@/api/baseQueries/companiesApi";
import { useTransitionRouter } from "@/hooks/useTransitionRouter";
import { useAppDispatch } from "@/store";
import {
  clearSubscriptionTxRef,
  rememberSubscriptionTxRef,
  subscriptionInstancePath,
} from "./subscriptionRedirect";

export function useSubscriptionReturn(input: {
  txRef: string | null;
  successInstance: string | null;
  errorInstance: string | null;
  verified: boolean;
  verifyError: boolean;
}) {
  const dispatch = useAppDispatch();
  const { push } = useTransitionRouter();
  const [successOpen, setSuccessOpen] = useState(
    Boolean(input.successInstance),
  );
  const handled = useRef("");

  useEffect(() => {
    setSuccessOpen(Boolean(input.successInstance));
  }, [input.successInstance]);

  useEffect(() => {
    if (input.txRef) rememberSubscriptionTxRef(input.txRef);
  }, [input.txRef]);

  useEffect(() => {
    if (
      input.successInstance ||
      input.errorInstance ||
      !input.txRef ||
      handled.current === input.txRef
    ) {
      return;
    }
    if (input.verified) {
      handled.current = input.txRef;
      dispatch(companiesApi.util.invalidateTags(["Subscription"]));
      clearSubscriptionTxRef();
      push(subscriptionInstancePath("success"));
    } else if (input.verifyError) {
      handled.current = input.txRef;
      push(subscriptionInstancePath("error", input.txRef));
    }
  }, [dispatch, input, push]);

  const closeSuccess = () => {
    setSuccessOpen(false);
    push(subscriptionInstancePath(null));
  };

  return {
    successOpen,
    closeSuccess,
    clearError: () => push(subscriptionInstancePath(null)),
  };
}
