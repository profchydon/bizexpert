"use client";

import { useEffect } from "react";

export function useWizardAdminPickerScroll({
  open,
  hasMore,
  isInitialLoading,
  isLoadingMore,
  loadMore,
  listRef,
  sentinelRef,
  itemCount,
}: {
  open: boolean;
  hasMore: boolean;
  isInitialLoading: boolean;
  isLoadingMore: boolean;
  loadMore: () => void;
  listRef: React.RefObject<HTMLUListElement | null>;
  sentinelRef: React.RefObject<HTMLLIElement | null>;
  itemCount: number;
}) {
  useEffect(() => {
    if (!open || !hasMore || isInitialLoading || isLoadingMore) return;

    const root = listRef.current;
    const sentinel = sentinelRef.current;
    if (!root || !sentinel) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          loadMore();
        }
      },
      { root, rootMargin: "40px", threshold: 0 },
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [
    open,
    hasMore,
    isInitialLoading,
    isLoadingMore,
    loadMore,
    listRef,
    sentinelRef,
    itemCount,
  ]);
}
