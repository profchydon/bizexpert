import React, { FC, useState } from "react";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { TriangleAlert, X, CircleMinus, CirclePlus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "../ui/button";
import { orderStatusMap, ASSET_ORDER_STATUS } from "@/utils/orderStatusMap";
import { getInitials } from "@/utils/getInitials";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface FailedSubOrder {
  id: string;
  employee_name: string;
  status: ASSET_ORDER_STATUS;
  reason: string;
}

interface SuccessSubOrder {
  id: string;
  employee_name: string;
}

interface SignatureUpdateConfirmationDialogProps {
  open: boolean;
  onOpenChange: (value: boolean) => void;
  onCancel: () => void;
  onConfirm: () => void;
  failedSubOrders?: FailedSubOrder[];
  successSubOrders?: SuccessSubOrder[];
  updatedCount: number;
  totalCount: number;
  isLoading?: boolean;
}

const getDialogTitle = (allFailed: boolean, hasNoFailures: boolean): string => {
  if (allFailed) return "Cannot Modify Order";
  if (hasNoFailures) return "Update signature requirement";
  return "Partial Update: Some Sub-Orders Cannot Be Modified";
};

const getDialogDescription = (
  allFailed: boolean,
  hasNoFailures: boolean,
  failedSubOrdersLength: number,
  totalCount: number,
  updatedCount: number,
): React.ReactNode => {
  if (allFailed) {
    return (
      <>
        All {failedSubOrdersLength} sub-orders have already shipped or been
        completed and cannot be modified.
      </>
    );
  }
  if (hasNoFailures) {
    return (
      <>
        {totalCount === 1
          ? "This sub-order will be updated."
          : `All ${totalCount} sub-orders will be updated.`}
        <br />
        Proceed to make signature required.
      </>
    );
  }
  return (
    <>
      You're updating signature requirement for {totalCount} sub-order
      {totalCount === 1 ? "" : "s"}. However, {failedSubOrdersLength}{" "}
      {failedSubOrdersLength === 1 ? "has" : "have"} already shipped or been
      completed and cannot be changed. The remaining {updatedCount} sub-order
      {updatedCount === 1 ? "" : "s"} will be updated.
    </>
  );
};

const SignatureUpdateConfirmationDialog: FC<
  SignatureUpdateConfirmationDialogProps
> = ({
  open,
  onOpenChange,
  onCancel,
  onConfirm,
  failedSubOrders = [],
  successSubOrders = [],
  updatedCount,
  totalCount,
  isLoading,
}) => {
  const hasFailures = failedSubOrders.length > 0;
  const allFailed = failedSubOrders.length === totalCount && totalCount > 0;
  const hasNoFailures = !hasFailures && totalCount > 0;
  const [expanded, setExpanded] = useState(false);

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-w-md p-6 gap-y-0">
        <div className="flex flex-col mb-4">
          <div
            className={`flex items-center justify-center h-14 w-14 rounded-full bg-warning-100`}
          >
            <TriangleAlert
              className={`h-7 w-7 text-warning-600`}
              strokeWidth={1.5}
            />
          </div>
          <button
            onClick={onCancel}
            disabled={isLoading}
            className="absolute right-4 top-6 p-1 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <AlertDialogHeader className="text-center space-y-0">
          <AlertDialogTitle className="text-lg font-semibold text-primary-900">
            {getDialogTitle(allFailed, hasNoFailures)}
          </AlertDialogTitle>
          <AlertDialogDescription className="text-sm text-gray-600 leading-relaxed pt-2">
            {getDialogDescription(
              allFailed,
              hasNoFailures,
              failedSubOrders.length,
              totalCount,
              updatedCount,
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>

        {hasFailures && (
          <div className="mt-6 rounded-2xl border border-gray-200 bg-white px-4 py-4">
            <button
              type="button"
              onClick={() => setExpanded((v) => !v)}
              disabled={isLoading}
              className="w-full flex items-center justify-between text-left"
            >
              <span className="text-base font-medium text-primary-900">
                View sub-orders
              </span>
              {expanded ? (
                <CircleMinus className="h-6 w-6 text-gray-500" />
              ) : (
                <CirclePlus className="h-6 w-6 text-gray-500" />
              )}
            </button>
            {expanded && (
              <div className="mt-5 max-h-[400px] overflow-y-auto space-y-4">
                <div>
                  <h3 className="text-sm font-semibold text-gray-600 pb-2 border-b border-gray-200">
                    Will Be Updated ({successSubOrders.length})
                  </h3>
                  {successSubOrders.length > 0 ? (
                    <div className="">
                      {successSubOrders.map((subOrder) => {
                        const statusConfig = orderStatusMap["in_progress"];
                        return (
                          <div
                            key={subOrder.id}
                            className="flex items-center justify-between py-2 border-b border-gray-200 last:border-b-0"
                          >
                            <div className="flex items-center gap-2">
                              <Avatar className="h-8 w-8">
                                <AvatarFallback className="text-xs text-gray-600 bg-gray-100">
                                  {getInitials(subOrder.employee_name) || "OR"}
                                </AvatarFallback>
                              </Avatar>
                              <span className="text-sm font-medium text-primary-900">
                                {subOrder.employee_name}
                              </span>
                            </div>
                            <Badge
                              className={statusConfig.className}
                              variant={statusConfig.variant as any}
                            >
                              {statusConfig.icon}
                              {statusConfig.label}
                            </Badge>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500">
                      No sub-orders to update
                    </p>
                  )}
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-gray-600 pb-2 border-b border-gray-200">
                    Cannot Be Modified ({failedSubOrders.length})
                  </h3>
                  {failedSubOrders.length > 0 ? (
                    <div className="">
                      {failedSubOrders.map((subOrder) => {
                        const statusConfig = orderStatusMap[subOrder.status];
                        return (
                          <div
                            key={subOrder.id}
                            className="flex items-center justify-between py-2 border-b border-gray-200 last:border-b-0"
                          >
                            <div className="flex items-center gap-2">
                              <Avatar className="h-8 w-8">
                                <AvatarFallback className="text-xs text-gray-600 bg-gray-100">
                                  {getInitials(subOrder.employee_name) || "OR"}
                                </AvatarFallback>
                              </Avatar>
                              <span className="text-sm font-medium text-gray-900">
                                {subOrder.employee_name}
                              </span>
                            </div>
                            <Badge
                              className={statusConfig.className}
                              variant={statusConfig.variant as any}
                            >
                              {statusConfig.icon}
                              {statusConfig.label}
                            </Badge>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500">
                      No failed sub-orders
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        <div className="flex gap-4 justify-center pt-8">
          <AlertDialogCancel
            onClick={onCancel}
            disabled={isLoading}
            className="flex-1 h-12 text-gray-700 font-medium border-[1px] border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </AlertDialogCancel>
          {!allFailed && (
            <Button
              onClick={onConfirm}
              disabled={isLoading}
              type="button"
              className="flex-1 h-12 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-lg border-none"
              data-testid="signatureupdateconfirmationdialog-button"
            >
              {isLoading ? "Updating..." : "Continue"}
            </Button>
          )}
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default SignatureUpdateConfirmationDialog;
