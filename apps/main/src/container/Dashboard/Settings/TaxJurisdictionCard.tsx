"use client";

import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from "@/components/ui/tooltip";
import { useTaxContext } from "@/hooks/useTaxContext";
import { useBillingEntityDisplay } from "./useBillingEntityDisplay";
import { useTransitionRouter } from "@/hooks/useTransitionRouter";
import { ZERO_TAX } from "@/lib/tax/config";
import { ratePercent } from "@/lib/tax/math";
import routes from "@/routes";

const JURISDICTION_TOOLTIP =
  "Tax rates follow your billing entity's registered country.";

// A zero-rate reads as "No tax (0%)"; otherwise "VAT (20%)" style.
function taxValue(label: string, rate: number): string {
  return rate === 0 ? "No tax (0%)" : `${label} (${ratePercent(rate)})`;
}

function RateRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 px-4 py-3">
      <span className="text-sm text-gray-600">{label}</span>
      <span className="text-sm font-medium text-gray-900">{value}</span>
    </div>
  );
}

// Read-only mirror of the rates Rayda bills this company under. Everything comes from the billing
// entity's registered country, which only Rayda admins can change.
export function TaxJurisdictionCard() {
  const { config, isLoading } = useTaxContext();
  const billingEntity = useBillingEntityDisplay();
  const { push, isPending } = useTransitionRouter();
  const hasJurisdiction = config.code !== ZERO_TAX.code;

  return (
    <section className="flex flex-col gap-6 lg:flex-row lg:items-start">
      <div className="flex shrink-0 flex-col gap-2 lg:w-[280px]">
        <h2 className="text-sm font-semibold text-gray-900">
          Tax jurisdiction
        </h2>
        <p className="text-sm text-gray-600">{JURISDICTION_TOOLTIP}</p>
      </div>

      <div className="min-w-0 flex-1 rounded-xl border border-gray-200 bg-white p-6">
        <div className="flex flex-col divide-y divide-gray-200 overflow-hidden rounded-lg border border-gray-200">
          <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3">
            <span className="text-sm text-gray-600">Billing entity</span>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-900">
                {billingEntity.isLoading ? "—" : billingEntity.name}
              </span>
              {billingEntity.currencyCode ? (
                <span className="text-sm font-medium text-gray-700">
                  {billingEntity.currencyCode}
                </span>
              ) : null}
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger className="cursor-default">
                    <span className="flex size-max items-center gap-1.5 whitespace-nowrap rounded-full bg-gray-50 py-0.5 pl-1 pr-2.5 text-sm font-medium text-gray-700 ring-1 ring-inset ring-gray-200">
                      {hasJurisdiction && (
                        <img
                          src={`https://www.untitledui.com/images/flags/${config.code.toUpperCase()}.svg`}
                          className="size-4 max-w-none rounded-full"
                          alt={`${config.code.toUpperCase()} flag`}
                        />
                      )}
                      {config.countryLabel}
                    </span>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{JURISDICTION_TOOLTIP}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>

          <RateRow
            label="Device tax"
            value={
              isLoading ? "—" : taxValue(config.deviceLabel, config.deviceRate)
            }
          />
          <RateRow
            label="Service tax"
            value={
              isLoading
                ? "—"
                : taxValue(config.serviceLabel, config.serviceRate)
            }
          />
        </div>

        <p className="mt-4 text-sm text-gray-600">
          {"Billing arrangements are set when a subsidiary is created, in "}
          <Button
            type="button"
            variant="link"
            isLoading={isPending}
            className="h-auto p-0 text-sm font-semibold text-primary-700 hover:text-primary-800"
            onClick={() => push(routes.ACCOUNTS)}
            data-testid="taxjurisdictioncard-button"
          >
            Account management
          </Button>
          {"."}
        </p>
      </div>
    </section>
  );
}
