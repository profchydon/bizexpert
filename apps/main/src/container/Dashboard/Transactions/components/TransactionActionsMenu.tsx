"use client";

import { MoreVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { IAllTransaction } from "@/types/transactions";
import { useListDetailHref } from "@/hooks/tableListLocation";
import routes from "@/routes";
import { useViewNavigation } from "@/hooks/useViewNavigation";

interface Props {
  item: IAllTransaction;
}

const TransactionActionsMenu = ({ item }: Props) => {
  const { view, isPending } = useViewNavigation();
  const viewHref = useListDetailHref(routes.TRANSACTION_DETAIL(item.id));

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="h-8 w-8 p-0 data-[state=open]:bg-muted"
          isLoading={isPending}
          data-testid="transactionactionsmenu-button"
        >
          <span className="sr-only">Open transaction menu</span>
          <MoreVertical className="h-4 w-4 text-gray-500" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="min-w-[220px]">
        <DropdownMenuItem
          className="cursor-pointer"
          onClick={() => view(viewHref)}
        >
          View transaction
        </DropdownMenuItem>

        {item.status === "Pending" && item.payment_link ? (
          <DropdownMenuItem asChild>
            <a
              href={item.payment_link}
              target="_blank"
              rel="noreferrer"
              className="cursor-pointer"
            >
              Retry payment
            </a>
          </DropdownMenuItem>
        ) : null}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default TransactionActionsMenu;
