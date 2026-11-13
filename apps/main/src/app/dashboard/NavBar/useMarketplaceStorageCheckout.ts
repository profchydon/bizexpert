"use client";

import { useAppDispatch } from "@/store";
import {
  setBuyToStorageItems,
  clearDeviceRefreshFlowState,
} from "@/store/slices/equipEmployeeSlice";
import { setSelectedEmployees } from "@/store/slices/employeeSlice";
import { UNASSIGNED_ORDER_SUMMARY_KEY } from "@/utils/getInitials";
import { IEmployees } from "@/types/employees";
import routes from "@/routes";
import { useTransitionRouter } from "@/hooks/useTransitionRouter";
import withFallbackCountry from "@/container/Dashboard/EquipEmployee/AssignmentFlow/withFallbackCountry";
import { ICart } from "@/types/cart";

type CartCountry = {
  code?: string;
  name?: string;
};

export function useMarketplaceStorageCheckout() {
  const { push, isPending } = useTransitionRouter();
  const dispatch = useAppDispatch();

  const confirmBuyToStorage = async (
    carts: ICart[],
    country: CartCountry | null | undefined,
    removeAllProductsFromCart: () => Promise<void>,
    onClose: () => void,
  ) => {
    dispatch(clearDeviceRefreshFlowState());
    const cartsWithCountry = withFallbackCountry(carts, {
      code: country?.code?.toUpperCase(),
      name: country?.name,
    });
    const storageItems = cartsWithCountry.map((item) => ({
      ...item,
      storage: true,
    }));
    dispatch(setBuyToStorageItems(storageItems));
    dispatch(
      setSelectedEmployees([
        {
          id: UNASSIGNED_ORDER_SUMMARY_KEY,
          items: storageItems,
        } as unknown as IEmployees,
      ]),
    );
    await removeAllProductsFromCart();
    onClose();
    push(routes.EQUIP_EMPLOYEE_ORDER_SUMMARY);
  };

  return { confirmBuyToStorage, isPending };
}
