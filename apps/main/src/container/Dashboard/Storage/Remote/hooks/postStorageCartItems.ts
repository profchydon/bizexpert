import { reduxStore } from "@/store";
import { addToCartApi } from "@/api/baseQueries/cartApi/addToCart";
import { getCartsApi } from "@/api/baseQueries/cartApi/getCarts";
import { getCartSessionAuth } from "@/api/baseQueries/cartApi/getCartSessionAuth";
import { storageCartItemsToPost } from "@/api/baseQueries/cartApi/storageCartItemsToPost";
import { toStorageCartWriteItems } from "@/api/baseQueries/cartApi/toStorageCartWriteItems";
import type { CheckoutItem } from "../hooks/useStorageCheckout";

export async function postStorageCartItems(items: CheckoutItem[]) {
  const { userId, companyId } = getCartSessionAuth();
  if (!userId || !companyId) return;

  const writeItems = toStorageCartWriteItems(items, companyId);
  if (writeItems.length === 0) return;

  const cart = await reduxStore
    .dispatch(getCartsApi.endpoints.getCarts.initiate({ companyId, userId }))
    .unwrap();
  const toPost = storageCartItemsToPost(writeItems, cart?.data);
  if (toPost.length === 0) return;

  await reduxStore
    .dispatch(
      addToCartApi.endpoints.addToCart.initiate({
        companyId,
        userId,
        items: toPost,
      }),
    )
    .unwrap();
}
