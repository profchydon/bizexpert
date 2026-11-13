import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import PageHeader from "@/components/PageHeader";
import { useListReturnHref } from "@/hooks/useTablePageQuery";
import routes from "@/routes";
import { IOrder } from "@/types/orders";

interface Props {
  order: IOrder;
  transactionId?: string | null;
  resolvedTransactionId?: string | null;
}

const OrderDetailHeaderV2: React.FC<Props> = ({
  order,
  transactionId,
  resolvedTransactionId,
}) => {
  const router = useRouter();
  const ordersHref = useListReturnHref(routes.ORDERS);
  const transactionsHref = useListReturnHref(routes.TRANSACTIONS);

  const breadCrumbs = transactionId
    ? [
        <Link key="transactions" href={transactionsHref}>
          Transactions report
        </Link>,
        <Link
          key="transaction-detail"
          href={routes.TRANSACTION_DETAIL(transactionId)}
        >
          Transaction details
        </Link>,
        order.order_number,
      ]
    : [
        <Link key="orders" href={ordersHref}>
          Orders
        </Link>,
        order.order_number,
      ];

  return (
    <PageHeader
      pageTitle={order.order_number}
      pageDescription="View detailed information for this order"
      breadCrumbs={breadCrumbs}
    >
      {resolvedTransactionId ? (
        <Button
          variant="outline"
          className="gap-2"
          onClick={() =>
            router.push(
              routes.TRANSACTION_DETAIL(String(resolvedTransactionId)),
            )
          }
          data-testid="orderdetailheaderv2-button"
        >
          View transaction
          <ArrowUpRight className="size-4" />
        </Button>
      ) : null}
    </PageHeader>
  );
};

export default OrderDetailHeaderV2;
