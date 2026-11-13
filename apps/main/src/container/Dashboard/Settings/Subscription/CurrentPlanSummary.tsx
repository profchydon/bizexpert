"use client";

import {
  AlertOctagon,
  AlertTriangle,
  CalendarCheck01,
  CreditCard02,
  SlashCircle01,
} from "@untitledui/icons";
import { Banner } from "@/components/application/alerts/banner";
import { Button } from "@/components/base/buttons/button";
import { FeaturedIcon } from "@/components/foundations/featured-icon/featured-icon";
import { LimitUsage } from "./LimitUsage";
import type { LimitUsageRow } from "./limitUsageRows";
import type { SubscriptionNotice } from "./subscriptionNotices";
import { canRetryPlanPayment } from "./subscriptionRedirect";
import { useCancelScheduledChange } from "./useCancelScheduledChange";
import { useRetryPlanPayment } from "./useRetryPlanPayment";

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs text-tertiary">{label}</p>
      <p className="mt-0.5 text-sm font-medium text-primary">{value}</p>
    </div>
  );
}

export function CurrentPlanSummary({
  name,
  tagline,
  total,
  working,
  renewLabel,
  renewValue,
  offices,
  usage,
  banner,
  companyId,
  txRef,
  onSettle,
  onResubscribe,
}: {
  name: string;
  tagline: string;
  total: string;
  working: string;
  renewLabel: string;
  renewValue: string;
  offices: string;
  usage: LimitUsageRow[];
  banner: SubscriptionNotice | null;
  companyId?: string;
  txRef?: string | null;
  onSettle: () => void;
  onResubscribe: () => void;
}) {
  const cancelChange = useCancelScheduledChange(companyId);
  const retryPayment = useRetryPlanPayment(companyId, txRef);
  const canceling = banner?.cta === "Cancel change";
  const ended = banner?.kind === "ended";
  const retrying = canRetryPlanPayment(
    banner?.kind === "pending" ? "pending_payment" : null,
    txRef ?? null,
  );
  const BannerIcon =
    banner?.kind === "ended"
      ? SlashCircle01
      : banner?.kind === "scheduled"
        ? CalendarCheck01
        : banner?.kind === "pending"
          ? AlertTriangle
          : AlertOctagon;
  return (
    <section className="rounded-2xl border border-secondary bg-primary p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-start gap-4">
          <FeaturedIcon
            icon={CreditCard02}
            size="lg"
            color="brand"
            theme="light"
          />
          <div className="min-w-0">
            <p className="text-xs font-semibold tracking-wide text-tertiary uppercase">
              Your plan
            </p>
            <h2 className="mt-1 text-xl font-semibold text-primary">{name}</h2>
            <p className="mt-1 text-sm text-tertiary">{tagline}</p>
          </div>
        </div>
        <div className="shrink-0 text-left sm:text-right">
          <p className="text-2xl font-semibold text-primary tabular-nums">
            {total}
          </p>
          <p className="text-xs text-tertiary">{working}</p>
        </div>
      </div>

      {banner && (
        <Banner
          className="mt-5"
          tone={banner.tone}
          icon={BannerIcon}
          title={banner.title}
          description={banner.description}
          action={
            retrying || banner.cta ? (
              <div className="flex flex-wrap gap-2">
                {retrying ? (
                  <Button
                    color="primary"
                    size="sm"
                    iconLeading={CreditCard02}
                    isLoading={retryPayment.isLoading}
                    onClick={retryPayment.retry}
                    data-testid="currentplansummary-button"
                  >
                    Retry payment
                  </Button>
                ) : null}
                {banner.cta ? (
                  <Button
                    color={ended ? "primary" : "secondary"}
                    size="sm"
                    iconLeading={ended ? CreditCard02 : undefined}
                    isLoading={canceling && cancelChange.isLoading}
                    onClick={
                      canceling
                        ? cancelChange.cancel
                        : ended
                          ? onResubscribe
                          : onSettle
                    }
                    data-testid="currentplansummary-button-2"
                  >
                    {banner.cta}
                  </Button>
                ) : null}
              </div>
            ) : undefined
          }
        />
      )}

      <div className="mt-5 h-px w-full bg-border-secondary" />
      <div className="mt-4 flex flex-wrap gap-x-10 gap-y-3">
        <Stat label={renewLabel} value={renewValue} />
        <Stat label="Offices" value={offices} />
      </div>
      <LimitUsage rows={usage} onUpgrade={onSettle} />
    </section>
  );
}
