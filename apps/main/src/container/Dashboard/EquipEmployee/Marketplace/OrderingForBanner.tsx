"use client";

import { cn } from "@/lib/utils";
import { flagByCode } from "@/app/dashboard/NavBar/flagByCode";
import { useOrderingFor } from "./useOrderingFor";

const OrderingForBanner = ({ className }: { className?: string }) => {
  const { visible, name, currency, countryCode } = useOrderingFor();
  const Flag = flagByCode(countryCode);

  if (!visible) return null;

  return (
    <div
      className={cn(
        "flex items-center gap-3 rounded-xl border border-brand-200 bg-brand-50 px-4 py-3",
        className,
      )}
    >
      {Flag ? (
        <Flag className="size-6 shrink-0 rounded-full object-cover ring-1 ring-secondary" />
      ) : null}
      <p className="min-w-0 truncate text-sm text-secondary">
        <span className="text-brand-secondary">Ordering for</span>{" "}
        <span className="font-semibold text-primary">{name}</span>
        {currency ? ` · Billed in ${currency}` : null}
      </p>
    </div>
  );
};

export default OrderingForBanner;
