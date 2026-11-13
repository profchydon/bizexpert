"use client";

import { ArrowRight, SlidersHorizontal, X } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";

import type { SelectionLimit } from "../../types";

export function SelectionLimitsReviewModal({
  open,
  limits,
  onClose,
  onContinue,
  onConfigure,
}: {
  open: boolean;
  limits: SelectionLimit[];
  onClose: () => void;
  onContinue: () => void;
  onConfigure: () => void;
}) {
  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => (nextOpen ? null : onClose())}
      data-testid="selectionlimitsreviewmodal-dialog"
    >
      <DialogContent
        showCloseButton={false}
        overlayClassName="z-[1010] bg-[#344054]/35 backdrop-blur-[6px]"
        className="z-[1011] w-[calc(100vw-2rem)] max-w-lg rounded-2xl border-0 bg-white p-0 shadow-xl"
      >
        <div className="flex flex-col rounded-2xl bg-white">
          <div className="flex items-start justify-between gap-4 px-6 pb-5 pt-6">
            <div className="flex items-start gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary-50 text-primary-600 ring-8 ring-primary-50/50">
                <SlidersHorizontal className="h-5 w-5" />
              </div>
              <div>
                <DialogTitle className="text-lg font-semibold leading-7 text-gray-900">
                  Review selection limits
                </DialogTitle>
                <DialogDescription className="mt-1 text-sm leading-5 text-gray-500">
                  Defaults shown — adjust if needed.
                </DialogDescription>
              </div>
            </div>
            <button
              type="button"
              aria-label="Close"
              onClick={onClose}
              className="flex h-9 w-9 items-center justify-center rounded-lg p-2 text-gray-400 transition hover:bg-gray-50 hover:text-gray-500"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="border-t border-gray-200 px-6 py-6">
            <p className="text-sm leading-6 text-gray-600">
              This catalog contains products from multiple kits. Each employee
              will see one merged catalog — these limits control how many items
              they can pick from each category.
            </p>

            <div className="mt-5 flex flex-col divide-y divide-gray-200 overflow-hidden rounded-xl border border-gray-200 bg-gray-50/40">
              {limits.map((limit) => (
                <div
                  key={limit.category}
                  className="flex items-center justify-between gap-4 px-4 py-3"
                >
                  <span className="inline-flex w-max items-center whitespace-nowrap rounded-full bg-gray-50 px-2 py-0.5 text-xs font-normal text-gray-700 ring-1 ring-inset ring-gray-200">
                    {limit.category}
                  </span>
                  <span className="text-sm font-medium text-gray-900">
                    {limit.max === null ? "No limit" : `Up to ${limit.max}`}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col-reverse gap-3 border-t border-gray-200 px-6 py-5 sm:flex-row sm:items-center sm:justify-end">
            <button
              type="button"
              onClick={onContinue}
              className="inline-flex h-10 items-center justify-center rounded-lg border border-gray-300 bg-white px-4 text-sm font-semibold text-gray-700 shadow-sm transition hover:bg-gray-50"
            >
              Continue with defaults
            </button>
            <button
              type="button"
              onClick={onConfigure}
              className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-primary-600 px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-primary-700"
            >
              Configure limits
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
