import type { IKitItem, IKitItemSummary } from "@/types/kit";
import type { EmployeeCatalogPolicyOrderRequestPayload } from "@/types/employees";

type DataList<T> = { data?: T[] | null } | T[] | null | undefined;

export type PolicyKit = {
  id: string;
  name?: string | null;
  items_count?: number | null;
  items?: DataList<IKitItem>;
  items_summary?: IKitItemSummary[] | null;
};

export type PolicyDisplayItem = {
  id: string;
  name: string;
  categoryId?: string | null;
  category?: string | null;
  image?: string | null;
  quantity: number;
  specs?: string;
  kitName?: string | null;
  required?: boolean;
  selectionGroupKey?: string;
  selectionGroupMax?: number | null;
};

export type PolicyCart = Record<string, number>;
export type RequirementFilter = "all" | "required" | "optional";

export const titleCase = (value?: string | null) =>
  value ? value.charAt(0).toUpperCase() + value.slice(1) : "Not available";

const listData = <T>(source: DataList<T>): T[] => {
  if (Array.isArray(source)) return source;
  return source?.data ?? [];
};

const specText = (spec: unknown) => {
  if (!spec || typeof spec !== "object") return "";
  if (Array.isArray(spec)) {
    return spec
      .map((item) =>
        item && typeof item === "object" && "value" in item
          ? String(item.value)
          : String(item),
      )
      .filter(Boolean)
      .join(" ");
  }

  return Object.values(spec as Record<string, unknown>)
    .filter((value) => value !== null && value !== undefined)
    .map(String)
    .join(" ");
};

const kitItemToDisplayItem = (
  item: IKitItem,
  kit: PolicyKit,
): PolicyDisplayItem => {
  const spec = item.asset_specification ?? {};
  const category = spec.category;

  return {
    id: item.id,
    name: spec.name ?? "Kit item",
    categoryId:
      typeof spec.category_id === "string" ? spec.category_id : undefined,
    category,
    image: spec.images?.[0],
    quantity: item.quantity,
    specs: specText(spec.spec),
    kitName: kit.name,
    required: item.required,
  };
};

const summaryToDisplayItem = (
  item: IKitItemSummary,
  kit: PolicyKit,
  index: number,
): PolicyDisplayItem => ({
  id: `${kit.id}-${index}`,
  name: item.name ?? "Kit item",
  image: item.images[0],
  quantity: item.quantity,
  kitName: kit.name,
});

export const getPolicyItems = (kits: PolicyKit[]) =>
  kits.flatMap((kit) => {
    const items = listData<IKitItem>(kit.items);
    if (items.length)
      return items.map((item) => kitItemToDisplayItem(item, kit));

    return (kit.items_summary ?? []).map((item, index) =>
      summaryToDisplayItem(item, kit, index),
    );
  });

export const filterPolicyItemsByRequirement = (
  items: PolicyDisplayItem[],
  filter: RequirementFilter,
) => {
  if (filter === "required") return items.filter((item) => item.required);
  if (filter === "optional") return items.filter((item) => !item.required);
  return items;
};

export const addPolicyCartItem = (
  cart: PolicyCart,
  itemId: string,
  availableQuantity: number,
): PolicyCart => {
  const currentQuantity = cart[itemId] ?? 0;
  const nextQuantity = Math.min(currentQuantity + 1, availableQuantity);

  if (nextQuantity <= 0) return cart;
  return { ...cart, [itemId]: nextQuantity };
};

export const reducePolicyCartItem = (
  cart: PolicyCart,
  itemId: string,
): PolicyCart => {
  const nextQuantity = (cart[itemId] ?? 0) - 1;

  if (nextQuantity <= 0) {
    const { [itemId]: _removed, ...rest } = cart;
    return rest;
  }

  return { ...cart, [itemId]: nextQuantity };
};

export const getPolicyCartCount = (cart: PolicyCart) =>
  Object.values(cart).reduce((sum, quantity) => sum + quantity, 0);

export const prunePolicyCart = (
  cart: PolicyCart,
  items: PolicyDisplayItem[],
): PolicyCart => {
  const availableById = new Map(items.map((item) => [item.id, item.quantity]));

  return Object.entries(cart).reduce<PolicyCart>((nextCart, [itemId, qty]) => {
    const availableQuantity = availableById.get(itemId) ?? 0;
    const quantity = Math.min(qty, availableQuantity);

    if (quantity > 0) nextCart[itemId] = quantity;
    return nextCart;
  }, {});
};

export const syncRequiredPolicyCart = (
  cart: PolicyCart,
  items: PolicyDisplayItem[],
): PolicyCart =>
  items.reduce<PolicyCart>(
    (nextCart, item) => {
      if (item.required && item.quantity > 0) {
        nextCart[item.id] = item.quantity;
      }
      return nextCart;
    },
    prunePolicyCart(cart, items),
  );

export const getPolicyCartItems = (
  cart: PolicyCart,
  items: PolicyDisplayItem[],
) =>
  items
    .map((item) => ({ item, quantity: cart[item.id] ?? 0 }))
    .filter(({ quantity }) => quantity > 0);

export const buildPolicyOrderRequestPayload = ({
  cart,
  departmentId,
  items,
  orderNote = "",
}: {
  cart: PolicyCart;
  departmentId: string;
  items: PolicyDisplayItem[];
  orderNote?: string;
}): EmployeeCatalogPolicyOrderRequestPayload => ({
  department_id: departmentId,
  order_note: orderNote,
  items: getPolicyCartItems(cart, items).map(({ item, quantity }) => ({
    kit_item_id: item.id,
    quantity,
  })),
});
