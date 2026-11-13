import type { ICart } from "@/types/cart";
import type { ISpecification } from "@/types/assets";
import {
  cartLineType,
  isStorageCartLine,
  type StorageCartLine,
  type UnknownCartLine,
} from "./cartLineTypes";

function decodeSpecification(item: UnknownCartLine): ISpecification | null {
  const specification = item.specification as
    | { properties?: unknown; spec?: unknown }
    | undefined;
  if (!specification) return null;

  const properties = specification.properties;
  if (typeof properties === "string") {
    try {
      const decodedProps = JSON.parse(properties) as Record<string, unknown>;
      return {
        ...specification,
        properties: Object.keys(decodedProps).map((key) => ({
          name: key.charAt(0).toUpperCase() + key.slice(1),
          value: decodedProps[key] as string,
        })),
      } as ISpecification;
    } catch {
      return null;
    }
  }

  if (Array.isArray(properties)) {
    return specification as ISpecification;
  }

  return null;
}

export function decodeMarketplaceCartItem(item: UnknownCartLine): ICart | null {
  if (isStorageCartLine(item)) return null;
  if (cartLineType(item) !== "marketplace") return null;

  const specification = decodeSpecification(item);
  if (!specification) {
    if (item.asset && item.pricing) {
      return item as unknown as ICart;
    }
    return null;
  }

  return {
    ...(item as unknown as ICart),
    specification,
  };
}

export function asStorageCartLine(
  item: UnknownCartLine,
): StorageCartLine | null {
  if (!isStorageCartLine(item)) return null;
  return item as StorageCartLine;
}

export function splitCartLines(lines: UnknownCartLine[] | undefined | null) {
  const marketplace: ICart[] = [];
  const storage: StorageCartLine[] = [];

  for (const line of lines ?? []) {
    const storageLine = asStorageCartLine(line);
    if (storageLine) {
      storage.push(storageLine);
      continue;
    }
    const marketplaceItem = decodeMarketplaceCartItem(line);
    if (marketplaceItem) marketplace.push(marketplaceItem);
  }

  return { marketplace, storage };
}
