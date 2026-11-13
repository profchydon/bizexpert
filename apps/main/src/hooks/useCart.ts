"use client";

import { useMemo } from "react";
import { useWorkspaceCompanyId } from "@/hooks/useWorkspaceCompanyId";
import {
  marketplaceItemsFromCartResponse,
  useGetCartsQuery,
} from "@/api/baseQueries/cartApi/getCarts";
import { toMarketplaceCartWriteItems } from "@/api/baseQueries/cartApi/toMarketplaceCartWriteItems";
import { IAsset } from "@/types/assets";
import { useAuthUserDetail } from "../utils/useAuthUser";
import { useAddToCartMutation } from "@/api/baseQueries/cartApi/addToCart";
import { emitCartItemAdded } from "./cartEvents";
import { useAppSelector } from "@/store";
import {
  clearCartCountryMap,
  removeCartCountryForPricing,
  setCartCountryForPricing,
} from "./cartCountryMemory";
import { cartItemTotalAmount } from "@/utils/cartItemSource";
import { clearLocalStorageDeployments } from "@/container/Dashboard/Storage/Remote/hooks/useStorageCartActions";

interface AddToCartPayload {
  asset: IAsset;
  pricingId: string;
}

const useCart = () => {
  const { getUserDetails } = useAuthUserDetail();
  const user = getUserDetails();
  const companyId = useWorkspaceCompanyId();
  const selectedCountry = useAppSelector(
    (state) => state.persistedReducers.equipEmployee.country,
  );

  const [addToCart, addToCartProps] = useAddToCartMutation();
  const isAddToCartLoading = addToCartProps.isLoading;
  const isAddToCartSuccess = addToCartProps.isSuccess;

  const skipCartQuery = !companyId || !user?.id;
  const { data: cartsRes, isLoading: isCartsLoading } = useGetCartsQuery(
    { companyId: companyId!, userId: user?.id! },
    { skip: skipCartQuery },
  );
  const carts = useMemo(
    () => marketplaceItemsFromCartResponse(cartsRes?.data),
    [cartsRes?.data],
  );
  const savings = cartsRes?.savings;

  const totalEquipment = carts?.reduce((sum, item) => sum + item.quantity, 0);

  const totalAmount = carts.reduce(
    (prev, curr) => prev + cartItemTotalAmount(curr),
    0,
  );

  const cartRequestArgs = () => {
    if (!companyId || !user?.id) return null;
    return { companyId, userId: user.id };
  };

  const handleAddToCart = async (payload: AddToCartPayload) => {
    const args = cartRequestArgs();
    if (!args) return;

    const itemExist = carts.some(
      (item) => item.pricing.id === payload.pricingId,
    );

    if (itemExist) {
      return;
    }

    const items = [
      ...toMarketplaceCartWriteItems(carts),
      { quantity: 1, asset_pricing_id: payload.pricingId },
    ];

    await addToCart({ ...args, items })
      .unwrap()
      .then(() => {
        if (selectedCountry?.name) {
          const selectedCountryWithEta =
            selectedCountry as typeof selectedCountry & {
              eta?: string;
            };

          setCartCountryForPricing(payload.pricingId, {
            code: (selectedCountry.code || "").toUpperCase(),
            label: selectedCountry.name,
            eta: selectedCountryWithEta?.eta,
          });
        }
        clearLocalStorageDeployments();
        emitCartItemAdded();
      });
  };

  const incrementItem = async (pricingId: string) => {
    const args = cartRequestArgs();
    if (!args) return;

    const items = toMarketplaceCartWriteItems(
      carts.map((item) =>
        item.pricing.id === pricingId
          ? { ...item, quantity: Number(item.quantity) + 1 }
          : item,
      ),
    );

    await addToCart({ ...args, items });
    clearLocalStorageDeployments();
  };

  const updateQty = async (pricingId: string, qty: number) => {
    const args = cartRequestArgs();
    if (!args) return;

    const items = toMarketplaceCartWriteItems(
      carts.map((item) =>
        item.pricing.id === pricingId
          ? { ...item, quantity: Number(qty) }
          : item,
      ),
    );

    await addToCart({ ...args, items });
    clearLocalStorageDeployments();
  };

  const decrementItem = async (pricingId: string) => {
    const args = cartRequestArgs();
    if (!args) return;

    const items = toMarketplaceCartWriteItems(
      carts.map((item) =>
        item.pricing.id === pricingId && Number(item.quantity) > 1
          ? { ...item, quantity: Number(item.quantity) - 1 }
          : item,
      ),
    );

    await addToCart({ ...args, items });
    clearLocalStorageDeployments();
  };

  const removeItemFromCart = async (pricingId: string) => {
    const args = cartRequestArgs();
    if (!args) return;

    const items = toMarketplaceCartWriteItems(
      carts.filter((item) => item.pricing.id !== pricingId),
    );

    await addToCart({ ...args, items });
    removeCartCountryForPricing(pricingId);
  };

  const removeAllItemsFromCart = async () => {
    const args = cartRequestArgs();
    if (!args) return;

    await addToCart({ ...args, items: [] });
    clearCartCountryMap();
  };

  return {
    handleAddToCart,
    decrementItem,
    incrementItem,
    updateQty,
    removeItemFromCart,
    removeAllItemsFromCart,
    carts,
    savings,
    isCartsLoading,
    isAddToCartLoading,
    isAddToCartSuccess,
    totalEquipment,
    totalAmount,
  };
};

export default useCart;
