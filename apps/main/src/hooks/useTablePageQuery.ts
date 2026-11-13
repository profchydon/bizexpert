"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  applyTablePageParam,
  listReturnHref,
  parseTablePage,
} from "@/utils/tableListPage";

export function useTablePageQuery(param = "page") {
  const searchParams = useSearchParams();
  const urlPage = parseTablePage(searchParams.get(param));
  const [pending, setPending] = useState<number | null>(null);
  const page = pending ?? urlPage;
  const pageRef = useRef(page);
  pageRef.current = page;

  useEffect(() => {
    setPending(null);
  }, [urlPage]);

  const setPage = useCallback(
    (next: number | ((current: number) => number)) => {
      const value = parseTablePage(
        String(typeof next === "function" ? next(pageRef.current) : next),
      );
      const params = new URLSearchParams(window.location.search);
      if (
        value === parseTablePage(params.get(param)) &&
        value === pageRef.current
      ) {
        return;
      }
      pageRef.current = value;
      setPending(value);
      applyTablePageParam(params, value, param);
      const query = params.toString();
      const url = query
        ? `${window.location.pathname}?${query}`
        : window.location.pathname;
      window.history.replaceState(null, "", url);
    },
    [param],
  );

  return { page, setPage };
}

export function useListReturnHref(fallbackPath: string) {
  const searchParams = useSearchParams();
  return listReturnHref(fallbackPath, searchParams);
}
