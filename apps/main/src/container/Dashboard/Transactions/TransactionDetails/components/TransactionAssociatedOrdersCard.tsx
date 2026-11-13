"use client";

import { ArrowRight, Loader2 } from "lucide-react";
import { TableCard } from "@/components/application/table/table";
import CountryFlag from "@/container/Dashboard/Orders/CustomDeviceRequests/components/CountryFlag";
import {
  ITransactionDetail,
  ITransactionOrderDetail,
} from "@/types/transactions";
import routes from "@/routes";
import { useScopedViewNavigation } from "@/hooks/useViewNavigation";
import { cn } from "@/lib/utils";
import { TransactionTypeBadge } from "../../components/TransactionTypeBadges";

interface Props {
  transaction?: ITransactionDetail;
}

type RowProps = {
  detail: ITransactionOrderDetail;
  index: number;
  transactionId?: string;
  view: ReturnType<typeof useScopedViewNavigation>["view"];
  isViewLoading: ReturnType<typeof useScopedViewNavigation>["isViewLoading"];
};

const itemLabel = (count: number) => (count === 1 ? "item" : "items");

const AssociatedOrderRow = ({
  detail,
  index,
  transactionId,
  view,
  isViewLoading,
}: RowProps) => {
  const scopeKey = `${detail.order_id}-${index}`;
  const loading = isViewLoading(scopeKey);
  const href = `${routes.ORDERS}/${detail.order_id}?transaction_id=${transactionId}`;
  const quantity = detail.quantity ?? 0;

  return (
    <button
      type="button"
      className={cn(
        "flex w-full items-center justify-between gap-4 px-6 py-4 text-left transition hover:bg-secondary",
        loading && "pointer-events-none bg-secondary/80",
      )}
      aria-busy={loading}
      disabled={loading}
      onClick={() => view(href, scopeKey)}
      data-testid="transactionassociatedorderscard-row"
    >
      <div className="flex min-w-0 flex-col">
        <span className="inline-flex items-center gap-2 truncate text-sm font-semibold text-primary tabular-nums">
          {loading ? (
            <Loader2
              className="size-4 shrink-0 animate-spin text-brand-secondary"
              aria-hidden
            />
          ) : null}
          {detail.order_number || "-"}
        </span>
        <span className="mt-0.5 flex items-center gap-1.5 text-xs text-tertiary">
          <CountryFlag
            country={detail.country_name || "United States"}
            code={detail.country_code || undefined}
          />
          {detail.country_name || "-"} · {quantity} {itemLabel(quantity)}
        </span>
      </div>
      <div className="flex items-center gap-3">
        <TransactionTypeBadge type={detail.type} />
        {loading ? (
          <Loader2
            className="size-4 animate-spin text-brand-secondary"
            aria-hidden
          />
        ) : (
          <ArrowRight className="size-4 text-fg-quaternary" />
        )}
      </div>
    </button>
  );
};

const TransactionAssociatedOrdersCard = ({ transaction }: Props) => {
  const { view, isViewLoading } = useScopedViewNavigation();
  const orderDetails = (transaction?.multiple_order_details ||
    []) as ITransactionOrderDetail[];
  const hasAssociatedOrders =
    orderDetails.length > 0 || Boolean(transaction?.order_id);
  const fallbackOrder = {
    order_id: transaction?.order_id || "",
    order_number: transaction?.order_number || "-",
    quantity: transaction?.number_of_equipments || 0,
    country_name: "-",
    country_code: "",
    country_id: "",
    type: undefined,
  } as ITransactionOrderDetail;
  const orders = orderDetails.length > 0 ? orderDetails : [fallbackOrder];
  const totalOrders = orderDetails.length || (transaction?.order_id ? 1 : 0);
  const orderLabel = totalOrders === 1 ? "order" : "orders";

  if (!hasAssociatedOrders) {
    return null;
  }

  return (
    <TableCard.Root>
      <TableCard.Header
        title="Associated orders"
        description="Orders fulfilled under this transaction. Click any to open its detail page."
        badge={`${totalOrders} ${orderLabel}`}
      />
      <ul className="flex flex-col divide-y divide-border-secondary">
        {orders.map((detail, index) => (
          <li key={`${detail.order_id}-${index}`}>
            <AssociatedOrderRow
              detail={detail}
              index={index}
              transactionId={transaction?.id}
              view={view}
              isViewLoading={isViewLoading}
            />
          </li>
        ))}
      </ul>
    </TableCard.Root>
  );
};

export default TransactionAssociatedOrdersCard;
