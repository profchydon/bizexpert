import { z } from "zod";
import type { Location, LocationType } from "@/types/bizexpert";
import {
  locationTypeToStoreMode,
  storeModeToLocationType,
  type StoreMode,
} from "./locationStoreMode";
import { STORE_BUSINESS_TYPE_OPTIONS } from "./storeBusinessTypes";

const businessTypeValues = STORE_BUSINESS_TYPE_OPTIONS.map(
  (option) => option.value,
) as [string, ...string[]];

export const createLocationSchema = z.object({
  name: z.string().trim().min(1, "Store name is required"),
  storeMode: z.enum(["regular", "warehouse"]),
  businessType: z.enum(businessTypeValues, {
    errorMap: () => ({ message: "Business type is required" }),
  }),
  vatRate: z.coerce
    .number()
    .min(0, "VAT must be 0 or more")
    .max(100, "VAT cannot exceed 100%"),
  address: z.string().trim().min(1, "Address is required"),
  phone: z.string().optional(),
  isDefault: z.boolean(),
});

export type CreateLocationValues = z.infer<typeof createLocationSchema>;

export const createLocationDefaults: CreateLocationValues = {
  name: "",
  storeMode: "regular",
  businessType: "retail",
  vatRate: 0,
  address: "",
  phone: "",
  isDefault: false,
};

export function valuesFromLocation(location: Location): CreateLocationValues {
  return {
    name: location.name,
    storeMode: locationTypeToStoreMode(location.type),
    businessType:
      (location.businessType as CreateLocationValues["businessType"]) ??
      "retail",
    vatRate: Number(location.vatRate ?? 0),
    address: location.address ?? "",
    phone: location.phone ?? "",
    isDefault: location.isDefault,
  };
}

function resolveLocationType(
  storeMode: StoreMode,
  previous?: LocationType,
): LocationType {
  return storeModeToLocationType(storeMode, previous);
}

export function toCreateLocationPayload(values: CreateLocationValues) {
  return {
    name: values.name.trim(),
    type: resolveLocationType(values.storeMode),
    businessType: values.businessType,
    vatRate: values.vatRate,
    address: values.address.trim(),
    phone: values.phone?.trim() || undefined,
    isDefault: values.isDefault,
  };
}

export function toUpdateLocationPayload(
  values: CreateLocationValues,
  previousType?: LocationType,
) {
  return {
    name: values.name.trim(),
    type: resolveLocationType(values.storeMode, previousType),
    businessType: values.businessType,
    vatRate: values.vatRate,
    address: values.address.trim(),
    phone: values.phone?.trim() || "",
  };
}
