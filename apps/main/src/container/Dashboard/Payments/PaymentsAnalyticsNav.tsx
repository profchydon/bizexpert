"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import routes from "@/routes";

const TABS = [
  { href: routes.PAYMENTS, label: "Payments" },
  { href: routes.PAYMENTS_TRANSACTIONS, label: "Transactions" },
  { href: routes.PAYMENTS_CASHFLOW, label: "Cashflow" },
  { href: routes.PAYMENTS_CUSTOMERS, label: "Customer analytics" },
];

export function PaymentsAnalyticsNav() {
  const pathname = usePathname();
  return (
    <div className="flex flex-wrap gap-2">
      {TABS.map((tab) => {
        const active = pathname === tab.href;
        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={cn(
              "rounded-lg px-3 py-2 text-sm font-semibold ring-1 ring-inset",
              active
                ? "bg-primary-50 text-primary-700 ring-primary-200"
                : "bg-white text-gray-700 ring-gray-200 hover:bg-gray-50",
            )}
          >
            {tab.label}
          </Link>
        );
      })}
    </div>
  );
}
