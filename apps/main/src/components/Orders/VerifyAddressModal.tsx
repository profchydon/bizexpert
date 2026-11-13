import React, { useEffect, useMemo, useState } from "react";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { CheckCheck, MapPin, X } from "lucide-react";
import { ISubOrder, VerificationContext } from "@/types/orders";
import {
  getVerificationTargets,
  targetKey,
} from "@/container/Dashboard/Orders/ViewOrder/verificationContexts";
import VerifyAddressTargetRow from "./VerifyAddressTargetRow";
import {
  getConfirmLabel,
  getDescription,
  getSelectAllState,
} from "./verifyAddressModalHelpers";

interface VerifyAddressModalProps {
  open: boolean;
  mode: "single" | "bulk";
  subOrders: ISubOrder[];
  isLoading?: boolean;
  onOpenChange: (open: boolean) => void;
  onClose: () => void;
  onConfirm: (contexts?: VerificationContext[]) => void;
}

const VerifyAddressModal: React.FC<VerifyAddressModalProps> = ({
  open,
  mode,
  subOrders,
  isLoading,
  onOpenChange,
  onClose,
  onConfirm,
}) => {
  const targets = useMemo(
    () => subOrders.flatMap((sub) => getVerificationTargets(sub)),
    [subOrders],
  );

  const pendingTargets = useMemo(
    () => targets.filter((t) => t.isPending),
    [targets],
  );

  const displayedTargets = mode === "single" ? targets : pendingTargets;
  const isSelectable = mode === "single" && pendingTargets.length > 1;
  const [selected, setSelected] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (!open) return;
    setSelected(
      new Set(pendingTargets.map((t) => targetKey(t.subOrderId, t.context))),
    );
  }, [open, pendingTargets]);

  const toggle = (key: string) =>
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
      }
      return next;
    });

  const handleConfirm = () => {
    if (mode === "bulk") {
      onConfirm(undefined);
      return;
    }

    const chosen = pendingTargets.filter((t) =>
      isSelectable ? selected.has(targetKey(t.subOrderId, t.context)) : true,
    );
    const explicit = chosen.filter((t) => t.hasExplicitContext);
    const contexts = explicit.length
      ? Array.from(new Set(explicit.map((t) => t.context)))
      : undefined;
    onConfirm(contexts);
  };

  const allSelected =
    pendingTargets.length > 0 && selected.size === pendingTargets.length;
  const toggleAll = () =>
    setSelected(
      allSelected
        ? new Set()
        : new Set(
            pendingTargets.map((t) => targetKey(t.subOrderId, t.context)),
          ),
    );

  const hasSelection =
    pendingTargets.length > 0 && (!isSelectable || selected.size > 0);
  const description = getDescription(mode, isSelectable);
  const confirmLabel = getConfirmLabel(mode, isSelectable);

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-w-lg p-6 gap-y-0">
        <div className="flex flex-col mb-4">
          <div className="flex items-center justify-center h-14 w-14 rounded-full bg-primary-50">
            <MapPin className="h-7 w-7 text-primary-600" strokeWidth={1.8} />
          </div>
          <button
            onClick={onClose}
            disabled={isLoading}
            className="absolute right-4 top-6 p-1 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <AlertDialogHeader className="text-center space-y-0">
          <AlertDialogTitle className="text-lg font-semibold text-primary-900">
            {mode === "bulk"
              ? "Verify all pending addresses"
              : "Verify address"}
          </AlertDialogTitle>
          <AlertDialogDescription className="text-sm text-gray-600 leading-relaxed pt-2">
            {description}
          </AlertDialogDescription>
        </AlertDialogHeader>

        {isSelectable && (
          <label className="mt-5 flex cursor-pointer items-center gap-2 px-1">
            <Checkbox
              checked={getSelectAllState(allSelected, selected.size > 0)}
              onCheckedChange={toggleAll}
              data-testid="verifyaddressmodal-checkbox"
            />
            <span className="text-sm font-medium text-gray-700">
              Select all
            </span>
          </label>
        )}

        <div
          className={`${isSelectable ? "mt-3" : "mt-5"} max-h-[280px] overflow-y-auto space-y-3`}
        >
          {displayedTargets.map((target) => {
            const key = targetKey(target.subOrderId, target.context);
            return (
              <VerifyAddressTargetRow
                key={key}
                target={target}
                selectable={isSelectable && target.isPending}
                checked={selected.has(key)}
                onToggle={() => toggle(key)}
              />
            );
          })}
        </div>

        <div className="flex gap-4 justify-center pt-6">
          <AlertDialogCancel
            onClick={onClose}
            disabled={isLoading}
            className="flex-1 h-12 text-gray-700 font-medium border-[1px] border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </AlertDialogCancel>
          <Button
            onClick={handleConfirm}
            disabled={isLoading || targets.length === 0 || !hasSelection}
            type="button"
            className="flex-1 h-12 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-lg border-none"
            data-testid="verifyaddressmodal-button"
          >
            {isLoading ? (
              "Verifying..."
            ) : (
              <span className="inline-flex items-center gap-2">
                <CheckCheck className="h-4 w-4" />
                {confirmLabel}
              </span>
            )}
          </Button>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default VerifyAddressModal;
