"use client";

import { useState } from "react";
import { CheckCircle, ChevronDown, HelpCircle, Minus } from "@untitledui/icons";
import { Badge } from "@/components/base/badges/badges";
import { Tooltip, TooltipTrigger } from "@/components/base/tooltip/tooltip";
import { cx } from "@/utils/cx";
import type { CatalogPlan, PlanCatalog } from "./catalog";
import { ADDON_TOOLTIP, FEATURE_HINTS } from "./featureHints";
import { PlanComparisonCell } from "./PlanComparisonCell";
import { formatPlanRate } from "./subscriptionMoney";
import { baseRate, comparisonRowCount } from "./subscriptionView";
import { visibleComparisonGroups } from "./visibleComparison";

const COLS = "minmax(200px,2.2fr) repeat(4,minmax(120px,1fr))";
const STICKY = "sticky left-0 z-1";

export function PlanComparisonTable({
  catalog,
  currency,
}: {
  catalog: PlanCatalog;
  currency: string;
}) {
  const [open, setOpen] = useState(false);
  const visible = {
    ...catalog,
    groups: visibleComparisonGroups(catalog.groups),
  };
  const count = comparisonRowCount(visible);
  const hasAddon = visible.groups.some((group) =>
    group.features.some((feature) =>
      feature.cells.some((cell) => cell.kind === "addon"),
    ),
  );

  return (
    <div className="border-t border-secondary">
      <button
        type="button"
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
        className="flex w-full items-center justify-between gap-3 bg-secondary px-5 py-3.5 text-left transition hover:bg-secondary_hover"
      >
        <span className="flex items-center gap-2 text-sm font-semibold text-primary">
          Compare all features
          <span className="font-normal text-tertiary">
            {count} capabilities
          </span>
        </span>
        <ChevronDown
          className={cx(
            "size-4 shrink-0 text-fg-quaternary transition-transform",
            open && "rotate-180",
          )}
        />
      </button>
      {open && (
        <ComparisonBody
          catalog={visible}
          currency={currency}
          hasAddon={hasAddon}
        />
      )}
    </div>
  );
}

function ComparisonBody({
  catalog,
  currency,
  hasAddon,
}: {
  catalog: PlanCatalog;
  currency: string;
  hasAddon: boolean;
}) {
  return (
    <div className="border-t border-secondary bg-primary">
      <div className="max-h-[70vh] overflow-auto">
        <div className="min-w-[760px]">
          <div
            className="sticky top-0 z-2 grid gap-x-4 border-b border-secondary bg-primary px-5 pt-5 pb-4"
            style={{ gridTemplateColumns: COLS }}
          >
            <span
              className={cx(
                STICKY,
                "flex items-center bg-primary text-xs font-semibold tracking-wide text-quaternary uppercase",
              )}
            >
              Features
            </span>
            {catalog.plans.map((plan) => (
              <PlanHead key={plan.slug} plan={plan} currency={currency} />
            ))}
          </div>
          {catalog.groups.map((group, gi) => (
            <div key={group.key || group.name}>
              <div
                className={cx(
                  STICKY,
                  "flex min-h-14 items-center bg-primary px-5 text-sm font-semibold text-brand-secondary",
                  gi > 0 && "border-t border-secondary",
                )}
              >
                {group.name}
              </div>
              {group.features.map((feature, index) => {
                const rowBg = index % 2 === 0 ? "bg-secondary" : "bg-primary";
                return (
                  <div
                    key={feature.code}
                    className={cx("grid items-center gap-x-4 px-5 py-4", rowBg)}
                    style={{ gridTemplateColumns: COLS }}
                  >
                    <div
                      className={cx(
                        STICKY,
                        rowBg,
                        "flex items-center gap-1.5 text-sm text-secondary",
                      )}
                    >
                      {feature.name}
                      <Tooltip
                        title={FEATURE_HINTS[feature.code] || feature.name}
                        placement="top"
                      >
                        <TooltipTrigger className="shrink-0 cursor-pointer text-fg-quaternary transition hover:text-fg-quaternary_hover">
                          <HelpCircle className="size-3.5" />
                        </TooltipTrigger>
                      </Tooltip>
                    </div>
                    {catalog.plans.map((plan) => (
                      <div
                        key={plan.slug}
                        className="flex items-center justify-center text-center"
                      >
                        <PlanComparisonCell
                          cell={
                            feature.cells.find(
                              (cell) => cell.plan === plan.slug,
                            ) ?? {
                              plan: plan.slug,
                              kind: "excluded",
                              label: null,
                            }
                          }
                        />
                      </div>
                    ))}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-secondary px-5 py-4 text-xs text-tertiary">
        <span className="flex items-center gap-1.5">
          <CheckCircle className="size-4 text-fg-success-primary" /> Included
        </span>
        {hasAddon && (
          <span className="flex items-center gap-1.5">
            <Tooltip title={ADDON_TOOLTIP} placement="top">
              <TooltipTrigger className="cursor-default">
                <Badge color="brand" size="sm">
                  Add-on
                </Badge>
              </TooltipTrigger>
            </Tooltip>
            Paid module
          </span>
        )}
        <span className="flex items-center gap-1.5">
          <Minus className="size-4 text-fg-quaternary" /> Not included
        </span>
      </div>
    </div>
  );
}

function PlanHead({ plan, currency }: { plan: CatalogPlan; currency: string }) {
  const amount = baseRate(plan, currency);
  return (
    <div className="flex flex-col items-center gap-0.5 text-center">
      <span className="text-sm font-semibold text-primary">{plan.name}</span>
      <span className="text-xs text-tertiary tabular-nums">
        {amount === 0 ? "Free" : `${formatPlanRate(amount, currency)}/mo`}
      </span>
    </div>
  );
}
