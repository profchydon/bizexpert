"use client";

import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useActiveWorkspace } from "@/hooks/useActiveWorkspace";
import { appendEntityWorkspaceParam } from "@/utils/workspace/activeWorkspace";
import routes from "@/routes";
import { useScopedViewNavigation } from "@/hooks/useViewNavigation";

type Props = {
  orderId: string;
  orderNumber: string;
  employeeCount: number;
  href?: string;
};

const OrderNumberNavigateButton = ({
  orderId,
  orderNumber,
  employeeCount,
  href,
}: Props) => {
  const { activeEntityId } = useActiveWorkspace();
  const { view, isViewLoading } = useScopedViewNavigation();
  const loading = isViewLoading(orderId);
  const count = employeeCount ?? 0;
  const orderHref =
    href ??
    appendEntityWorkspaceParam(
      `${routes.EQUIP_EMPLOYEE_ORDERS}/${orderId}`,
      activeEntityId,
    );

  return (
    <div className="flex flex-col">
      <button
        type="button"
        onClick={() => view(orderHref, orderId)}
        className={cn(
          "inline-flex items-center gap-1.5 text-left text-sm font-medium whitespace-nowrap text-primary-700 underline underline-offset-2 transition-colors hover:text-primary-800",
          loading && "pointer-events-none opacity-70",
        )}
        aria-busy={loading}
        disabled={loading}
        data-testid="ordernumbernavigatebutton-button"
      >
        {loading ? (
          <Loader2 className="size-3.5 shrink-0 animate-spin" aria-hidden />
        ) : null}
        {orderNumber}
      </button>
      <span className="text-xs whitespace-nowrap text-gray-500">
        {count} {count === 1 ? "employee" : "employees"}
      </span>
    </div>
  );
};

export default OrderNumberNavigateButton;
