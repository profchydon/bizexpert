import { emitCartItemAdded } from "@/hooks/cartEvents";
import { prefetchStorageServiceFees } from "../utils/prefetchStorageServiceFees";
import { omitWorkspaceStorageCartLines } from "./omitWorkspaceStorageCartLines";
import { postStorageCartItems } from "./postStorageCartItems";
import {
  clearCheckout,
  removeCheckoutItem,
  type CheckoutItem,
} from "./useStorageCheckout";
import { deleteCartItemApi } from "@/api/baseQueries/cartApi/deleteCartItem";
import { getCartSessionAuth } from "@/api/baseQueries/cartApi/getCartSessionAuth";
import {
  getCartsApi,
  marketplaceItemsFromCartResponse,
} from "@/api/baseQueries/cartApi/getCarts";
import { addToCartApi } from "@/api/baseQueries/cartApi/addToCart";
import { toMarketplaceCartWriteItems } from "@/api/baseQueries/cartApi/toMarketplaceCartWriteItems";
import { reduxStore } from "@/store";

export async function addCartActions(items: CheckoutItem[]) {
  if (items.length > 0) await postStorageCartItems(items);
  void prefetchStorageServiceFees();
  emitCartItemAdded();
}

export function clearLocalStorageDeployments() {
  clearCheckout();
}

export async function clearStorageActionsCart(
  actionItems?: CheckoutItem[],
  clearServer = true,
) {
  clearCheckout();
  omitWorkspaceStorageCartLines();

  if (!clearServer) return;

  const { userId, companyId } = getCartSessionAuth();
  if (userId && companyId) {
    try {
      const state = reduxStore.getState();
      const currentCart = getCartsApi.endpoints.getCarts.select({
        companyId,
        userId,
      })(state);
      const marketplaceItems = marketplaceItemsFromCartResponse(
        currentCart?.data?.data,
      );
      const writeItems = toMarketplaceCartWriteItems(marketplaceItems);

      await reduxStore
        .dispatch(
          addToCartApi.endpoints.addToCart.initiate({
            companyId,
            userId,
            items: writeItems,
          }),
        )
        .unwrap();
    } catch (error) {
      console.error("Failed to clear storage actions from cart", error);
    }
  }
}

export async function removeStorageCartAction(id: string) {
  removeCheckoutItem(id);
  omitWorkspaceStorageCartLines(id);

  const { userId, companyId } = getCartSessionAuth();
  if (userId && companyId && id) {
    try {
      await reduxStore
        .dispatch(
          deleteCartItemApi.endpoints.deleteCartItem.initiate({
            companyId,
            userId,
            itemId: id,
          }),
        )
        .unwrap();
    } catch (error) {
      console.error("Failed to delete cart item", error);
    }
  }
}
