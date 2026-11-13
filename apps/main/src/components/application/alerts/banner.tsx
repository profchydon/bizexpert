"use client";

import type { ComponentType, ReactNode } from "react";
import { cx } from "@/utils/cx";

export type BannerTone = "info" | "warning" | "error" | "success" | "neutral";

const TONE: Record<
  BannerTone,
  { container: string; icon: string; text: string }
> = {
  info: {
    container: "border-utility-blue-200 bg-utility-blue-50",
    icon: "text-utility-blue-700",
    text: "text-utility-blue-700",
  },
  warning: {
    container: "border-utility-yellow-200 bg-utility-yellow-50",
    icon: "text-utility-yellow-700",
    text: "text-utility-yellow-700",
  },
  error: {
    container: "border-utility-red-200 bg-utility-red-50",
    icon: "text-utility-red-700",
    text: "text-utility-red-700",
  },
  success: {
    container: "border-utility-green-200 bg-utility-green-50",
    icon: "text-utility-green-700",
    text: "text-utility-green-700",
  },
  neutral: {
    container: "border-secondary bg-secondary",
    icon: "text-fg-quaternary",
    text: "text-secondary",
  },
};

interface BannerProps {
  tone: BannerTone;
  icon: ComponentType<{ className?: string }>;
  title: ReactNode;
  description?: ReactNode;
  meta?: ReactNode;
  action?: ReactNode;
  children?: ReactNode;
  className?: string;
}

export function Banner({
  tone,
  icon: Icon,
  title,
  description,
  meta,
  action,
  children,
  className,
}: BannerProps) {
  const styles = TONE[tone];
  return (
    <div
      className={cx(
        "flex flex-col gap-3 rounded-xl border p-4",
        styles.container,
        className,
      )}
      role="status"
    >
      <div className="flex items-start gap-3">
        <Icon
          className={cx("mt-0.5 size-5 shrink-0", styles.icon)}
          aria-hidden="true"
        />
        <div className="flex min-w-0 flex-col gap-1">
          <p className={cx("text-sm font-semibold", styles.text)}>{title}</p>
          {description && (
            <p className={cx("text-sm opacity-90", styles.text)}>
              {description}
            </p>
          )}
          {meta && (
            <p className={cx("mt-0.5 text-xs opacity-80", styles.text)}>
              {meta}
            </p>
          )}
        </div>
      </div>
      {action && <div className="pl-8">{action}</div>}
      {children}
    </div>
  );
}
