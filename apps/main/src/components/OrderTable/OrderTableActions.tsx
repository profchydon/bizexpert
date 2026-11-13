import { Eye, MoreVertical, PenLine } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useViewNavigation } from "@/hooks/useViewNavigation";
import { IOrder } from "@/types/orders";

enum SignatureStatus {
  NOT_REQUESTED = "not_requested",
  PARTIALLY_REQUESTED = "partially_requested",
  REQUESTED = "requested",
}

const NON_UPDATABLE_SIGNATURE_STATUSES = new Set([
  "completed",
  "awaiting",
  "delivered",
  "order_delivered",
  "collection_completed",
  "picked_up",
  "sold",
  "in_storage",
]);

interface OrderTableActionsProps {
  item?: IOrder;
  viewHref: string;
  onSetSignatureRequired?: (params: { setToTrue: boolean }) => void;
  onCancelOrder?: () => void;
}

const OrderTableActions: React.FC<OrderTableActionsProps> = ({
  item,
  viewHref,
  onSetSignatureRequired,
}) => {
  const { view, isPending } = useViewNavigation();
  const signatureStatus = (item as any)?.signature_requested;
  const isBuyToStorage = item?.type === "buy_to_storage";
  const statusLower = item?.status?.toLowerCase() || "";
  const isStatusLocked = NON_UPDATABLE_SIGNATURE_STATUSES.has(statusLower);
  const subOrders = Array.isArray(item?.sub_orders)
    ? item?.sub_orders
    : (item?.sub_orders as any)?.data || [];
  const isOnlyStorageSubOrder =
    subOrders.length === 1 && subOrders[0]?.type === "storage";

  const shouldShowSignatureButton =
    onSetSignatureRequired &&
    signatureStatus !== SignatureStatus.PARTIALLY_REQUESTED &&
    !isBuyToStorage &&
    !isOnlyStorageSubOrder &&
    !isStatusLocked;

  const handleSignatureClick = () => {
    if (!onSetSignatureRequired) return;
    const setToTrue = signatureStatus === SignatureStatus.REQUESTED;
    onSetSignatureRequired({ setToTrue });
  };

  return (
    <div className="flex justify-end">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="h-8 w-8 p-0 data-[state=open]:bg-muted"
            isLoading={isPending}
            data-testid="ordertableactions-button"
          >
            <span className="sr-only">Open menu</span>
            <MoreVertical className="h-4 w-4 text-gray-500" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[200px]">
          <DropdownMenuItem
            onClick={() => view(viewHref)}
            className="flex items-center gap-x-2 cursor-pointer"
          >
            <Eye className="h-4 w-4 text-gray-600" />
            <span>View order</span>
          </DropdownMenuItem>
          {shouldShowSignatureButton && (
            <DropdownMenuItem
              onClick={handleSignatureClick}
              className="flex items-center gap-x-2 cursor-pointer"
            >
              <PenLine className="h-4 w-4 text-gray-600" />
              <span>Set signature required</span>
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default OrderTableActions;
