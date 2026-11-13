import type { ICart } from "@/types/cart";

export const canClearCartItems = (items: ICart[]) => items.length > 0;

export const canRemoveCartItem = (_item: ICart) => true;
