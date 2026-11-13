"use client";

import { useEffect, useRef, useState } from "react";
import { useTransitionRouter } from "./useTransitionRouter";

type ViewNavigationOptions = {
  replace?: boolean;
};

export const useViewNavigation = () => {
  const { push, replace, isPending } = useTransitionRouter();

  const view = (href: string, options?: ViewNavigationOptions) => {
    if (options?.replace) {
      replace(href);
      return;
    }
    push(href);
  };

  return { view, isPending };
};

export const useScopedViewNavigation = () => {
  const { push, replace, isPending } = useTransitionRouter();
  const [activeKey, setActiveKey] = useState<string | null>(null);
  const activeKeyRef = useRef<string | null>(null);

  useEffect(() => {
    if (!isPending) {
      activeKeyRef.current = null;
      setActiveKey(null);
    }
  }, [isPending]);

  const view = (href: string, key: string, options?: ViewNavigationOptions) => {
    activeKeyRef.current = key;
    setActiveKey(key);
    if (options?.replace) {
      replace(href);
      return;
    }
    push(href);
  };

  const isViewLoading = (key: string) =>
    Boolean(isPending && (activeKeyRef.current === key || activeKey === key));

  return { view, isViewLoading, isPending, activeKey };
};
