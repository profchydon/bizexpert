import type { ComponentType } from "react";
import { AlertTriangle, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Subsidiary, SubsidiaryStatus } from "../types";
import { SlashCircleIcon } from "./SlashCircleIcon";

export type BannerAction = "card-capture" | "settle-invoice";

type BannerColor = "warning" | "error" | "gray";

const colorStyles: Record<
  BannerColor,
  { container: string; icon: string; title: string; body: string }
> = {
  warning: {
    container: "border-warning-300 bg-warning-50",
    icon: "text-warning-600",
    title: "text-warning-700",
    body: "text-warning-600",
  },
  error: {
    container: "border-error-300 bg-error-50",
    icon: "text-error-600",
    title: "text-error-700",
    body: "text-error-600",
  },
  gray: {
    container: "border-gray-200 bg-gray-50",
    icon: "text-gray-500",
    title: "text-gray-900",
    body: "text-gray-600",
  },
};

interface BannerConfig {
  color: BannerColor;
  icon: ComponentType<{ className?: string }>;
  title: string;
  body: string;
  cta?: string;
  action?: BannerAction;
}

const statusBanner: Partial<Record<SubsidiaryStatus, BannerConfig>> = {
  "card-pending": {
    color: "warning",
    icon: CreditCard,
    title: "Card capture pending",
    body: "This entity is blocked from billable activity until a card is added. Complete card capture to activate it.",
    cta: "Complete card capture",
    action: "card-capture",
  },
  suspended: {
    color: "error",
    icon: AlertTriangle,
    title: "Suspended, invoice overdue",
    body: "An invoice is 15+ days overdue, so credit is paused. Settle the outstanding invoice to restore this entity's credit.",
    cta: "Settle invoice",
    action: "settle-invoice",
  },
  closed: {
    color: "gray",
    icon: SlashCircleIcon,
    title: "This entity is closed",
    body: "Its billing cycle has stopped and it can't be billed again. To resume, create a new entity and migrate its assets.",
  },
};

export function SubsidiaryStatusBanner({
  subsidiary,
  onCta,
}: {
  subsidiary: Subsidiary;
  onCta: (action: BannerAction) => void;
}) {
  const config = statusBanner[subsidiary.status];
  if (!config) return null;

  const styles = colorStyles[config.color];
  const Icon = config.icon;

  return (
    <div
      className={`flex items-start gap-3 rounded-xl border px-4 py-3 ${styles.container}`}
    >
      <Icon className={`mt-0.5 size-5 shrink-0 ${styles.icon}`} />
      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
        <p className={`text-sm font-semibold ${styles.title}`}>
          {config.title}
        </p>
        <p className={`text-sm ${styles.body}`}>{config.body}</p>
      </div>
      {config.cta && config.action && (
        <Button
          size="sm"
          variant="outline"
          className="shrink-0"
          onClick={() => onCta(config.action!)}
          data-testid="subsidiarystatusbanner-button"
        >
          {config.cta}
        </Button>
      )}
    </div>
  );
}
