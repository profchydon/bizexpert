"use client";

import { GitBranch, Package, Users, X } from "lucide-react";

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";

import { useCatalogPolicyOptions } from "../../useCatalogPolicyOptions";

export function MultiKitFixedWarningModal({
  open,
  kitIds,
  onClose,
  onContinue,
  onCreateSubRule,
  isCreating = false,
}: {
  open: boolean;
  kitIds: string[];
  onClose: () => void;
  onContinue: () => void;
  onCreateSubRule: () => void;
  isCreating?: boolean;
}) {
  const { kits: catalogKits } = useCatalogPolicyOptions();
  const kits = kitIds
    .map((id) => catalogKits.find((kit) => kit.id === id))
    .filter((kit): kit is NonNullable<typeof kit> => Boolean(kit));

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => (nextOpen || isCreating ? null : onClose())}
      data-testid="multikitfixedwarningmodal-dialog"
    >
      <DialogContent
        showCloseButton={false}
        overlayClassName="z-[1010] bg-[#344054]/35 backdrop-blur-[6px]"
        className="z-[1011] w-[calc(100vw-2rem)] max-w-lg rounded-2xl border-0 bg-white p-0 shadow-xl"
      >
        <div className="flex flex-col rounded-2xl bg-white">
          <div className="flex items-start justify-between gap-4 px-6 pt-6">
            <div className="flex size-11 shrink-0 items-center justify-center rounded-full bg-amber-50 text-amber-600 ring-8 ring-amber-50/40">
              <Users className="size-5" />
            </div>
            <div className="flex-1 pt-1">
              <DialogTitle className="text-lg font-semibold text-gray-900">
                Every employee will receive {kits.length} kits
              </DialogTitle>
              <p className="mt-1 text-sm leading-6 text-gray-500">
                This is a fixed policy, so every matching employee will receive
                all kits below. If you want different employees to get different
                kits, create a sub policy instead.
              </p>
            </div>
            <button
              type="button"
              aria-label="Close"
              disabled={isCreating}
              onClick={onClose}
              className="flex size-9 items-center justify-center rounded-lg p-2 text-gray-400 transition hover:bg-gray-50 hover:text-gray-500 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <X className="size-5" />
            </button>
          </div>

          <ul className="mx-6 mt-5 flex flex-col divide-y divide-gray-200 overflow-hidden rounded-xl border border-gray-200 bg-gray-50/40">
            {kits.map((kit) => (
              <li key={kit.id} className="flex items-center gap-3 px-4 py-3">
                <div className="flex size-8 shrink-0 items-center justify-center rounded-md bg-white text-primary-600 ring-1 ring-gray-200">
                  <Package className="size-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-gray-900">
                    {kit.name}
                  </p>
                  <p className="truncate text-xs text-gray-500">
                    {kit.itemsCount ?? kit.items.length} item
                    {(kit.itemsCount ?? kit.items.length) === 1 ? "" : "s"}
                  </p>
                </div>
              </li>
            ))}
          </ul>

          <div className="flex flex-col-reverse gap-2 px-6 py-5 pt-5 sm:flex-row sm:items-center sm:justify-end sm:gap-3">
            <button
              type="button"
              disabled={isCreating}
              onClick={onCreateSubRule}
              className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-4 text-sm font-semibold text-gray-700 shadow-sm transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <GitBranch className="size-4" />
              Create a sub policy
            </button>
            <button
              type="button"
              disabled={isCreating}
              onClick={onContinue}
              className="inline-flex h-10 items-center justify-center rounded-lg bg-primary-600 px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-primary-700 disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-400"
            >
              {isCreating ? "Creating..." : "Continue anyway"}
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
