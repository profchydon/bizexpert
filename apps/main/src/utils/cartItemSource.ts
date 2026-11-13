import { ICart } from "@/types/cart";

export const isRfqCartItem = (item: ICart) =>
  item.source?.toLowerCase() === "rfq" ||
  (item.specification as { source?: string | null })?.source?.toLowerCase() ===
    "rfq";

export const hasRfqCartItems = (items: ICart[]) => items.some(isRfqCartItem);

const amountValue = (value?: string | number | null) => Number(value ?? 0);

export const cartItemUnitAmount = (item: ICart) =>
  amountValue(item.pricing?.amount || item.amount);

export const cartItemTotalAmount = (item: ICart) =>
  isRfqCartItem(item)
    ? amountValue(item.amount)
    : amountValue(item.pricing?.amount || item.amount) * item.quantity;
