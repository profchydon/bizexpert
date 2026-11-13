"use client";
import { useEffect, useRef, useState } from "react";
import { Search, X } from "lucide-react";
import { useDebounce } from "use-debounce";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import type { ApprovalItem } from "../types";
import {
  type ApprovalSwapDraft,
  isSwapDraftValid,
  minSwapReasonLength,
  nextSwapSelection,
  shouldFocusSwapReason,
} from "../swapUtils";
import { useSwapCandidates } from "../useSwapCandidates";
import {
  CurrentSwapItem,
  SwapAcknowledgementToggles,
  SwapOption,
  SwapOptionsPagination,
} from "./ItemSwapDrawerParts";

type SwapAcknowledgements = Pick<
  ApprovalSwapDraft,
  | "acknowledgeBudgetWarning"
  | "acknowledgeCategoryChange"
  | "acknowledgeExistingItem"
  | "acknowledgeOutsideKitScope"
>;

const defaultAcknowledgements: SwapAcknowledgements = {
  acknowledgeBudgetWarning: false,
  acknowledgeCategoryChange: false,
  acknowledgeExistingItem: false,
  acknowledgeOutsideKitScope: false,
};

export function ItemSwapDrawer({
  employeeId,
  item,
  onClose,
  onConfirm,
  open,
  saving = false,
}: {
  employeeId?: string;
  item: ApprovalItem | null;
  onClose: () => void;
  onConfirm: (draft: ApprovalSwapDraft) => void;
  open: boolean;
  saving?: boolean;
}) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [reason, setReason] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [touched, setTouched] = useState(false);
  const reasonRef = useRef<HTMLTextAreaElement>(null);
  const [acknowledgements, setAcknowledgements] =
    useState<SwapAcknowledgements>(defaultAcknowledgements);
  const [debouncedSearch] = useDebounce(search, 300);
  const { candidates, isFetching, paginationMeta } = useSwapCandidates({
    employeeId,
    item,
    open,
    page,
    search: debouncedSearch,
  });
  const trimmedReason = reason.trim();
  const selectedCandidate = candidates.find(
    (candidate) => candidate.id === selectedId,
  );
  const isValid =
    isSwapDraftValid({ reason, selectedId }) &&
    Boolean(
      item?.kitItemId &&
      selectedCandidate?.replacementAssetSpecificationId &&
      selectedCandidate?.replacementKitItemId,
    );

  useEffect(() => {
    if (!open) return;
    setReason("");
    setSearch("");
    setPage(1);
    setTouched(false);
    setSelectedId(null);
    setAcknowledgements(defaultAcknowledgements);
  }, [item?.id, open]);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch]);

  useEffect(() => {
    if (!open) return;
    setSelectedId((current) =>
      nextSwapSelection({ candidates, selectedId: current }),
    );
  }, [candidates, open]);

  useEffect(() => {
    if (!open || !item || !selectedCandidate) return;
    setAcknowledgements((current) => ({
      ...current,
      acknowledgeCategoryChange: isCategoryChange(item, selectedCandidate),
      acknowledgeOutsideKitScope: selectedCandidate.source === "ASSET",
    }));
  }, [item, open, selectedCandidate]);

  if (!open || !item) return null;

  function focusReasonInput() {
    reasonRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    reasonRef.current?.focus({ preventScroll: true });
  }

  return (
    <>
      <button
        type="button"
        aria-label="Close swap drawer"
        className="fixed inset-0 z-[1007] bg-[#101828]/50 backdrop-blur-[2px]"
        onClick={onClose}
      />
      <aside className="fixed inset-y-0 right-0 z-[1008] flex w-full max-w-[430px] flex-col border-l border-gray-200 bg-white shadow-2xl">
        <div className="flex items-start justify-between border-b border-gray-200 px-6 py-5">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Swap item</h2>
            <p className="mt-1 text-sm text-gray-500">Choose a replacement.</p>
          </div>
          <button
            type="button"
            className="rounded-lg p-1 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600"
            onClick={onClose}
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="flex-1 space-y-5 overflow-y-auto px-6 py-5">
          <CurrentSwapItem item={item} />
          <div className="space-y-2">
            <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
              Replace with
            </p>
            <label className="relative block">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search products"
                className="h-10 w-full rounded-lg border border-gray-200 py-2 pl-9 pr-3 text-sm outline-none focus:border-primary-300 focus:ring-2 focus:ring-primary-100"
              />
            </label>
            {isFetching ? (
              <p className="rounded-lg bg-gray-50 p-3 text-sm text-gray-500">
                Loading replacement products...
              </p>
            ) : candidates.length ? (
              <ul className="space-y-2">
                {candidates.map((candidate) => (
                  <SwapOption
                    key={candidate.id}
                    currentAmount={item.amount}
                    item={candidate}
                    selected={candidate.id === selectedId}
                    onSelect={setSelectedId}
                  />
                ))}
              </ul>
            ) : (
              <p className="rounded-lg bg-gray-50 p-3 text-sm text-gray-500">
                No alternative products available for this item type yet.
              </p>
            )}
          </div>
          <SwapAcknowledgementToggles
            values={acknowledgements}
            onChange={(key, value) =>
              setAcknowledgements((current) => ({
                ...current,
                [key]: value,
              }))
            }
          />
          <label className="flex flex-col gap-1.5">
            <span className="text-sm font-medium text-gray-700">
              Reason for swap
            </span>
            <Textarea
              ref={reasonRef}
              value={reason}
              onChange={(event) => setReason(event.target.value)}
              rows={3}
              placeholder="e.g. Out of stock or budget alignment"
            />
            <span
              className={
                touched && !isValid
                  ? "text-sm text-error-600"
                  : "text-sm text-gray-500"
              }
            >
              {touched && !isValid
                ? `Select a replacement and provide at least ${minSwapReasonLength} characters.`
                : `${trimmedReason.length} characters`}
            </span>
          </label>
        </div>
        <SwapOptionsPagination
          currentPage={paginationMeta.currentPage}
          lastPage={paginationMeta.lastPage}
          onPageChange={setPage}
        />
        <div className="flex justify-end gap-2 border-t border-gray-200 px-6 py-4">
          <Button
            variant="outline"
            className="text-sm"
            onClick={onClose}
            data-testid="itemswapdrawer-button"
          >
            Cancel
          </Button>
          <Button
            className="text-sm"
            disabled={saving}
            onClick={() => {
              if (
                !isValid ||
                !item.kitItemId ||
                !selectedCandidate?.replacementAssetSpecificationId ||
                !selectedCandidate?.replacementKitItemId
              ) {
                setTouched(true);
                if (shouldFocusSwapReason(reason)) {
                  focusReasonInput();
                }
                return;
              }
              onConfirm({
                ...acknowledgements,
                originalKitItemId: item.kitItemId,
                quantity: item.quantity ?? 1,
                reason: trimmedReason,
                replacementAssetSpecificationId:
                  selectedCandidate.replacementAssetSpecificationId,
                replacementKitItemId: selectedCandidate.replacementKitItemId,
              });
            }}
            data-testid="itemswapdrawer-button-2"
          >
            Confirm swap
          </Button>
        </div>
      </aside>
    </>
  );
}

function isCategoryChange(
  item: ApprovalItem,
  candidate: NonNullable<
    ReturnType<typeof useSwapCandidates>["candidates"][number]
  >,
) {
  if (item.categoryId && candidate.categoryId) {
    return item.categoryId !== candidate.categoryId;
  }
  if (item.category && candidate.category) {
    return (
      item.category.trim().toLowerCase() !==
      candidate.category.trim().toLowerCase()
    );
  }
  return false;
}
