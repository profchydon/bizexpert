import type { ICart } from "@/types/cart";
import { currencySymbol } from "@/utils/currencySymbol";
import type { CheckoutItem } from "../hooks/useStorageCheckout";
import {
  lineFeeForAction,
  type StorageServiceFeeTable,
} from "./storageServiceFees";

const ACTION_LABEL: Record<CheckoutItem["kind"], string> = {
  deployment: "Deploy from storage",
  device_check: "Device check",
  disposal: "Dispose",
};

function lineCurrency(item: CheckoutItem) {
  const symbol = currencySymbol(item.currency) || "$";
  const trimmed = item.currency?.trim() ?? "";
  const code = trimmed.length === 3 ? trimmed.toUpperCase() : trimmed;
  return { symbol, code: code || "USD" };
}

function placeholderAsset(item: CheckoutItem) {
  const { symbol, code } = lineCurrency(item);
  return {
    id: item.deviceId,
    asset_id: item.deviceId,
    asset_spec_id: item.id,
    name: item.deviceName,
    description: item.serialNumber,
    year: "",
    type: item.assetType,
    make: "",
    model: "",
    category: item.assetType,
    assetCode: item.serialNumber,
    status: "active",
    spec: [],
    country: item.country,
    asset_pricing: {
      amount: "0",
      id: item.id,
      currency: { code, name: "", symbol },
    },
    createdAt: "",
    updatedAt: "",
    images: item.image ? [item.image] : [],
  };
}

export function mapCheckoutItemToOrderSummaryCart(
  item: CheckoutItem,
  feeTable?: StorageServiceFeeTable | null,
): ICart {
  const amount = String(lineFeeForAction(item, feeTable ?? null));
  const { code } = lineCurrency(item);

  return {
    asset: placeholderAsset(item) as ICart["asset"],
    specification: {
      properties: [
        { name: "Serial", value: item.serialNumber },
        { name: "Action", value: ACTION_LABEL[item.kind] },
        { name: "Country", value: item.country },
      ],
      spec: [],
    },
    pricing: {
      id: item.id,
      amount,
      currency_code: code,
      asset_specification_id: item.id,
    },
    quantity: 1,
    amount,
    source: "STORAGE_ACTION",
    equipmentId: item.deviceId,
    country: { name: item.country, label: item.country },
    images: item.image ?? null,
    recipientName: item.recipientName,
    recipientCountry: item.recipientCountry,
    employeeId: item.employeeId,
  };
}
