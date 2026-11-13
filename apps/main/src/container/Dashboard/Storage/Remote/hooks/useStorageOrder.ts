"use client";

import { useSyncExternalStore } from "react";
import type { CheckoutItem } from "./useStorageCheckout";

export interface StorageOrder {
  id: string;
  createdAt: string;
  note?: string;
  items: CheckoutItem[];
  paid?: boolean;
}

const STORAGE_KEY = "rr-storage-last-order-v1";
let listeners: Array<() => void> = [];
let cache: StorageOrder | null | undefined;

function getSnapshot(): StorageOrder | null {
  if (cache !== undefined) return cache;
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    cache = raw ? (JSON.parse(raw) as StorageOrder) : null;
  } catch {
    cache = null;
  }
  return cache;
}

function getServerSnapshot(): StorageOrder | null {
  return null;
}

function subscribe(listener: () => void) {
  listeners = [...listeners, listener];
  return () => {
    listeners = listeners.filter((l) => l !== listener);
  };
}

export function setLastStorageOrder(order: StorageOrder) {
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(order));
  cache = order;
  for (const l of listeners) l();
}

/** Mark the last order paid — finalizes the order once payment succeeds. */
export function markLastOrderPaid() {
  const current = getSnapshot();
  if (current) setLastStorageOrder({ ...current, paid: true });
}

export function useLastStorageOrder(): StorageOrder | null {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
