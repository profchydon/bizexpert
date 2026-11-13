"use client";

import { useSyncExternalStore } from "react";
import type { CheckoutItem } from "../hooks/useStorageCheckout";

export interface StorageUnifiedOrder {
  id: string;
  createdAt: string;
  actionItems: CheckoutItem[];
  paid?: boolean;
}

const STORAGE_KEY = "rr-unified-order-v1";
let listeners: Array<() => void> = [];
let cache: StorageUnifiedOrder | null | undefined;

function getSnapshot(): StorageUnifiedOrder | null {
  if (cache !== undefined) return cache;
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    cache = raw ? (JSON.parse(raw) as StorageUnifiedOrder) : null;
  } catch {
    cache = null;
  }
  return cache;
}

const SERVER_SNAPSHOT: StorageUnifiedOrder | null = null;

function getServerSnapshot(): StorageUnifiedOrder | null {
  return SERVER_SNAPSHOT;
}

function subscribe(listener: () => void) {
  listeners = [...listeners, listener];
  return () => {
    listeners = listeners.filter((current) => current !== listener);
  };
}

export function setStorageUnifiedOrder(order: StorageUnifiedOrder) {
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(order));
  cache = order;
  for (const listener of listeners) listener();
}

export function markStorageUnifiedOrderPaid() {
  const current = getSnapshot();
  if (!current || current.paid) return;
  setStorageUnifiedOrder({ ...current, paid: true });
}

export function useStorageUnifiedOrder(): StorageUnifiedOrder | null {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
