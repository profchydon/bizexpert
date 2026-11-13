"use client";

import { useEffect, useRef } from "react";

import { shouldClearCartForCheckout } from "@/hooks/clearCartAfterCheckout";
import useCart from "@/hooks/useCart";

type UseClearCartAfterCheckoutArgs = {
  enabled: boolean;
  transactionId?: string | null;
};

export function useClearCartAfterCheckout({
  enabled,
  transactionId,
}: UseClearCartAfterCheckoutArgs) {
  const { removeAllItemsFromCart } = useCart();
  const clearedForTransactionRef = useRef<string | null>(null);

  useEffect(() => {
    if (
      !shouldClearCartForCheckout({
        enabled,
        transactionId,
        clearedForTransactionId: clearedForTransactionRef.current,
      })
    ) {
      return;
    }

    clearedForTransactionRef.current = transactionId ?? null;

    void removeAllItemsFromCart();
  }, [enabled, removeAllItemsFromCart, transactionId]);
}
