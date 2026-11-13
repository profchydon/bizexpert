import { format, isValid } from "date-fns";
import type { ICart } from "@/types/cart";
import {
  deployRecipientArrow,
  orderSummaryEmployeeName,
  type StorageCartPerson,
} from "@/container/Dashboard/Storage/Remote/utils/storageDeployRecipient";

const DROPPED_PROP_VALUES = new Set([
  "dispose",
  "disposal",
  "device check",
  "device_check",
  "deploy from storage",
  "deploy",
]);

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function propertyValues(item: ICart, catalogId?: string | null): unknown[] {
  const properties: unknown = item.specification?.properties;
  if (catalogId && typeof properties === "string") {
    const parsed: unknown = JSON.parse(properties);
    return isRecord(parsed) ? Object.values(parsed) : [];
  }
  if (!Array.isArray(properties)) return [];
  return properties.flatMap((property) =>
    isRecord(property) ? [property.value] : [],
  );
}

function inferredActionType(item: ICart): string | undefined {
  const name = item.asset?.name?.toLowerCase() ?? "";
  const values = (item.specification?.properties ?? []).map((property) =>
    String(property?.value).toLowerCase(),
  );
  if (
    name.includes("dispose") ||
    values.some((value) => value === "dispose" || value === "disposal")
  ) {
    return "Dispose";
  }
  if (
    name.includes("device check") ||
    values.some((value) => value === "device check" || value === "device_check")
  ) {
    return "Device check";
  }
  if (
    name.includes("deploy") ||
    values.some(
      (value) => value === "deploy from storage" || value === "deploy",
    )
  ) {
    return "Deploy";
  }
  return undefined;
}

export function orderSummaryFulfilmentLabel(
  value?: string | null,
): string | null {
  if (!value) return null;
  const date = new Date(`${value}T00:00:00`);
  if (!isValid(date)) return null;
  return `Fulfilment date ${format(date, "MMM d, yyyy")}`;
}

export function orderSummaryActionType(item: ICart): string | undefined {
  return item.actionType || item.action_type || inferredActionType(item);
}

function isDeployAction(actionType?: string) {
  const value = actionType?.toLowerCase();
  return (
    value === "deploy" ||
    value === "deployment" ||
    value === "deploy from storage"
  );
}

function propertyText(value: unknown): string | undefined {
  if (typeof value === "string") return value;
  if (typeof value === "number" || typeof value === "boolean") {
    return String(value);
  }
  return undefined;
}

export function orderSummaryItemDescription(
  item: ICart,
  countryLabel?: string,
  employee?: StorageCartPerson & {
    id?: string;
    personal_email?: string | null;
  },
  catalogId?: string | null,
): string {
  const actionType = orderSummaryActionType(item);
  let description = propertyValues(item, catalogId)
    .map(propertyText)
    .filter((text): text is string => Boolean(text))
    .filter((text) => {
      const lower = text.toLowerCase();
      return (
        !DROPPED_PROP_VALUES.has(lower) && lower !== countryLabel?.toLowerCase()
      );
    })
    .join(" · ");

  if (isDeployAction(actionType)) {
    description += deployRecipientArrow(
      item.recipientName?.trim() || orderSummaryEmployeeName(employee),
    );
  }

  return description;
}
