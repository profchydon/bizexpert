import { clearCartApi } from "@/api/baseQueries/cartApi/clearCart";
import { getCartSessionAuth } from "@/api/baseQueries/cartApi/getCartSessionAuth";
import { reduxStore } from "@/store";
import { omitWorkspaceStorageCartLines } from "./omitWorkspaceStorageCartLines";
import { clearCheckout } from "./useStorageCheckout";

export async function clearAllStorageCart() {
  const { userId, companyId } = getCartSessionAuth();
  if (userId && companyId) {
    await reduxStore
      .dispatch(
        clearCartApi.endpoints.clearCart.initiate({
          companyId,
          userId,
        }),
      )
      .unwrap();
  }

  clearCheckout();
  omitWorkspaceStorageCartLines();
}
