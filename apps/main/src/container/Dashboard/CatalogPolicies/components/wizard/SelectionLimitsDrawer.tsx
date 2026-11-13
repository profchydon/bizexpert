"use client";

import { useEffect, useState } from "react";
import Drawer from "react-modern-drawer";
import { X } from "lucide-react";

import type { SelectionLimit } from "../../types";
import { selectionLimitKey } from "../../selectionLimitAdapters";
import { useResizableDrawer } from "../form/useResizableDrawer";
import { ResizableDrawerHandle } from "../overlays/ResizableDrawerHandle";
import {
  SelectionLimitRow,
  SelectionLimitsDrawerFooter,
} from "./SelectionLimitsDrawerRows";
import {
  normalizeSelectionLimitMaxValues,
  normalizeSelectionLimitRange,
} from "./selectionLimitInputUtils";

const MIN_WIDTH = 360;
const MAX_WIDTH = 720;
const DEFAULT_WIDTH = 430;

export function SelectionLimitsDrawer({
  open,
  limits,
  productCounts,
  isSaving = false,
  onClose,
  onSave,
}: {
  open: boolean;
  limits: SelectionLimit[];
  productCounts: Map<string, number>;
  isSaving?: boolean;
  onClose: () => void;
  onSave: (limits: SelectionLimit[]) => void;
}) {
  const [mounted, setMounted] = useState(false);
  const [draft, setDraft] = useState(limits);
  const { width, isResizing, startResize } = useResizableDrawer({
    minWidth: MIN_WIDTH,
    maxWidth: MAX_WIDTH,
    defaultWidth: DEFAULT_WIDTH,
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (open) setDraft(limits);
  }, [limits, open]);

  function updateLimit(
    key: string,
    updates: Partial<Pick<SelectionLimit, "min" | "max">>,
  ) {
    setDraft((current) =>
      current.map((limit) => {
        if (selectionLimitKey(limit) !== key) return limit;
        return normalizeSelectionLimitRange({ ...limit, ...updates });
      }),
    );
  }

  if (!mounted) return null;

  return (
    <Drawer
      open={open}
      onClose={onClose}
      direction="right"
      enableOverlay
      lockBackgroundScroll
      duration={isResizing ? 0 : 200}
      size={width}
      zIndex={1012}
      overlayOpacity={0.35}
      overlayColor="#344054"
      className="border-l border-gray-200 bg-white shadow-2xl"
    >
      <div className="relative flex h-full flex-col">
        <ResizableDrawerHandle
          resizing={isResizing}
          onPointerDown={startResize}
        />

        <header className="flex items-start justify-between gap-4 border-b border-gray-200 px-6 py-5">
          <div className="flex flex-col gap-1">
            <h2 className="text-lg font-semibold leading-7 text-gray-900">
              Configure selection limits
            </h2>
            <p className="text-sm leading-5 text-gray-500">
              Set how many items employees can pick from each category in this
              catalog.
            </p>
          </div>
          <button
            type="button"
            aria-label="Close"
            onClick={onClose}
            className="-mr-1 -mt-1 rounded-md p-1 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600"
          >
            <X className="size-5" />
          </button>
        </header>

        <div className="flex-1 overflow-y-auto px-6 py-6">
          <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
            {draft.map((limit) => (
              <SelectionLimitRow
                key={selectionLimitKey(limit)}
                limit={limit}
                productCount={
                  productCounts.get(selectionLimitKey(limit)) ??
                  productCounts.get(limit.category) ??
                  0
                }
                onUpdate={updateLimit}
              />
            ))}
          </div>
        </div>

        <SelectionLimitsDrawerFooter
          isSaving={isSaving}
          onCancel={onClose}
          onSave={() => onSave(normalizeSelectionLimitMaxValues(draft))}
        />
      </div>
    </Drawer>
  );
}
