"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Drop-in replacement for useState that round-trips through sessionStorage so
 * non-trivial editor state survives page navigation within a session.
 *
 * SSR-safe: first render always returns `initial`, matching the server. Cached
 * state is loaded into a follow-up render via useEffect, after hydration.
 *
 * Cross-component sync: every instance subscribed to the same key shares one
 * value. When one component writes, all subscribed instances receive the new
 * value — so e.g. submitting a device check on the form is visible to the
 * Recent Checks panel on the same page without a navigation.
 *
 * Pass `null` for `key` to opt out of persistence.
 */

interface Store<T> {
  value: T | undefined;
  subscribers: Set<(value: T) => void>;
}

const stores = new Map<string, Store<unknown>>();

function getStore<T>(key: string): Store<T> {
  let store = stores.get(key) as Store<T> | undefined;
  if (!store) {
    let value: T | undefined;
    if (typeof window !== "undefined") {
      try {
        const raw = sessionStorage.getItem(key);
        if (raw) value = JSON.parse(raw);
      } catch {}
    }
    store = { value, subscribers: new Set() };
    stores.set(key, store as Store<unknown>);
  }
  return store;
}

export function useSessionPersistedState<T>(
  key: string | null,
  initial: T | (() => T),
): [T, React.Dispatch<React.SetStateAction<T>>] {
  const [state, setLocal] = useState<T>(() =>
    typeof initial === "function" ? (initial as () => T)() : initial,
  );
  const handlerRef = useRef<(value: T) => void>(setLocal);
  const stateRef = useRef(state);
  stateRef.current = state;

  useEffect(() => {
    if (!key || typeof window === "undefined") return;
    const store = getStore<T>(key);
    const initialState = stateRef.current;
    if (store.value === undefined && hasRichInitial(initialState)) {
      store.value = initialState;
      try {
        sessionStorage.setItem(key, JSON.stringify(initialState));
      } catch {}
    } else if (store.value !== undefined && store.value !== initialState) {
      setLocal(store.value);
    }
    const cb = (value: T) => handlerRef.current(value);
    store.subscribers.add(cb);
    return () => {
      store.subscribers.delete(cb);
    };
  }, [key]);

  const set = useCallback<React.Dispatch<React.SetStateAction<T>>>(
    (updater) => {
      if (!key || typeof window === "undefined") {
        setLocal(updater);
        return;
      }
      const store = getStore<T>(key);
      const prev = (
        store.value !== undefined ? store.value : stateRef.current
      ) as T;
      const next =
        typeof updater === "function"
          ? (updater as (p: T) => T)(prev)
          : updater;
      store.value = next;
      try {
        sessionStorage.setItem(key, JSON.stringify(next));
      } catch {}
      store.subscribers.forEach((cb) => cb(next));
    },
    [key],
  );

  return [state, set];
}

function hasRichInitial(value: unknown): boolean {
  if (Array.isArray(value)) return value.length > 0;
  if (value && typeof value === "object") return Object.keys(value).length > 0;
  return value !== null && value !== undefined;
}
