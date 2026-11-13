"use client";

import { CheckCircle, X } from "lucide-react";
import {
  FLOATING_ALERT_TOP_OFFSET,
  FLOATING_ALERT_Z_INDEX,
} from "@/components/application/alerts/floatingAlertLayout";
import { cn } from "@/lib/utils";

type AlertColor = "success" | "error" | "warning" | "info";

interface Props {
  show: boolean;
  color?: AlertColor;
  title: string;
  description?: string;
  onDismiss?: () => void;
  topOffset?: string;
}

const colorStyles: Record<
  AlertColor,
  { container: string; icon: string; text: string }
> = {
  success: {
    container: "border-success-200 bg-success-50",
    icon: "text-success-600",
    text: "text-success-700",
  },
  error: {
    container: "border-error-200 bg-error-50",
    icon: "text-error-600",
    text: "text-error-700",
  },
  warning: {
    container: "border-warning-200 bg-warning-50",
    icon: "text-warning-600",
    text: "text-warning-700",
  },
  info: {
    container: "border-primary-200 bg-primary-50",
    icon: "text-primary-600",
    text: "text-primary-700",
  },
};

export function AccountsFloatingAlert({
  show,
  color = "success",
  title,
  description,
  onDismiss,
  topOffset = FLOATING_ALERT_TOP_OFFSET,
}: Props) {
  if (!show) return null;

  const styles = colorStyles[color];

  return (
    <div
      className={cn(
        "fixed right-4 flex w-[calc(100%-2rem)] max-w-sm items-start gap-3 rounded-xl border p-4 shadow-lg duration-200 animate-in fade-in slide-in-from-top-2",
        FLOATING_ALERT_Z_INDEX,
        topOffset,
        styles.container,
      )}
      role="alert"
    >
      <CheckCircle
        className={cn("mt-0.5 size-5 shrink-0", styles.icon)}
        aria-hidden
      />
      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
        <p className={cn("text-sm font-semibold", styles.text)}>{title}</p>
        {description && (
          <p className={cn("text-sm", styles.text)}>{description}</p>
        )}
      </div>
      {onDismiss && (
        <button
          type="button"
          onClick={onDismiss}
          aria-label="Dismiss"
          className={cn(
            "shrink-0 rounded p-0.5 transition hover:opacity-70",
            styles.icon,
          )}
        >
          <X className="size-4" />
        </button>
      )}
    </div>
  );
}
