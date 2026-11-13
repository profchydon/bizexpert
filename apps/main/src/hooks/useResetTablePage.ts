"use client";

import { useEffect, useRef } from "react";

export function useResetTablePage(
  setPage: (page: number) => void,
  ...deps: unknown[]
) {
  const setPageRef = useRef(setPage);
  setPageRef.current = setPage;
  const previous = useRef<string | null>(null);
  const key = JSON.stringify(deps);

  useEffect(() => {
    if (previous.current === null) {
      previous.current = key;
      return;
    }
    if (previous.current === key) return;
    previous.current = key;
    setPageRef.current(1);
  }, [key]);
}

export function useSearchFromQueryParam(
  value: string | null,
  setSearch: (value: string | null) => void,
  setPage: (page: number) => void,
) {
  const setSearchRef = useRef(setSearch);
  const setPageRef = useRef(setPage);
  setSearchRef.current = setSearch;
  setPageRef.current = setPage;
  const previous = useRef(value);

  useEffect(() => {
    if (!value || previous.current === value) return;
    previous.current = value;
    setSearchRef.current(value);
    setPageRef.current(1);
  }, [value]);
}

export function useResetPageWhenValueChanges(
  setPage: (page: number) => void,
  value: string | null | undefined,
) {
  const setPageRef = useRef(setPage);
  setPageRef.current = setPage;
  const previous = useRef<string | null | undefined>(undefined);

  useEffect(() => {
    const next = value ?? null;
    if (previous.current === undefined) {
      previous.current = next;
      return;
    }
    if (previous.current && next && previous.current !== next) {
      setPageRef.current(1);
    }
    previous.current = next;
  }, [value]);
}
