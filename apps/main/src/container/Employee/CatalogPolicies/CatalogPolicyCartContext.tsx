"use client";

import {
  createContext,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
  useContext,
  useMemo,
  useState,
} from "react";
import {
  getPolicyCartCount,
  type PolicyDisplayItem,
  type PolicyCart,
} from "./CatalogPolicyDetail/utils";

type CatalogPolicyCartContextValue = {
  cart: PolicyCart;
  cartDisabled: boolean;
  isCartOpen: boolean;
  setCart: Dispatch<SetStateAction<PolicyCart>>;
  setCartDisabled: Dispatch<SetStateAction<boolean>>;
  setCartOpen: Dispatch<SetStateAction<boolean>>;
  items: PolicyDisplayItem[];
  setItems: Dispatch<SetStateAction<PolicyDisplayItem[]>>;
  totalItems: number;
};

const noopSetCart: Dispatch<SetStateAction<PolicyCart>> = () => undefined;
const noopSetCartDisabled: Dispatch<SetStateAction<boolean>> = () => undefined;
const noopSetCartOpen: Dispatch<SetStateAction<boolean>> = () => undefined;
const noopSetItems: Dispatch<SetStateAction<PolicyDisplayItem[]>> = () =>
  undefined;

const CatalogPolicyCartContext = createContext<CatalogPolicyCartContextValue>({
  cart: {},
  cartDisabled: false,
  isCartOpen: false,
  setCart: noopSetCart,
  setCartDisabled: noopSetCartDisabled,
  setCartOpen: noopSetCartOpen,
  items: [],
  setItems: noopSetItems,
  totalItems: 0,
});

export const CatalogPolicyCartProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [cart, setCart] = useState<PolicyCart>({});
  const [cartDisabled, setCartDisabled] = useState(false);
  const [isCartOpen, setCartOpen] = useState(false);
  const [items, setItems] = useState<PolicyDisplayItem[]>([]);
  const totalItems = getPolicyCartCount(cart);
  const value = useMemo(
    () => ({
      cart,
      cartDisabled,
      isCartOpen,
      setCart,
      setCartDisabled,
      setCartOpen,
      items,
      setItems,
      totalItems,
    }),
    [cart, cartDisabled, isCartOpen, items, totalItems],
  );

  return (
    <CatalogPolicyCartContext.Provider value={value}>
      {children}
    </CatalogPolicyCartContext.Provider>
  );
};

export const useCatalogPolicyCart = () => useContext(CatalogPolicyCartContext);
