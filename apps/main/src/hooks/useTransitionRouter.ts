"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { transitionNavigate } from "./transitionNavigate";

type NavigateOptions = Parameters<ReturnType<typeof useRouter>["push"]>[1];

export const useTransitionRouter = () => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const push = (href: string, options?: NavigateOptions) => {
    transitionNavigate(startTransition, () => {
      router.push(href, options);
    });
  };

  const replace = (href: string, options?: NavigateOptions) => {
    transitionNavigate(startTransition, () => {
      router.replace(href, options);
    });
  };

  return {
    push,
    replace,
    back: router.back,
    isPending,
  };
};
