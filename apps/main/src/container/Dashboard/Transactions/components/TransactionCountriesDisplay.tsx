"use client";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import CountryFlag from "@/container/Dashboard/Orders/CustomDeviceRequests/components/CountryFlag";
import { ITransactionOrderDetail } from "@/types/transactions";
import { cn } from "@/lib/utils";

interface Props {
  orderDetails?: ITransactionOrderDetail[];
  className?: string;
}

const MAX_VISIBLE_FLAGS = 3;

const TransactionCountriesDisplay = ({ orderDetails, className }: Props) => {
  const details = (orderDetails || []).filter(
    (detail) => detail?.country_code || detail?.country_name,
  );

  const aggregated = details.reduce<
    { country: string; code?: string; total: number }[]
  >((acc, detail) => {
    const country = detail.country_name || "United States";
    const existing = acc.find((entry) => entry.country === country);

    if (existing) {
      existing.total += 1;
      return acc;
    }

    acc.push({
      country,
      code: detail.country_code || undefined,
      total: 1,
    });
    return acc;
  }, []);

  if (!aggregated.length) {
    return <span className={cn("text-sm text-gray-500", className)}>-</span>;
  }

  const visibleCountries = aggregated.slice(0, MAX_VISIBLE_FLAGS);
  const remainingCount = Math.max(
    aggregated.length - visibleCountries.length,
    0,
  );

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className={cn("flex items-center gap-2", className)}>
            <span className="text-sm font-semibold text-gray-900">
              {aggregated.length}
            </span>
            <div className="flex -space-x-1.5">
              {visibleCountries.map(({ country, code }) => (
                <span
                  key={`${country}-${code || "none"}`}
                  className="relative flex size-5 shrink-0 items-center justify-center overflow-hidden rounded-full ring-2 ring-white"
                >
                  <CountryFlag country={country} code={code} />
                </span>
              ))}
              {remainingCount > 0 ? (
                <span className="relative flex size-5 shrink-0 items-center justify-center rounded-full bg-gray-100 text-gray-600 ring-2 ring-white">
                  <span className="text-[10px] font-semibold tabular-nums">
                    +{remainingCount}
                  </span>
                </span>
              ) : null}
            </div>
          </div>
        </TooltipTrigger>
        <TooltipContent side="top" className="p-2">
          <div className="flex flex-col gap-1.5 py-0.5">
            {aggregated.map(({ country, code, total }) => (
              <div
                key={`${country}-${code || "none"}`}
                className="flex items-center gap-2"
              >
                <span className="relative flex size-4 shrink-0 items-center justify-center overflow-hidden rounded-full">
                  <CountryFlag country={country} code={code} />
                </span>
                <span className="whitespace-nowrap text-xs text-white">
                  {country}
                </span>
                <span className="text-xs text-gray-300 tabular-nums">
                  ({total}x)
                </span>
              </div>
            ))}
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default TransactionCountriesDisplay;
