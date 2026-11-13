"use client";

import { usePathname } from "next/navigation";
import useCart from "@/hooks/useCart";
import { isolateCartItems } from "@/app/dashboard/NavBar/isolateCartItems";
import { resolveCartDomain } from "@/app/dashboard/NavBar/cartDomain";
import { useStorageServerCart } from "./useStorageServerCart";
import { removeStorageCartAction } from "./useStorageCartActions";

export {
  addCartActions,
  clearLocalStorageDeployments,
  clearStorageActionsCart,
  removeStorageCartAction,
} from "./useStorageCartActions";

export function useUnifiedCart() {
  const pathname = usePathname();
  const domain = resolveCartDomain(pathname);
  const {
    carts: marketplaceItems,
    updateQty,
    removeItemFromCart,
    removeAllItemsFromCart,
  } = useCart();
  const { items: serverActions } = useStorageServerCart();
  const isolated = isolateCartItems(domain, marketplaceItems, serverActions);

  const removeAction = async (id: string) => {
    await removeStorageCartAction(id);
  };

  return {
    productItems: isolated.products,
    actionItems: isolated.actions,
    productCount: isolated.products.reduce(
      (sum, item) => sum + Number(item.quantity),
      0,
    ),
    actionCount: isolated.actions.length,
    totalCount:
      isolated.products.reduce((sum, item) => sum + Number(item.quantity), 0) +
      isolated.actions.length,
    updateQuantity: updateQty,
    removeFromCart: removeItemFromCart,
    removeAction,
    removeAllProductsFromCart: removeAllItemsFromCart,
  };
}
