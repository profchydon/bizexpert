import React, { useEffect, useMemo, useState } from "react";
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
import { Input } from "@/components/ui/input";
import { IOrder } from "@/types/orders";
import { AlertCircle, CheckCircle2 } from "lucide-react";
import formatAmount from "@/utils/formatAmount";
import {
  CancellationPreviewResponse,
  useLazyGetCancellationPreviewQuery,
} from "@/api/baseQueries/companiesApi/ordersApi/getCancellationPreview";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  order?: IOrder;
  companyId?: string;
  employeeIds?: string[];
  suborderIds?: string[];
  onConfirm: (
    reason: string,
    additionalDetails: string,
    scope?: { employeeIds?: string[]; suborderIds?: string[] },
  ) => Promise<boolean>;
  isLoading?: boolean;
}

const CANCELLATION_REASONS = [
  "Ordered by mistake",
  "No longer need the item(s)",
  "Delivery timeline too long",
  "Need to change specifications",
  "Budget constraints",
  "Other",
];

export const NON_CANCELABLE_STATUSES = [
  "completed",
  "cancelled",
  "order_cancelled",
  "delivered",
  "order_delivered",
  "collection_completed",
  "sold",
  "picked_up",
  "in_storage",
  "awaiting_cancellation",
];

export const CANCELABLE_ORDER_TYPES = [
  "onboarding",
  "offboarding",
  "storage_to_employee",
  "buy_to_storage",
  "device_refresh",
];

export const canCancelOrder = (order?: IOrder): boolean => {
  if (!order) return false;
  if (order.cancellation_status?.can_cancel === false) return false;
  if (order.cancellation_status?.can_cancel === true) return true;

  if (!CANCELABLE_ORDER_TYPES.includes(order.type || "")) {
    return false;
  }

  const mainStatus = order.status?.toLowerCase() || "";
  if (NON_CANCELABLE_STATUSES.includes(mainStatus)) {
    return false;
  }

  if (order.sub_orders && order.sub_orders.length > 0) {
    return order.sub_orders.every((subOrder) => {
      if (subOrder.cancellation_status?.can_cancel === false) return false;
      if (subOrder.cancellation_status?.can_cancel === true) return true;
      const subStatus = subOrder.status?.toLowerCase() || "";
      return !NON_CANCELABLE_STATUSES.includes(subStatus);
    });
  }

  return true;
};

const formatPreviewValue = (
  value: number | string,
  currency?: string,
): string => {
  if (typeof value === "number") {
    return `${currency || ""}${formatAmount(String(value))}`;
  }
  return String(value);
};

const CancelOrderModal: React.FC<Props> = ({
  isOpen,
  onClose,
  order,
  companyId,
  employeeIds,
  suborderIds,
  onConfirm,
  isLoading = false,
}) => {
  const [step, setStep] = useState<"form" | "commit" | "done">("form");
  const [reason, setReason] = useState("");
  const [additionalDetails, setAdditionalDetails] = useState("");
  const [typedConfirm, setTypedConfirm] = useState("");
  const [fetchPreview, { data: previewResponse, isFetching }] =
    useLazyGetCancellationPreviewQuery();

  const preview: CancellationPreviewResponse | undefined =
    previewResponse?.data;
  const isInstant = Boolean(preview?.instant);
  const requiresTypeToConfirm = Boolean(preview?.requires_type_to_confirm);
  const currency = order?.currency || preview?.refund_preview?.currency || "";

  useEffect(() => {
    if (!isOpen || !companyId || !order?.id) return;
    setStep("form");
    setReason("");
    setAdditionalDetails("");
    setTypedConfirm("");
    fetchPreview({
      companyId,
      orderId: order.id,
      employeeIds,
      suborderIds,
    });
  }, [isOpen, companyId, order?.id, employeeIds, suborderIds, fetchPreview]);

  const confirmMatches = useMemo(() => {
    if (!requiresTypeToConfirm) return true;
    const target = (order?.order_number || order?.id || "").trim();
    return typedConfirm.trim().toLowerCase() === target.toLowerCase();
  }, [requiresTypeToConfirm, order?.order_number, order?.id, typedConfirm]);

  const handleClose = () => {
    setStep("form");
    setReason("");
    setAdditionalDetails("");
    setTypedConfirm("");
    onClose();
  };

  const handleSubmit = async () => {
    if (!reason) return;
    const success = await onConfirm(reason, additionalDetails, {
      employeeIds,
      suborderIds,
    });
    if (success) {
      setStep("done");
    }
  };

  const itemsCount =
    preview?.scope?.suborder_count ??
    order?.no_of_items ??
    order?.quantity ??
    "0";
  const employeeCount = order?.employee_count || 0;
  const totalAmount = order?.total_amount || "0";
  const refundRows = preview?.refund_preview?.rows ?? [];
  const policyRules = preview?.refund_preview?.policy_rules ?? [];

  const commitLabel = isInstant ? "Cancel order" : "Send request";
  const title =
    step === "done"
      ? isInstant
        ? "Cancellation confirmed"
        : "Cancellation request sent"
      : step === "commit"
        ? isInstant
          ? "Confirm this cancellation"
          : "Send this cancellation request"
        : `Cancel order ${order?.order_number || ""}`.trim();

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => !open && handleClose()}
      data-testid="cancelordermodal-dialog"
    >
      <DialogContent className="w-[calc(100%-32px)] sm:w-full sm:max-w-[640px] max-h-[90vh] overflow-y-auto">
        <DialogHeader className="flex flex-col items-start gap-4">
          <div className="flex items-center justify-center w-12 h-12 rounded-full bg-red-50">
            {step === "done" ? (
              <CheckCircle2 className="w-6 h-6 text-green-600" />
            ) : (
              <AlertCircle className="w-6 h-6 text-red-600" />
            )}
          </div>
          <div>
            <DialogTitle className="text-lg font-semibold text-gray-900">
              {title}
            </DialogTitle>
            <DialogDescription className="mt-2 text-sm text-gray-500">
              {step === "done"
                ? isInstant
                  ? "Your order has been cancelled. Refunds follow the payment method shown below."
                  : "Your request is pending admin review. You can withdraw it from the order page."
                : isInstant
                  ? "Order not started, so this cancels immediately."
                  : "A vendor is already working on this, so a Rayda admin reviews within 24 hours."}
            </DialogDescription>
          </div>
        </DialogHeader>

        {step === "form" && (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 py-4 border-y border-gray-200 justify-items-center text-center">
              <div className="flex flex-col items-center">
                <span className="text-xs sm:text-sm text-gray-500">
                  Items in scope
                </span>
                <span className="text-sm font-semibold text-gray-900">
                  {itemsCount} {Number(itemsCount) === 1 ? "item" : "items"}
                </span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-xs sm:text-sm text-gray-500">
                  Employee count
                </span>
                <span className="text-sm font-semibold text-gray-900">
                  {employeeCount}{" "}
                  {employeeCount === 1 ? "Employee" : "Employees"}
                </span>
              </div>
              <div className="flex flex-col items-center col-span-2 sm:col-span-1">
                <span className="text-xs sm:text-sm text-gray-500">
                  Order total
                </span>
                <span className="text-sm font-semibold text-gray-900">
                  {currency}
                  {formatAmount(totalAmount)}
                </span>
              </div>
            </div>

            {isFetching && (
              <p className="text-sm text-gray-500">Loading refund preview…</p>
            )}

            {!isFetching && refundRows.length > 0 && (
              <div className="space-y-2 rounded-lg border border-gray-200 p-4">
                <p className="text-sm font-medium text-gray-900">Refund</p>
                {refundRows.map((row) => (
                  <div
                    key={row.label}
                    className="flex items-start justify-between gap-3 text-sm"
                  >
                    <span
                      className={
                        row.deduction ? "text-gray-500" : "text-gray-700"
                      }
                    >
                      {row.label}
                    </span>
                    <span className="font-medium text-gray-900 text-right">
                      {row.note || formatPreviewValue(row.value, currency)}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {!isInstant && (
              <p className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-xs text-amber-800">
                Work has already started on this order. You should not expect a
                full refund if this cancellation is approved.
              </p>
            )}

            {policyRules.length > 0 && (
              <ul className="list-disc pl-5 text-xs text-gray-500 space-y-1">
                {policyRules.map((rule) => (
                  <li key={rule}>{rule}</li>
                ))}
              </ul>
            )}

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Cancellation reason <span className="text-red-500">*</span>
                </label>
                <Select
                  value={reason}
                  onValueChange={setReason}
                  data-testid="cancelordermodal-select"
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a reason for cancelling" />
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

            <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-4">
              <Button
                variant="outline"
                onClick={handleClose}
                className="w-full sm:w-auto"
                disabled={isLoading}
                data-testid="cancelordermodal-button"
              >
                Keep order
              </Button>
              <Button
                onClick={() => setStep("commit")}
                disabled={!reason || isFetching}
                className="bg-error-600 text-white w-full sm:w-auto"
                variant="ghost"
                data-testid="cancelordermodal-button-2"
              >
                Continue
              </Button>
            </div>
          </>
        )}

        {step === "commit" && (
          <>
            <div className="rounded-lg border border-gray-200 p-4 text-sm text-gray-700 space-y-2">
              <p className="font-medium text-gray-900">
                {isInstant
                  ? "This cancels immediately and cannot be undone."
                  : "An admin will approve or decline within 24 hours."}
              </p>
              {preview?.refund_preview?.rail === "card" && (
                <p>
                  Card refunds deduct a 2.9% gateway fee from the refundable
                  amount.
                </p>
              )}
              {preview?.refund_preview?.rail === "invoice" && (
                <p>
                  No refund payment is needed; your invoice will be adjusted.
                </p>
              )}
            </div>

            {requiresTypeToConfirm && (
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Type{" "}
                  <span className="font-semibold">{order?.order_number}</span>{" "}
                  to confirm
                </label>
                <Input
                  value={typedConfirm}
                  onChange={(e) => setTypedConfirm(e.target.value)}
                  placeholder={order?.order_number}
                  data-testid="cancelordermodal-input"
                />
              </div>
            )}

            <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-4">
              <Button
                variant="outline"
                onClick={() => setStep("form")}
                data-testid="cancelordermodal-button-3"
              >
                Back
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={!confirmMatches || isLoading}
                className="bg-error-600 text-white"
                variant="ghost"
                data-testid="cancelordermodal-button-4"
              >
                {isLoading ? "Submitting..." : commitLabel}
              </Button>
            </div>
          </>
        )}

        {step === "done" && (
          <div className="flex justify-end pt-4">
            <Button
              onClick={handleClose}
              data-testid="cancelordermodal-button-5"
            >
              Close
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default CancelOrderModal;
