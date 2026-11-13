import { product_1 } from "@/assets/images";
import type {
  FulfillmentMode,
  KitItem,
  KitItemSummary,
  KitStatus,
} from "./types";

export const fulfillmentConfig: Record<
  FulfillmentMode,
  { label: string; tone: "blue" | "orange"; tooltip: string }
> = {
  split: {
    label: "Split OK",
    tone: "blue",
    tooltip:
      "Available items ship immediately, unavailable items trigger an RFQ",
  },
  hold: {
    label: "Hold Until Complete",
    tone: "orange",
    tooltip: "Nothing ships until all required items are sourced",
  },
};

export const statusConfig: Record<
  KitStatus,
  { label: string; tone: "green" | "gray" | "slate"; tooltip: string }
> = {
  draft: {
    label: "Draft",
    tone: "slate",
    tooltip: "Kit is incomplete and not yet available for use",
  },
  active: {
    label: "Active",
    tone: "green",
    tooltip: "Kit is live and available for procurement rules",
  },
  archived: {
    label: "Archived",
    tone: "gray",
    tooltip: "Kit is no longer in use",
  },
};

export const formatKitDate = (value: string | null | undefined) => {
  if (!value) return "—";
  return new Date(value).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

export const getKitFulfillmentMode = (
  mode: FulfillmentMode | null | undefined,
): FulfillmentMode => mode ?? "split";

export const formatItemsCount = (count: number) =>
  `${count} ${count === 1 ? "item" : "items"}`;

export const defaultKitPreviewImage = product_1;

const normalizeText = (value: unknown): string | null => {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  return trimmed || null;
};

const normalizeSpecKey = (value: string) =>
  value.replaceAll("_", " ").replaceAll("-", " ").trim().toLowerCase();

const getAssetSource = (source: unknown): Record<string, unknown> | null => {
  if (!source || typeof source !== "object") return null;
  const record = source as Record<string, unknown>;
  if (
    record.asset_specification &&
    typeof record.asset_specification === "object"
  ) {
    return record.asset_specification as Record<string, unknown>;
  }
  return record;
};

const getSpecEntries = (
  source: Record<string, unknown>,
  key: "spec" | "properties",
) => {
  const value = source[key];

  if (Array.isArray(value)) {
    return value
      .filter(
        (entry): entry is Record<string, unknown> =>
          Boolean(entry) && typeof entry === "object",
      )
      .map((entry) => ({
        name: normalizeSpecKey(
          String(entry.name ?? entry.label ?? entry.key ?? ""),
        ),
        value: normalizeText(entry.value),
      }))
      .filter(
        (
          entry,
        ): entry is {
          name: string;
          value: string;
        } => Boolean(entry.name) && Boolean(entry.value),
      );
  }

  if (!value || typeof value !== "object") return [];

  return Object.entries(value as Record<string, unknown>)
    .map(([name, entryValue]) => ({
      name: normalizeSpecKey(name),
      value: normalizeText(entryValue),
    }))
    .filter(
      (
        entry,
      ): entry is {
        name: string;
        value: string;
      } => Boolean(entry.name) && Boolean(entry.value),
    );
};

export const assetCategoryLabel = (source: unknown): string | null => {
  const assetSource = getAssetSource(source);
  if (!assetSource) return null;
  const category = assetSource.category;
  const directCategory = normalizeText(category);
  if (directCategory) return directCategory;
  if (category && typeof category === "object") {
    return normalizeText((category as Record<string, unknown>).name);
  }
  return null;
};

export const assetSpecLabels = (source: unknown): string[] => {
  const assetSource = getAssetSource(source);
  if (!assetSource) return [];

  const specEntries = [
    ...getSpecEntries(assetSource, "spec"),
    ...getSpecEntries(assetSource, "properties"),
  ];

  const specValueByKey = new Map<string, string>();
  specEntries.forEach((entry) => {
    if (!specValueByKey.has(entry.name)) {
      specValueByKey.set(entry.name, entry.value);
    }
  });

  const preferredValues = [
    ["chip", "chip"],
    ["processor", "processor"],
    ["RAM", "ram"],
    ["memory", "memory"],
    ["display", "display"],
    ["screen_size", "screen size"],
    ["size", "size"],
    ["storage", "storage"],
    ["resolution", "resolution"],
    ["wireless", "wireless"],
    ["bluetooth", "bluetooth"],
    ["connectivity", "connectivity"],
    ["5g", "5g"],
    ["lte", "lte"],
    ["network", "network"],
    ["os", "os"],
    ["keyboard", "keyboard"],
    ["colour", "colour"],
    ["color", "color"],
    ["power_adapter", "power adapter"],
    ["warranty", "warranty"],
    ["state", "state"],
    ["spec_tier", "spec tier"],
    ["type", "type"],
  ]
    .map(
      ([directKey, specKey]) =>
        normalizeText(assetSource[directKey]) ??
        specValueByKey.get(specKey) ??
        null,
    )
    .filter((value): value is string => Boolean(value));

  const ignoredSpecKeys = new Set(["condition"]);
  const preferredSpecKeys = new Set([
    "chip",
    "processor",
    "ram",
    "memory",
    "display",
    "screen size",
    "size",
    "storage",
    "resolution",
    "wireless",
    "bluetooth",
    "connectivity",
    "5g",
    "lte",
    "network",
    "os",
    "keyboard",
    "colour",
    "color",
    "power adapter",
    "warranty",
    "state",
    "spec tier",
    "type",
  ]);

  const extraSpecValues = specEntries
    .filter(
      (entry) =>
        !ignoredSpecKeys.has(entry.name) && !preferredSpecKeys.has(entry.name),
    )
    .map((entry) => entry.value);

  const labels: string[] = [];
  const seen = new Set<string>();

  [...preferredValues, ...extraSpecValues].forEach((value) => {
    const key = value.toLowerCase();
    if (seen.has(key)) return;
    seen.add(key);
    labels.push(value);
  });

  return labels.slice(0, 4);
};

const isKitItem = (item: KitItem | KitItemSummary): item is KitItem =>
  "asset_specification_id" in item;

export const itemPreviewName = (
  item: KitItem | KitItemSummary,
): string | null => {
  if (isKitItem(item)) {
    const spec = item.asset_specification;
    return (spec?.name as string | undefined) ?? null;
  }
  return item.name ?? null;
};

export const resolveKitPreviewImage = (image: string | null | undefined) =>
  normalizeText(image) ?? defaultKitPreviewImage;

export const isKitPreviewPlaceholder = (image: string | null | undefined) =>
  !normalizeText(image);

export const itemPreviewImage = (item: KitItem | KitItemSummary): string => {
  if (isKitItem(item)) {
    const images =
      (item.asset_specification?.images as string[] | undefined) ?? [];
    return resolveKitPreviewImage(images[0]);
  }
  return resolveKitPreviewImage(item.images?.[0]);
};

export const itemPreviewUsesPlaceholder = (
  item: KitItem | KitItemSummary,
): boolean => {
  if (isKitItem(item)) {
    const images =
      (item.asset_specification?.images as string[] | undefined) ?? [];
    return isKitPreviewPlaceholder(images[0]);
  }
  return isKitPreviewPlaceholder(item.images?.[0]);
};

export const extractKitErrorMessage = (
  error: unknown,
  fallback: string,
): string => {
  if (!error || typeof error !== "object") return fallback;
  const data = (error as { data?: unknown }).data;
  if (typeof data === "string") return data;
  if (data && typeof data === "object") {
    const message = (data as { message?: unknown; errors?: unknown }).message;
    if (typeof message === "string" && message.trim()) return message;
    const errors = (data as { errors?: Record<string, unknown> }).errors;
    if (errors && typeof errors === "object") {
      const first = Object.values(errors)[0];
      if (typeof first === "string") return first;
      if (Array.isArray(first) && typeof first[0] === "string") return first[0];
    }
  }
  return fallback;
};
