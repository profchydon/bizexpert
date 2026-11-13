"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { IAllTransaction } from "@/types/transactions";
import CountryFlag from "@/container/Dashboard/Orders/CustomDeviceRequests/components/CountryFlag";
import { MoreVertical } from "lucide-react";
import routes from "@/routes";
import { useScopedViewNavigation } from "@/hooks/useViewNavigation";

const TransactionsHistoryActions: React.FC<{
  item: IAllTransaction;
  onDownload: () => void;
  onCancel: () => void;
}> = ({ item }) => {
  const { view, isViewLoading, isPending } = useScopedViewNavigation();
  const orderDetails = (item?.multiple_order_details || []).filter((detail) =>
    Boolean(detail?.order_id),
  );
  const hasOrderDetails = orderDetails.length > 0;
  const hasSingleOrder = Boolean(item?.order_id);
  const canNavigateToOrder = hasOrderDetails || hasSingleOrder;

  const navigateToOrder = (orderId?: string | null) => {
    if (!orderId) {
      return;
    }
    view(`${routes.EQUIP_EMPLOYEE_ORDERS}/${orderId}`, orderId);
  };

  if (item?.status === "Pending") {
    return (
      <div className="flex flex-row items-center gap-3">
        <a
          href={item.payment_link}
          className="text-gray-600 font-semibold cursor-pointer"
        >
          Retry
        </a>
      </div>
    );
  }

  return (
    <div className="flex flex-row items-center gap-3">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="h-8 w-8 p-0 data-[state=open]:bg-muted"
            disabled={!canNavigateToOrder}
            isLoading={isPending}
            data-testid="transactionshistorytableactions-button"
          >
            <span className="sr-only">Open menu</span>
            <MoreVertical className="h-4 w-4 text-gray-500" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="min-w-[180px]">
          {hasOrderDetails ? (
            orderDetails.map((detail, index) => (
              <DropdownMenuItem
                key={`${detail.order_id}-${detail.country_code}-${index}`}
                onClick={() => navigateToOrder(detail.order_id)}
                disabled={Boolean(
                  detail.order_id && isViewLoading(detail.order_id),
                )}
                className="flex items-center gap-2 cursor-pointer"
              >
                <CountryFlag
                  country={detail.country_name || "United States"}
                  code={detail.country_code || undefined}
                />
                <span>{detail.country_name || "View order"}</span>
              </DropdownMenuItem>
            ))
          ) : (
            <DropdownMenuItem
              onClick={() => navigateToOrder(item?.order_id)}
              disabled={!hasSingleOrder}
              className="cursor-pointer"
            >
              View order
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default TransactionsHistoryActions;
