"use client";

import { CheckCircle, XClose } from "@untitledui/icons";
import { cx } from "@/utils/cx";
import {
  FLOATING_ALERT_TOP_OFFSET,
  FLOATING_ALERT_Z_INDEX,
} from "./floatingAlertLayout";

interface FloatingAlertProps {
  show: boolean;
  color?: "success" | "error" | "warning" | "info";
  title: string;
  description?: string;
  action?: { label: string; onPress: () => void };
  onDismiss?: () => void;
  topOffset?: string;
}

export function FloatingAlert({
  show,
  color = "success",
  title,
  description,
  action,
  onDismiss,
  topOffset = FLOATING_ALERT_TOP_OFFSET,
}: FloatingAlertProps) {
  if (!show) return null;

  const colorStyles = {
    success: {
      container: "border-[#abefc6] bg-[#ecfdf3]",
      icon: "text-[#17b26a]",
      title: "text-[#067647]",
      description: "text-[#067647]",
    },
    error: {
      container: "border-[#fecdca] bg-[#fef3f2]",
      icon: "text-[#d92d20]",
      title: "text-[#b42318]",
      description: "text-[#b42318]",
    },
    warning: {
      container: "border-[#fedf89] bg-[#fffaeb]",
      icon: "text-[#dc6803]",
      title: "text-[#b54708]",
      description: "text-[#b54708]",
    },
    info: {
      container: "border-[#b2ddff] bg-[#eff8ff]",
      icon: "text-[#0c66ff]",
      title: "text-[#0052cc]",
      description: "text-[#0052cc]",
    },
  };

  const styles = colorStyles[color];

  return (
    <div
      className={cx(
        "fixed right-4 flex w-[calc(100%-2rem)] max-w-sm items-start gap-3 rounded-xl border p-4 shadow-lg",
        FLOATING_ALERT_Z_INDEX,
        "duration-200 animate-in fade-in slide-in-from-top-2",
        topOffset,
        styles.container,
      )}
      role="alert"
    >
      <CheckCircle
        className={cx("mt-0.5 size-5 shrink-0", styles.icon)}
        aria-hidden="true"
      />
      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
        <p className={cx("text-sm font-semibold", styles.title)}>{title}</p>
        {description && (
          <p className={cx("text-sm", styles.description)}>{description}</p>
        )}
        {action && (
          <button
            type="button"
            onClick={action.onPress}
            className={cx(
              "mt-1 self-start text-sm font-semibold underline underline-offset-2",
              styles.title,
            )}
          >
            {action.label}
          </button>
        )}
      </div>
      {onDismiss && (
        <button
          type="button"
          onClick={onDismiss}
          aria-label="Dismiss"
          className={cx(
            "shrink-0 rounded p-0.5 transition hover:opacity-70",
            styles.icon,
          )}
        >
          <XClose className="size-4" />
        </button>
      )}
    </div>
  );
}
