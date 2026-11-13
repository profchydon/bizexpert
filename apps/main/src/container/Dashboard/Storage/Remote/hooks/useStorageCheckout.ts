"use client";

import type { DeviceActionKind } from "../data/deviceActions";
import type { DisposalMethod } from "../types/storage";

export interface CheckoutItem {
  id: string;
  kind: DeviceActionKind;
  deviceId: string;
  deviceName: string;
  serialNumber: string;
  country: string;
  assetType: string;
  image?: string;
  recipientName?: string;
  recipientCountry?: string;
  checkNote?: string;
  checkReason?: string;
  neededBy?: string;
  companyId?: string;
  employeeId?: string;
  currency?: string;
  erasureWaived?: boolean;
  disposalMethod?: DisposalMethod; // disposal items only — defaults to donate
  wipeRequested?: boolean; // deployment items only — factory reset a not-wiped device before shipping
}

// Deprecated: Local caching logic has been completely removed in favor of Server-Driven Cart.
export function getCheckoutSnapshot(): CheckoutItem[] {
  return [];
}
export function addCheckoutItems(_items: CheckoutItem[]) {}
export function removeCheckoutItem(_id: string) {}
export function clearCheckout() {}
export function useStorageCheckout() {
  return { items: [], count: 0 };
}
