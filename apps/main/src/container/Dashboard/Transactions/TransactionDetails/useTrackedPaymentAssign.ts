"use client";

import { useEffect, useState } from "react";

export function keepPaymentLoad(current: string | null, url: string) {
  return current ?? url;
}

export function useTrackedPaymentAssign() {
  const [payUrl, setPayUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!payUrl) return;
    globalThis.location.assign(payUrl);
  }, [payUrl]);

  const startPayment = (url: string) => {
    setPayUrl((current) => keepPaymentLoad(current, url));
  };

  return { isPaying: payUrl !== null, startPayment };
}
