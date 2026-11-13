"use client";

import Link from "next/link";
import { PiggyBank01 } from "@untitledui/icons";
import { FeaturedIcon } from "@/components/foundations/featured-icon/featured-icon";
import { cx } from "@/utils/cx";
import formatAmount from "@/utils/formatAmount";
import {
  SUBSCRIPTION_SETTINGS_HREF,
  subscriberSavingCopy,
} from "@/lib/pricing/subscriberSaving";

interface PlanSavingsCalloutProps {
  variant: "compact" | "card";
  amount: number;
  currencySymbol: string;
  isSubscribed: boolean;
  showCompareLink?: boolean;
  className?: string;
}

export function PlanSavingsCallout({
  variant,
  amount,
  currencySymbol,
  isSubscribed,
  showCompareLink = false,
  className,
}: PlanSavingsCalloutProps) {
  if (!Number.isFinite(amount) || amount <= 0) {
    return null;
  }

  const money = `${currencySymbol}${formatAmount(amount.toString())}`;
  const prefix = subscriberSavingCopy(isSubscribed);
  const upgradeLink = (linkClass: string) => (
    <Link
      href={SUBSCRIPTION_SETTINGS_HREF}
      className={cx("font-semibold underline underline-offset-2", linkClass)}
    >
      Upgrade plan
    </Link>
  );

  if (variant === "compact") {
    return (
      <div className={className} data-testid="plan-savings-callout">
        <p className="flex items-center gap-1.5 text-xs text-success-700">
          <PiggyBank01 className="size-4 shrink-0" />
          <span>
            {prefix} <span className="font-semibold">{money}</span> on this
            order with Preferred Pricing.
          </span>
        </p>
        {!isSubscribed && showCompareLink ? (
          <span className="mt-1 block">
            {upgradeLink("text-xs text-brand-secondary")}
          </span>
        ) : null}
      </div>
    );
  }

  return (
    <div
      className={cx(
        "flex items-center gap-3 rounded-xl border border-success-200 bg-success-50 p-3.5",
        className,
      )}
      data-testid="plan-savings-callout"
    >
      <FeaturedIcon
        icon={PiggyBank01}
        size="sm"
        color="success"
        theme="light"
        className="!bg-success-solid !text-fg-white"
      />
      <div className="min-w-0 flex-1">
        <p className="text-sm text-success-800">
          {prefix} <span className="font-bold tabular-nums">{money}</span> on
          this order with Preferred Pricing.
        </p>
        {!isSubscribed ? (
          <p className="mt-0.5 text-xs text-success-700">
            {upgradeLink("text-success-700")}
          </p>
        ) : null}
      </div>
    </div>
  );
}
