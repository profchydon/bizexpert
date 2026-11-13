"use client";

import { AlertTriangle, CheckCircle, GitBranch, Package } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import type { CatalogKit, ConflictResult } from "../../types";

export function ActivateRuleDialog({
  open,
  onClose,
  onConfirm,
  ruleName,
  isLoading = false,
}: {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  ruleName: string;
  isLoading?: boolean;
}) {
  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        if (!nextOpen && !isLoading) onClose();
      }}
      data-testid="dialogs-dialog"
    >
      <DialogContent className="max-w-md gap-5 rounded-xl p-6">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-success-100">
          <CheckCircle className="h-6 w-6 text-success-600" />
        </div>
        <DialogHeader className="space-y-1.5 text-left">
          <DialogTitle className="text-lg font-semibold text-gray-900">
            Activate Policy
          </DialogTitle>
          <p className="text-sm leading-5 text-gray-500">
            This will activate &ldquo;{ruleName}&rdquo;. It will immediately
            start matching employees.
          </p>
        </DialogHeader>
        <DialogFooter className="gap-3 sm:space-x-0">
          <Button
            variant="outline"
            className="h-10 rounded-lg bg-white px-4 text-sm font-semibold text-gray-700"
            onClick={onClose}
            disabled={isLoading}
            data-testid="dialogs-button"
          >
            Cancel
          </Button>
          <Button
            className="h-10 rounded-lg px-4 text-sm font-semibold"
            onClick={onConfirm}
            disabled={isLoading}
            data-testid="dialogs-button-2"
          >
            {isLoading ? "Activating..." : "Activate"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function ActivationBlockedDialog({
  open,
  missingKitIds,
  catalogKits,
  onClose,
  onSetUpSubRules,
}: {
  open: boolean;
  missingKitIds: string[];
  catalogKits: CatalogKit[];
  onClose: () => void;
  onSetUpSubRules: () => void;
}) {
  const kits = missingKitIds
    .map((id) => catalogKits.find((kit) => kit.id === id))
    .filter((kit): kit is CatalogKit => Boolean(kit));

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => (nextOpen ? null : onClose())}
      data-testid="dialogs-dialog-2"
    >
      <DialogContent className="max-w-lg rounded-2xl p-0">
        <div className="flex flex-col">
          <div className="flex items-start gap-4 px-6 pt-6">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-warning-50 ring-8 ring-warning-50/40">
              <AlertTriangle className="h-5 w-5 text-warning-600" />
            </div>
            <div className="flex-1 pt-1">
              <DialogTitle className="text-lg font-semibold text-gray-900">
                Sub policies required to activate
              </DialogTitle>
              <p className="mt-1 text-sm leading-5 text-gray-500">
                This policy is set to open catalog with multiple kits. Add a sub
                policy for each remaining kit so every employee group sees the
                right catalog.
              </p>
            </div>
          </div>

          <ul className="mx-6 mt-5 flex flex-col divide-y divide-gray-200 overflow-hidden rounded-xl border border-gray-200 bg-gray-50/60">
            {kits.map((kit) => (
              <li key={kit.id} className="flex items-center gap-3 px-4 py-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-white text-warning-600 ring-1 ring-gray-200">
                  <Package className="h-4 w-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-gray-900">
                    {kit.name}
                  </p>
                  <p className="truncate text-xs text-gray-500">
                    No sub policy yet
                  </p>
                </div>
              </li>
            ))}
          </ul>

          <div className="flex items-center justify-end gap-3 px-6 py-5">
            <Button
              variant="outline"
              className="h-10 rounded-lg bg-white px-4 text-sm font-semibold text-gray-700"
              onClick={onClose}
              data-testid="dialogs-button-3"
            >
              Cancel
            </Button>
            <Button
              className="h-10 gap-2 rounded-lg px-4 text-sm font-semibold"
              onClick={onSetUpSubRules}
              data-testid="dialogs-button-4"
            >
              <GitBranch className="h-4 w-4" />
              Set up sub policies
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function ConflictBanner({
  conflicts,
  acknowledged,
  onAcknowledge,
}: {
  conflicts: ConflictResult[];
  acknowledged: boolean;
  onAcknowledge: () => void;
}) {
  if (!conflicts.length) return null;
  const hasRed = conflicts.some((conflict) => conflict.severity === "RED");
  return (
    <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
      <div className="flex gap-3">
        <AlertTriangle className="h-5 w-5 shrink-0" />
        <div>
          <p className="font-semibold">
            {hasRed ? "Blocking conflict" : "Potential conflict"}
          </p>
          <p className="mt-1">
            {conflicts
              .map((conflict) => conflict.conflictingRuleName)
              .join(", ")}
          </p>
          {!hasRed && !acknowledged ? (
            <Button
              className="mt-3"
              size="sm"
              variant="outline"
              onClick={onAcknowledge}
              data-testid="dialogs-button-5"
            >
              Acknowledge and continue
            </Button>
          ) : null}
        </div>
      </div>
    </div>
  );
}
