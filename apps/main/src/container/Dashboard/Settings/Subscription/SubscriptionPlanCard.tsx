"use client";

import {
  CalendarCheck01,
  Check,
  CreditCard02,
  SwitchVertical01,
} from "@untitledui/icons";
import { Button } from "@/components/base/buttons/button";
import { DisabledWithTooltip } from "@/components/base/tooltip/disabled-with-tooltip";
import { cx } from "@/utils/cx";
import { UPGRADE_NEEDS_DEVICE } from "./featureHints";
import type { PlanChangeMode } from "./subscriptionView";

export function SubscriptionPlanCard({
  name,
  tagline,
  highlights,
  priceLabel,
  priceSuffix,
  estimateLabel,
  isCurrent,
  isScheduled,
  isPopular,
  mode,
  upgradeBlocked,
  onSelect,
}: {
  name: string;
  tagline: string;
  highlights: string[];
  priceLabel: string;
  priceSuffix: string;
  estimateLabel: string | null;
  isCurrent: boolean;
  isScheduled: boolean;
  isPopular: boolean;
  mode: PlanChangeMode;
  upgradeBlocked: boolean;
  onSelect: () => void;
}) {
  const isUpgrade = mode === "upgrade";
  const locked = isCurrent || isScheduled;
  const disabled = locked || upgradeBlocked;
  const ribbon = isCurrent
    ? "Current"
    : isScheduled
      ? "Scheduled"
      : isPopular
        ? "Most popular"
        : null;
  const label = isCurrent
    ? "Current plan"
    : isScheduled
      ? "Scheduled"
      : isUpgrade
        ? `Upgrade to ${name}`
        : `Switch to ${name}`;
  const icon = isScheduled
    ? CalendarCheck01
    : isCurrent
      ? Check
      : isUpgrade
        ? CreditCard02
        : SwitchVertical01;
  const primary = !locked && isPopular && isUpgrade;

  return (
    <div
      className={cx(
        "relative flex flex-col gap-4 rounded-2xl border p-5",
        isCurrent
          ? "border-brand bg-brand-primary"
          : isPopular
            ? "border-brand-200 bg-brand-25"
            : "border-secondary bg-primary",
      )}
    >
      {ribbon && (
        <span
          className={cx(
            "absolute -top-2.5 left-5 rounded-full px-2.5 py-0.5 text-[11px] font-semibold",
            isScheduled
              ? "bg-secondary text-secondary"
              : "bg-brand-solid text-fg-white",
          )}
        >
          {ribbon}
        </span>
      )}
      <div>
        <p className="text-sm font-bold text-primary">{name}</p>
        <p className="mt-1">
          <span className="text-xl font-bold text-brand-secondary">
            {priceLabel}
          </span>
          {priceSuffix && (
            <span className="ml-1 text-xs text-tertiary">{priceSuffix}</span>
          )}
        </p>
        {estimateLabel && (
          <p className="mt-0.5 text-xs text-tertiary tabular-nums">
            {estimateLabel}
          </p>
        )}
        <p className="mt-2 text-xs leading-relaxed text-tertiary">{tagline}</p>
      </div>
      <ul className="flex flex-col gap-1.5">
        {highlights.map((feature) => (
          <li
            key={feature}
            className="flex items-start gap-2 text-xs text-secondary"
          >
            <Check className="mt-0.5 size-3 shrink-0 text-brand-secondary" />
            {feature}
          </li>
        ))}
      </ul>
      <div className="mt-auto pt-2">
        <DisabledWithTooltip
          isDisabled={upgradeBlocked && !locked}
          reason={UPGRADE_NEEDS_DEVICE}
          triggerClassName="w-full"
        >
          <Button
            color={primary ? "primary" : "secondary"}
            size="md"
            className="w-full"
            isDisabled={disabled}
            iconLeading={icon}
            onClick={disabled ? undefined : onSelect}
            data-testid="subscriptionplancard-button"
          >
            {label}
          </Button>
        </DisabledWithTooltip>
      </div>
    </div>
  );
}
