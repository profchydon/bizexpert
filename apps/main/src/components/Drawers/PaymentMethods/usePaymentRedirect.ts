"use client";

import { useEffect, useState } from "react";
import {
  beginPaymentRedirect,
  consumeIfReturnPathMatches,
  type PaymentRedirectTab,
} from "./paymentRedirectSession";

type Args = {
  selectedCardValue?: string;
  setIsPaymentmethodOpen: (open: boolean) => void;
  setSelectedCardValue: (value: string) => void;
  setTabState: (value: PaymentRedirectTab) => void;
  tabState: PaymentRedirectTab;
};

export type PaymentRedirectAnalytics = {
  order_id?: string;
  order_flow?: string;
};

function currentCheckoutPath() {
  return `${window.location.pathname}${window.location.search}`;
}

export function usePaymentRedirect({
  selectedCardValue,
  setIsPaymentmethodOpen,
  setSelectedCardValue,
  setTabState,
  tabState,
}: Args) {
  const [isRedirecting, setIsRedirecting] = useState(false);

  useEffect(() => {
    const pending = consumeIfReturnPathMatches(currentCheckoutPath());
    if (!pending) return;
    setTabState(pending.tabState);
    if (pending.selectedCardValue) {
      setSelectedCardValue(pending.selectedCardValue);
    }
    setIsPaymentmethodOpen(true);
  }, [setIsPaymentmethodOpen, setSelectedCardValue, setTabState]);

  const beginRedirect = (
    link: string,
    analytics?: PaymentRedirectAnalytics,
  ) => {
    if (!link) return;
    setIsRedirecting(true);
    const started = beginPaymentRedirect(
      link,
      {
        returnPath: currentCheckoutPath(),
        tabState,
        selectedCardValue,
        ...(analytics?.order_id ? { order_id: analytics.order_id } : {}),
        ...(analytics?.order_flow ? { order_flow: analytics.order_flow } : {}),
      },
      (url) => window.location.assign(url),
    );
    if (!started) setIsRedirecting(false);
  };

  return { beginRedirect, isRedirecting };
}
