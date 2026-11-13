"use client";

import type { ReactNode } from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useScopedViewNavigation } from "@/hooks/useViewNavigation";

type NavigatePressableProps = {
  href: string;
  scopeKey: string;
  replace?: boolean;
  className?: string;
  children: ReactNode;
  onBeforeNavigate?: () => void;
  "data-testid"?: string;
};

const NavigatePressable = ({
  href,
  scopeKey,
  replace,
  className,
  children,
  onBeforeNavigate,
  "data-testid": dataTestId,
}: NavigatePressableProps) => {
  const { view, isViewLoading } = useScopedViewNavigation();
  const loading = isViewLoading(scopeKey);

  return (
    <button
      type="button"
      className={cn(className, loading && "pointer-events-none opacity-70")}
      aria-busy={loading}
      disabled={loading}
      onClick={() => {
        onBeforeNavigate?.();
        view(href, scopeKey, { replace });
      }}
      data-testid={dataTestId}
    >
      {loading ? (
        <span className="inline-flex items-center gap-2">
          <Loader2 className="size-4 animate-spin" aria-hidden />
          {children}
        </span>
      ) : (
        children
      )}
    </button>
  );
};

export default NavigatePressable;
