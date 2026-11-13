"use client";

import { useEffect, useRef } from "react";
import { useTransitionRouter } from "@/hooks/useTransitionRouter";
import { useStorageServerCart } from "../hooks/useStorageServerCart";
import { setStorageUnifiedOrder } from "../hooks/useStorageUnifiedOrder";
import { storageAppRoutes } from "../storageAppRoutes";
import { clearStorageActionsCart } from "../hooks/useStorageCartActions";

export default function StorageCheckoutPage() {
  const { replace } = useTransitionRouter();
  const { items, isLoading } = useStorageServerCart();
  const forwardedRef = useRef(false);

  useEffect(() => {
    if (isLoading) return;
    if (forwardedRef.current) return;
    forwardedRef.current = true;

    if (items.length > 0) {
      setStorageUnifiedOrder({
        id: `UO-${Date.now().toString(36).toUpperCase()}`,
        createdAt: new Date().toISOString(),
        actionItems: items,
      });
      void clearStorageActionsCart(items);
      replace(storageAppRoutes.storageUnifiedCheckout);
      return;
    }

    replace(storageAppRoutes.storage);
  }, [replace, items, isLoading]);

  return null;
}
