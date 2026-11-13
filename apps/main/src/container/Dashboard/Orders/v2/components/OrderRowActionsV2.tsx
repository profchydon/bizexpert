import React from "react";
import { Eye, Loader2, MoreVertical, Receipt, SquarePen } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import routes from "@/routes";
import { useScopedViewNavigation } from "@/hooks/useViewNavigation";
import { IOrder } from "@/types/orders";
import {
  getSignatureActionLabel,
  hasTransactionReference,
  isSignatureActionAvailable,
  isSignatureCurrentlyRequired,
} from "./orderRowActionRules";

interface Props {
  order: IOrder;
  viewHref: string;
  transactionViewHref?: string;
}

const itemClass =
  "flex cursor-pointer items-center gap-2 whitespace-nowrap rounded-none px-4 py-2.5 text-sm font-semibold";

const OrderRowActionsV2: React.FC<Props> = ({
  order,
  viewHref,
  transactionViewHref,
}) => {
  const { view, isViewLoading, isPending } = useScopedViewNavigation();
  const orderKey = `order-${order.id}`;
  const transactionKey = `transaction-${order.id}`;
  const signatureKey = `signature-${order.id}`;
  const showTransaction =
    Boolean(transactionViewHref) && hasTransactionReference(order);
  const showSignature = isSignatureActionAvailable(order);
  const signatureHref = `${routes.EQUIP_EMPLOYEE_ORDERS}/${order.id}?signature_requested=${isSignatureCurrentlyRequired(order)}`;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="size-8 rounded-md p-0 text-gray-500 hover:bg-gray-50 data-[state=open]:bg-gray-50"
          isLoading={isPending}
          data-testid="orderrowactionsv2-button"
        >
          <span className="sr-only">Open menu</span>
          <MoreVertical className="size-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-64 overflow-hidden rounded-lg border-gray-200 p-0 shadow-lg"
      >
        <DropdownMenuItem
          disabled={isViewLoading(orderKey)}
          onClick={() => view(viewHref, orderKey)}
          className={cn(itemClass, "text-gray-700 focus:text-gray-700")}
        >
          {isViewLoading(orderKey) ? (
            <Loader2 className="size-4 shrink-0 animate-spin text-gray-500" />
          ) : (
            <Eye className="size-4 shrink-0 text-gray-500" />
          )}
          View order
        </DropdownMenuItem>
        {showTransaction && transactionViewHref && (
          <DropdownMenuItem
            disabled={isViewLoading(transactionKey)}
            onClick={() => view(transactionViewHref, transactionKey)}
            className={cn(itemClass, "text-gray-700 focus:text-gray-700")}
          >
            {isViewLoading(transactionKey) ? (
              <Loader2 className="size-4 shrink-0 animate-spin text-gray-500" />
            ) : (
              <Receipt className="size-4 shrink-0 text-gray-500" />
            )}
            View transaction
          </DropdownMenuItem>
        )}
        {showSignature && (
          <DropdownMenuItem
            disabled={isViewLoading(signatureKey)}
            onClick={() => view(signatureHref, signatureKey)}
            className={cn(itemClass, "text-gray-900 focus:text-gray-900")}
          >
            {isViewLoading(signatureKey) ? (
              <Loader2 className="size-4 shrink-0 animate-spin text-gray-500" />
            ) : (
              <SquarePen className="size-4 shrink-0 text-gray-500" />
            )}
            {getSignatureActionLabel(order)}
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default OrderRowActionsV2;
