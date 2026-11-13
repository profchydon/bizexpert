"use client";

import { X } from "lucide-react";

import { DialogDescription, DialogTitle } from "@/components/ui/dialog";

export function WizardHeader({
  isCreating,
  onClose,
}: {
  isCreating: boolean;
  onClose: () => void;
}) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-gray-200 px-6 pb-4 pt-5">
      <div className="flex flex-col gap-1">
        <DialogTitle className="text-lg font-semibold leading-7 text-gray-900">
          Add catalog policy
        </DialogTitle>
        <DialogDescription className="text-sm leading-5 text-gray-500">
          Create a rule to automate device provisioning.
        </DialogDescription>
      </div>
      <button
        type="button"
        aria-label="Close"
        onClick={onClose}
        disabled={isCreating}
        className="flex size-9 items-center justify-center rounded-lg p-2 text-gray-400 transition hover:bg-gray-50 hover:text-gray-500 disabled:cursor-not-allowed disabled:opacity-50"
      >
        <X className="h-5 w-5" />
      </button>
    </div>
  );
}
