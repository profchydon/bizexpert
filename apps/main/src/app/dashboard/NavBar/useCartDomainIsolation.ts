"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import useCart from "@/hooks/useCart";
import { useStorageServerCart } from "@/container/Dashboard/Storage/Remote/hooks/useStorageServerCart";
import { clearStorageActionsCart } from "@/container/Dashboard/Storage/Remote/hooks/useStorageCartActions";
import {
  resolveCartDomain,
  shouldClearMarketplaceCart,
  shouldClearStorageCart,
  type CartDomain,
} from "./cartDomain";

export function useCartDomainIsolation() {
  const pathname = usePathname();
  const { carts, removeAllItemsFromCart } = useCart();
  const { items: storageCartItems } = useStorageServerCart();
  const previousDomainRef = useRef<CartDomain | null>(null);

  useEffect(() => {
    const nextDomain = resolveCartDomain(pathname);
    const previousDomain = previousDomainRef.current;

    if (
      shouldClearMarketplaceCart(previousDomain, nextDomain) &&
      carts.length > 0
    ) {
      void removeAllItemsFromCart();
    }

    if (
      shouldClearStorageCart(previousDomain, nextDomain) &&
      storageCartItems.length > 0
    ) {
      void clearStorageActionsCart(storageCartItems, true);
    }

    previousDomainRef.current = nextDomain;
  }, [carts.length, pathname, removeAllItemsFromCart, storageCartItems]);
}
