"use client";

import type { ReactNode } from "react";
import { Focusable } from "react-aria-components";
import { Tooltip } from "./tooltip";
import { cx } from "@/utils/cx";

type Props = {
  isDisabled: boolean;
  reason?: string | null;
  placement?:
    | "top"
    | "bottom"
    | "left"
    | "right"
    | "top start"
    | "top end"
    | "bottom start"
    | "bottom end";
  triggerClassName?: string;
  children: ReactNode;
};

export function DisabledWithTooltip({
  isDisabled,
  reason,
  placement = "top",
  triggerClassName = "inline-flex",
  children,
}: Props) {
  const message = reason?.trim();
  if (!isDisabled || !message) {
    return children;
  }

  const isFullWidth = triggerClassName.includes("w-full");

  return (
    <Tooltip title={message} placement={placement}>
      <Focusable>
        <span
          role="button"
          aria-disabled="true"
          tabIndex={0}
          className={cx(
            isFullWidth ? "flex w-full" : triggerClassName,
            "cursor-not-allowed outline-hidden",
          )}
        >
          <span
            className={cx(
              "pointer-events-none",
              isFullWidth ? "flex w-full [&>*]:w-full" : "inline-flex",
            )}
          >
            {children}
          </span>
        </span>
      </Focusable>
    </Tooltip>
  );
}
