import { formatNgn } from "@/lib/bizexpert/format";
import type { Customer } from "@/types/bizexpert";

type Props = {
  customer: Customer;
};

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-gray-500">{label}</dt>
      <dd className="mt-1 font-medium text-gray-900">{value}</dd>
    </div>
  );
}

export function CustomerStats({ customer }: Props) {
  return (
    <dl className="grid grid-cols-2 gap-4 text-sm sm:grid-cols-5">
      <Stat label="Credit limit" value={formatNgn(customer.creditLimit)} />
      <Stat
        label="Outstanding"
        value={formatNgn(customer.outstandingBalance)}
      />
      <Stat label="Wallet" value={formatNgn(customer.walletBalance)} />
      <Stat label="Total spent" value={formatNgn(customer.totalSpent)} />
      <Stat label="Sales" value={String(customer.saleCount ?? 0)} />
    </dl>
  );
}
