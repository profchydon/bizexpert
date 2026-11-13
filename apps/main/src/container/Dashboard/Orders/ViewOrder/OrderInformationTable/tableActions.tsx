"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ISubOrder } from "@/types/orders";
import { Eye, MoreVertical, ShieldCheck, XCircle } from "lucide-react";
import { useViewNavigation } from "@/hooks/useViewNavigation";
import { subOrderCanCancel } from "@/utils/cancellationEligibility";

const OrderInformationTableActions: React.FC<{
  item?: ISubOrder;
  onView?: () => void;
  viewHref?: string;
  onRequestCancel?: () => void;
  onVerifyAddress?: () => void;
  isVerifyAddressDisabled?: boolean;
  orderType?: string;
  orderStatus?: string;
}> = ({
  item,
  onView,
  viewHref,
  onRequestCancel,
  onVerifyAddress,
  isVerifyAddressDisabled = false,
  orderType,
  orderStatus,
}) => {
  const { view, isPending } = useViewNavigation();
  const isVerificationPending =
    item?.status?.toLowerCase() === "verification_pending";
  const canRequestCancel = subOrderCanCancel(item);

  return (
    <div className="flex justify-end">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="h-8 w-8 p-0 data-[state=open]:bg-muted"
            isLoading={Boolean(viewHref) && isPending}
            data-testid="orderinformationtableactions-button"
          >
            <span className="sr-only">Open menu</span>
            <MoreVertical className="h-4 w-4 text-gray-500" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[220px]">
          <DropdownMenuItem
            onClick={() => {
              if (viewHref) {
                view(viewHref);
                return;
              }
              onView?.();
            }}
            className="flex items-center gap-x-2 cursor-pointer"
          >
            <Eye className="h-4 w-4 text-gray-600" />
            <span>View</span>
          </DropdownMenuItem>

          {isVerificationPending &&
            (onVerifyAddress || isVerifyAddressDisabled) && (
              <DropdownMenuItem
                onClick={isVerifyAddressDisabled ? undefined : onVerifyAddress}
                disabled={isVerifyAddressDisabled}
                className="flex items-center gap-x-2 cursor-pointer"
              >
                <ShieldCheck className="h-4 w-4 text-gray-600" />
                <span>Verify address</span>
              </DropdownMenuItem>
            )}

          {canRequestCancel && (
            <DropdownMenuItem
              onClick={onRequestCancel}
              className="flex items-center gap-x-2 cursor-pointer text-red-600 focus:text-red-700"
            >
              <XCircle className="h-4 w-4" />
              <span>Request Cancel</span>
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default OrderInformationTableActions;
