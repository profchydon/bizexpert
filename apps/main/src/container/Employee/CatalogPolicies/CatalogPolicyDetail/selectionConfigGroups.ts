import type { PolicyCart, PolicyDisplayItem } from "./utils";

type SelectionCategory = {
  category_id?: string | null;
  category_name?: string | null;
  min?: number | null;
  max?: number | null;
};

type SelectionConfig = { categories?: SelectionCategory[] | null } | null;

export type OpenSelectionGroup = {
  categoryId?: string | null;
  categoryKey: string;
  key: string;
  name: string;
  min: number;
  max: number | null;
  items: PolicyDisplayItem[];
};

export const isOpenSelectionPolicy = (selectionMode?: string | null) =>
  selectionMode === "open";

export function getOpenSelectionGroups(
  items: PolicyDisplayItem[],
  selectionConfig: unknown,
): OpenSelectionGroup[] {
  const categories = selectionCategories(selectionConfig);
  const duplicateCounts = categories.reduce<Map<string, number>>(
    (counts, category) => {
      const categoryKey = normalizeCategory(category.category_name);
      if (categoryKey)
        counts.set(categoryKey, (counts.get(categoryKey) ?? 0) + 1);
      return counts;
    },
    new Map(),
  );
  const seenCounts = new Map<string, number>();
  const groups = categories.flatMap((category) => {
    const categoryKey = normalizeCategory(category.category_name);
    if (!categoryKey) return [];
    const max = cleanMaxLimit(category.max);
    if (max === 0) return [];

    const occurrence = (seenCounts.get(categoryKey) ?? 0) + 1;
    seenCounts.set(categoryKey, occurrence);

    const name = category.category_name ?? "Category";
    const group: OpenSelectionGroup = {
      categoryKey,
      key: category.category_id ?? `${categoryKey}-${occurrence}`,
      name:
        (duplicateCounts.get(categoryKey) ?? 0) > 1
          ? `${name} ${occurrence}`
          : name,
      min: cleanLimit(category.min),
      max,
      items: [],
    };
    if (category.category_id) group.categoryId = category.category_id;
    return [group];
  });
  const groupsByCategoryId = new Map(
    groups
      .filter((group) => group.categoryId)
      .map((group) => [group.categoryId, group]),
  );
  const groupsByCategory = groupByCategoryKey(groups);
  const categoryIndexes = new Map<string, number>();

  items.forEach((item) => {
    const categoryKey = normalizeCategory(item.category);
    const group =
      groupsByCategoryId.get(item.categoryId) ??
      nextGroupForCategory(groupsByCategory.get(categoryKey), categoryIndexes);
    if (!group) return;

    group.items.push({
      ...item,
      quantity: group.max ?? Number.POSITIVE_INFINITY,
      required: false,
      selectionGroupKey: group.key,
      selectionGroupMax: group.max,
    });
  });

  return groups.filter((group) => group.items.length > 0);
}

export const getOpenSelectionItems = (groups: OpenSelectionGroup[]) =>
  groups.flatMap((group) => group.items);

export const getOpenSelectionGroupCartQuantity = (
  cart: PolicyCart,
  group: OpenSelectionGroup,
) => group.items.reduce((total, item) => total + (cart[item.id] ?? 0), 0);

export const getSelectedOpenSelectionGroup = (
  groups: OpenSelectionGroup[],
  activeKey: string,
) => groups.find((group) => group.key === activeKey) ?? groups[0];

export function addOpenSelectionCartItem(
  cart: PolicyCart,
  item: PolicyDisplayItem,
  items: PolicyDisplayItem[],
) {
  if (!canAddOpenSelectionCartItem(cart, item, items)) return cart;
  return addCartQuantity(
    cart,
    item.id,
    item.selectionGroupMax === null
      ? Number.POSITIVE_INFINITY
      : (item.selectionGroupMax ?? item.quantity),
  );
}

export function canAddOpenSelectionCartItem(
  cart: PolicyCart,
  item: PolicyDisplayItem,
  items: PolicyDisplayItem[],
) {
  if (!item.selectionGroupKey || item.selectionGroupMax == null) {
    return (cart[item.id] ?? 0) < item.quantity;
  }

  const groupTotal = items
    .filter((entry) => entry.selectionGroupKey === item.selectionGroupKey)
    .reduce((total, entry) => total + (cart[entry.id] ?? 0), 0);

  return groupTotal < item.selectionGroupMax;
}

export function pruneOpenSelectionCart(
  cart: PolicyCart,
  groups: OpenSelectionGroup[],
) {
  return groups.reduce<PolicyCart>((nextCart, group) => {
    let remaining = group.max;
    group.items.forEach((item) => {
      const itemQuantity =
        group.max === null
          ? (cart[item.id] ?? 0)
          : Math.min(cart[item.id] ?? 0, item.quantity);
      const quantity =
        remaining === null ? itemQuantity : Math.min(itemQuantity, remaining);
      if (quantity > 0) {
        nextCart[item.id] = quantity;
        if (remaining !== null) remaining -= quantity;
      }
    });
    return nextCart;
  }, {});
}

function addCartQuantity(cart: PolicyCart, itemId: string, max: number) {
  const nextQuantity = Math.min((cart[itemId] ?? 0) + 1, max);
  return nextQuantity <= 0 ? cart : { ...cart, [itemId]: nextQuantity };
}

function selectionCategories(config: unknown) {
  return (config as SelectionConfig)?.categories ?? [];
}

function groupByCategoryKey(groups: OpenSelectionGroup[]) {
  return groups.reduce<Map<string, OpenSelectionGroup[]>>((grouped, group) => {
    grouped.set(group.categoryKey, [
      ...(grouped.get(group.categoryKey) ?? []),
      group,
    ]);
    return grouped;
  }, new Map());
}

function nextGroupForCategory(
  groups: OpenSelectionGroup[] | undefined,
  categoryIndexes: Map<string, number>,
) {
  if (!groups?.length) return undefined;

  const categoryKey = groups[0].categoryKey;
  const index = categoryIndexes.get(categoryKey) ?? 0;
  categoryIndexes.set(categoryKey, index + 1);
  return groups[index % groups.length];
}

function cleanLimit(value: number | null | undefined) {
  return Math.max(value ?? 0, 0);
}

function cleanMaxLimit(value: number | null | undefined) {
  return value === null ? null : cleanLimit(value);
}

function normalizeCategory(category: string | null | undefined) {
  return category?.trim().toLowerCase() ?? "";
}
