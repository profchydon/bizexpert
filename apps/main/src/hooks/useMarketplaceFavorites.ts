"use client";

import { useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "equip-employee-marketplace-favorites";

const readFavorites = (): Set<string> => {
  if (globalThis.window === undefined) {
    return new Set();
  }

  try {
    const raw = globalThis.localStorage.getItem(STORAGE_KEY);
    return raw ? new Set((JSON.parse(raw) as string[]) ?? []) : new Set();
  } catch {
    return new Set();
  }
};

const writeFavorites = (favorites: Set<string>) => {
  if (globalThis.window === undefined) {
    return;
  }

  globalThis.localStorage.setItem(STORAGE_KEY, JSON.stringify([...favorites]));
};

const useMarketplaceFavorites = () => {
  const [favorites, setFavorites] = useState<Set<string>>(new Set());

  useEffect(() => {
    setFavorites(readFavorites());
  }, []);

  useEffect(() => {
    const onStorageChange = (event: StorageEvent) => {
      if (event.key === STORAGE_KEY) {
        setFavorites(readFavorites());
      }
    };

    globalThis.addEventListener("storage", onStorageChange);

    return () => {
      globalThis.removeEventListener("storage", onStorageChange);
    };
  }, []);

  const toggleFavorite = useCallback((id: string) => {
    setFavorites((prev) => {
      const next = new Set(prev);

      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }

      writeFavorites(next);

      return next;
    });
  }, []);

  return { favorites, toggleFavorite };
};

export default useMarketplaceFavorites;
