import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { ISubOrder } from "@/types/orders";
import {
  ELEVATED_MODAL_CONTENT_CLASS,
  ELEVATED_MODAL_OVERLAY_CLASS,
} from "@/utils/drawerOverlayStacking";
import { AlertCircle } from "lucide-react";
import formatAmount from "@/utils/formatAmount";
import { cn } from "@/lib/utils";
import { SubOrderCancelItems } from "./SubOrderCancelItems";
import { calculateSubOrderTotalAmount } from "./subOrderCancelAmount";
import { CANCELLATION_REASONS } from "./subOrderCancelMeta";
import { trackSubOrderCancelRequested } from "@/lib/subOrderCancelAnalytics";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  subOrder?: ISubOrder;
  orderId?: string;
  orderNumber: string;
  currency?: string;
  onConfirm: (reason: string, additionalDetails: string) => void;
  isLoading?: boolean;
}

const SubOrderCancelModal: React.FC<Props> = ({
  isOpen,
  onClose,
  subOrder,
  orderId,
  orderNumber,
  currency,
  onConfirm,
  isLoading,
}) => {
  const [reason, setReason] = useState("");
  const [additionalDetails, setAdditionalDetails] = useState("");

  useEffect(() => {
    if (!isOpen) return;
    trackSubOrderCancelRequested({
      status: "opened",
      ...(orderId ? { order_id: orderId } : {}),
      ...(subOrder?.id ? { sub_order_id: subOrder.id } : {}),
    });
  }, [isOpen, orderId, subOrder?.id]);

  const handleConfirm = () => {
    if (!reason) return;
    trackSubOrderCancelRequested({
      status: "submitted",
      ...(orderId ? { order_id: orderId } : {}),
      ...(subOrder?.id ? { sub_order_id: subOrder.id } : {}),
    });
    onConfirm(reason, additionalDetails);
    setReason("");
    setAdditionalDetails("");
  };

  const handleClose = () => {
    setReason("");
    setAdditionalDetails("");
    onClose();
  };

  const address = subOrder?.address || "N/A";
  const totalAmount = calculateSubOrderTotalAmount(subOrder);

  return (
    <Dialog
      open={isOpen}
      onOpenChange={handleClose}
      data-testid="subordercancelmodal-dialog"
    >
      <DialogContent
        overlayClassName={ELEVATED_MODAL_OVERLAY_CLASS}
        className={cn(
          ELEVATED_MODAL_CONTENT_CLASS,
          "w-[calc(100%-32px)] max-h-[90vh] overflow-y-auto sm:w-full sm:max-w-[640px]",
        )}
      >
        <DialogHeader className="flex flex-col items-start gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-50">
            <AlertCircle className="h-6 w-6 text-red-600" />
          </div>
          <div>
            <DialogTitle className="text-lg font-semibold text-gray-900">
              Are you sure you want to request to cancel{" "}
              <span className="text-error-600">{orderNumber}</span>?
            </DialogTitle>
            <DialogDescription className="mt-2 text-sm text-gray-500">
              Your cancellation request will be reviewed by an admin within 24
              hours. You&apos;ll be notified whether it&apos;s approved. Please
              provide a reason below.
            </DialogDescription>
          </div>
        </DialogHeader>

        <div className="flex gap-x-6 rounded-lg border border-gray-200 bg-gray-50 px-4 py-3">
          <div className="flex flex-col">
            <span className="text-xs text-gray-500 sm:text-sm">
              Total amount
            </span>
            <span className="text-sm font-medium text-gray-900">
              {currency}
              {formatAmount(totalAmount)}
            </span>
          </div>
          <div className="flex flex-1 flex-col">
            <span className="text-xs text-gray-500 sm:text-sm">Address</span>
            <span className="text-sm font-medium text-gray-900">{address}</span>
          </div>
        </div>

        <div className="max-h-[200px] space-y-3 overflow-y-auto border-b border-gray-200 py-4">
          <SubOrderCancelItems subOrder={subOrder} />
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Cancellation reason <span className="text-red-500">*</span>
            </label>
            <Select
              value={reason}
              onValueChange={setReason}
              data-testid="subordercancelmodal-select"
            >
              <SelectTrigger>
                <SelectValue placeholder="Select reason" />
              </SelectTrigger>
              <SelectContent>
                {CANCELLATION_REASONS.map((reasonOption) => (
                  <SelectItem key={reasonOption} value={reasonOption}>
                    {reasonOption}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Additional details
            </label>
            <Textarea
              value={additionalDetails}
              onChange={(e) => setAdditionalDetails(e.target.value)}
              placeholder="e.g., Employee no longer needs equipment due to role change"
              className="min-h-[80px] sm:min-h-[100px]"
            />
          </div>
        </div>

        <div className="flex flex-col-reverse justify-end gap-3 pt-4 sm:flex-row">
          <Button
            variant="outline"
            onClick={handleClose}
            className="w-full sm:w-auto"
            data-testid="subordercancelmodal-button"
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={!reason || isLoading}
            className="w-full bg-error-600 text-white sm:w-auto"
            variant="ghost"
            data-testid="subordercancelmodal-button-2"
          >
            {isLoading ? "Cancelling..." : "Confirm cancellation"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SubOrderCancelModal;
