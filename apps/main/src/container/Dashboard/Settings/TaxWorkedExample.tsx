"use client";

import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { useTaxContext, type TaxDisplayMode } from "@/hooks/useTaxContext";
import { summaryTaxLabel } from "@/lib/tax/display";
import { computeTaxBreakdown, grossUp } from "@/lib/tax/math";
import { currencySymbol } from "@/utils/currencySymbol";
import formatAmount from "@/utils/formatAmount";
import { useBillingEntityDisplay } from "./useBillingEntityDisplay";

// Sample order used to prove both display modes reach the same total.
const DEVICE_NET = 1000;
const SERVICE_NET = 275;

function Row({
  label,
  value,
  bold,
}: {
  label: string;
  value: string;
  bold?: boolean;
}) {
  const weight = bold ? "font-semibold text-gray-900" : "text-gray-700";
  return (
    <div className="flex items-center justify-between gap-4 text-sm">
      <span className={weight}>{label}</span>
      <span className={cn("tabular-nums", weight)}>{value}</span>
    </div>
  );
}

function PanelHeader({ title, active }: { title: string; active: boolean }) {
  return (
    <div className="flex items-center justify-between gap-2">
      <h4 className="text-sm font-semibold text-gray-900">{title}</h4>
      {active && (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger className="cursor-default">
              <span className="flex size-max items-center whitespace-nowrap rounded-full bg-primary-50 px-2 py-0.5 text-xs font-medium text-primary-700 ring-1 ring-inset ring-primary-200">
                Your view
              </span>
            </TooltipTrigger>
            <TooltipContent>
              <p>This matches your current tax display setting.</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
    </div>
  );
}

function panelClass(active: boolean) {
  return cn(
    "flex flex-col gap-3 rounded-xl border p-5",
    active
      ? "border-primary-600 bg-primary-50 ring-1 ring-primary-600"
      : "border-gray-200 bg-white",
  );
}

// Worked example that proves both modes reach the same total. The active panel and "Your view" badge
// follow the draft display mode passed in, so a radio selection previews before it is saved. Tax
// figures stay live against the previewed jurisdiction config from the shared tax context.
export function TaxWorkedExample({ mode }: { mode: TaxDisplayMode }) {
  const ctx = useTaxContext();
  const billingEntity = useBillingEntityDisplay();
  const breakdown = computeTaxBreakdown(DEVICE_NET, SERVICE_NET, ctx.config);
  const isZeroTax = ctx.config.deviceRate === 0 && ctx.config.serviceRate === 0;

  const moneySymbol = currencySymbol(billingEntity.currencyCode);
  const formatMoney = (val: number) =>
    `${moneySymbol}${formatAmount(val.toString())}`;
  const total = formatMoney(breakdown.totalWithTax);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <h3 className="text-sm font-semibold text-gray-900">Example</h3>
        <p className="text-sm text-gray-600">
          Both options charge the same total.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className={panelClass(mode === "inclusive")}>
          <PanelHeader title="Tax-inclusive" active={mode === "inclusive"} />
          <Row
            label="Device price"
            value={formatMoney(grossUp(DEVICE_NET, ctx.config.deviceRate))}
          />
          <Row
            label="Service fees"
            value={formatMoney(grossUp(SERVICE_NET, ctx.config.serviceRate))}
          />
          <div className="h-px w-full bg-gray-200" />
          <Row label="Total" value={total} bold />
          <p className="text-xs text-gray-600">{`Includes ${summaryTaxLabel(ctx.config)}: ${formatMoney(breakdown.taxTotal)}`}</p>
        </div>

        <div className={panelClass(mode === "at-payment")}>
          <PanelHeader title="Tax at payment" active={mode === "at-payment"} />
          <Row label="Device price" value={formatMoney(DEVICE_NET)} />
          <Row label="Service fees" value={formatMoney(SERVICE_NET)} />
          <Row
            label={summaryTaxLabel(ctx.config)}
            value={formatMoney(breakdown.taxTotal)}
          />
          <div className="h-px w-full bg-gray-200" />
          <Row label="Total" value={total} bold />
        </div>
      </div>

      {isZeroTax && (
        <p className="text-sm text-gray-600">
          No tax applies in this jurisdiction.
        </p>
      )}
    </div>
  );
}
