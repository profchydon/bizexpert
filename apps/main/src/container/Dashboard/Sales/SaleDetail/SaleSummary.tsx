import type { ReactNode } from "react";
import { format } from "date-fns";
import { formatNgn } from "@/lib/bizexpert/format";
import type { Sale } from "@/types/bizexpert";
import { SalePaymentBadge, SaleStatusBadge } from "../saleBadges";
import { formatSaleSource } from "../saleFilterOptions";
import { saleOutstanding, salePaidTotal } from "../saleTotals";

type Props = {
  sale: Sale;
};

function Stat({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div>
      <dt className="text-gray-500">{label}</dt>
      <dd className="mt-1 font-medium text-gray-900">{value}</dd>
    </div>
  );
}

export function SaleSummary({ sale }: Props) {
  return (
    <dl className="grid grid-cols-2 gap-4 text-sm sm:grid-cols-4">
      <Stat label="Status" value={<SaleStatusBadge status={sale.status} />} />
      <Stat
        label="Payment"
        value={<SalePaymentBadge status={sale.paymentStatus} />}
      />
      <Stat label="Source" value={formatSaleSource(sale.source)} />
      <Stat
        label="Date"
        value={format(new Date(sale.createdAt), "d MMM yyyy HH:mm")}
      />
      <Stat label="Subtotal" value={formatNgn(sale.subtotal)} />
      <Stat label="Discount" value={formatNgn(sale.discountAmount)} />
      <Stat label="Total" value={formatNgn(sale.totalAmount)} />
      <Stat label="Paid" value={formatNgn(salePaidTotal(sale))} />
      <Stat label="Outstanding" value={formatNgn(saleOutstanding(sale))} />
      <Stat label="Store" value={sale.location?.name ?? "—"} />
      <Stat label="Customer" value={sale.customerName || "Walk-in"} />
      <Stat label="Notes" value={sale.notes || "—"} />
    </dl>
  );
}
