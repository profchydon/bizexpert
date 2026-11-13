"use client";

import { Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export function DeletePolicyDialog({
  open,
  policyName,
  onClose,
  onConfirm,
  isLoading = false,
}: {
  open: boolean;
  policyName: string;
  onClose: () => void;
  onConfirm: () => void;
  isLoading?: boolean;
}) {
  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        if (!nextOpen && !isLoading) onClose();
      }}
      data-testid="deletepolicydialog-dialog"
    >
      <DialogContent className="max-w-md gap-5 rounded-xl p-6">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-error-50 ring-8 ring-error-50/40">
          <Trash2 className="h-6 w-6 text-error-600" />
        </div>
        <DialogHeader className="space-y-1.5 text-left">
          <DialogTitle className="text-lg font-semibold text-gray-900">
            Delete catalog policy?
          </DialogTitle>
          <p className="text-sm leading-5 text-gray-500">
            This will delete &ldquo;{policyName}&rdquo; from catalog policy
            management. It will no longer be available to assign or edit, but
            existing records may remain for audit.
          </p>
        </DialogHeader>
        <DialogFooter className="gap-3 sm:space-x-0">
          <Button
            variant="outline"
            className="h-10 rounded-lg bg-white px-4 text-sm font-semibold text-gray-700"
            onClick={onClose}
            disabled={isLoading}
            data-testid="deletepolicydialog-button"
          >
            Cancel
          </Button>
          <button
            type="button"
            className="inline-flex h-10 items-center justify-center rounded-lg border border-error-600 bg-error-600 px-4 text-sm font-semibold text-white transition hover:border-error-700 hover:bg-error-700 focus:outline-none disabled:pointer-events-none disabled:opacity-50"
            onClick={onConfirm}
            disabled={isLoading}
          >
            {isLoading ? "Deleting..." : "Delete policy"}
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
