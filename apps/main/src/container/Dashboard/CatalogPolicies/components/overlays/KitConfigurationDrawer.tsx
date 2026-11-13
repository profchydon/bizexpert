"use client";

import { useWorkspaceCompanyId } from "@/hooks/useWorkspaceCompanyId";
import {
  type PointerEvent as ReactPointerEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import Drawer from "react-modern-drawer";
import { X } from "lucide-react";

import { Button } from "@/components/ui/button";

import type { CatalogRule } from "../../types";
import { WizardKitStorage } from "../wizard/KitStorageStep";
import { useOpenSelectionKitCategories } from "../wizard/useOpenSelectionKitCategories";
import { canContinuePolicyWizard } from "../wizard/wizardValidation";
import { ResizableDrawerHandle } from "./ResizableDrawerHandle";

import { useWorkspaceCurrencySymbol } from "@/hooks/useWorkspaceCurrencySymbol";

const MIN_WIDTH = 360;
const MAX_WIDTH = 720;
const DEFAULT_WIDTH = 400;

export function KitConfigurationDrawer({
  companyId,
  open,
  rule,
  onClose,
  onSave,
  isSaving = false,
}: {
  companyId?: string;
  open: boolean;
  rule: CatalogRule;
  onClose: () => void;
  onSave: (
    rule: CatalogRule,
    options?: { selectionCategoryIds?: string[] },
  ) => Promise<void> | void;
  isSaving?: boolean;
}) {
  const workspaceCompanyId = useWorkspaceCompanyId();
  const currencySymbol = useWorkspaceCurrencySymbol();
  const [mounted, setMounted] = useState(false);
  const [width, setWidth] = useState(DEFAULT_WIDTH);
  const [draft, setDraft] = useState(rule);
  const [isResizing, setIsResizing] = useState(false);
  const [isRefreshingCategories, setIsRefreshingCategories] = useState(false);
  const resizeStart = useRef({ x: 0, width: DEFAULT_WIDTH });

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (open) setDraft(rule);
  }, [open, rule.id]);
  const kitCategories = useOpenSelectionKitCategories({
    companyId,
    draft,
    enabled: open,
  });
  const canSave =
    canContinuePolicyWizard({
      draft,
      hasRequiredApprovers: true,
      step: 3,
    }) && !kitCategories.isLoading;
  const saving = isSaving || isRefreshingCategories;

  const handlePointerMove = useCallback((event: PointerEvent) => {
    const delta = resizeStart.current.x - event.clientX;
    const next = Math.min(
      MAX_WIDTH,
      Math.max(MIN_WIDTH, resizeStart.current.width + delta),
    );
    setWidth(next);
  }, []);

  const stopResize = useCallback(() => {
    setIsResizing(false);
    document.body.style.userSelect = "";
    document.body.style.cursor = "";
    window.removeEventListener("pointermove", handlePointerMove);
    window.removeEventListener("pointerup", stopResize);
  }, [handlePointerMove]);

  const startResize = (event: ReactPointerEvent<HTMLDivElement>) => {
    event.preventDefault();
    resizeStart.current = { x: event.clientX, width };
    setIsResizing(true);
    document.body.style.userSelect = "none";
    document.body.style.cursor = "col-resize";
    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", stopResize);
  };

  useEffect(() => {
    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", stopResize);
    };
  }, [handlePointerMove, stopResize]);

  async function handleSave() {
    if (saving || !canSave) return;
    setIsRefreshingCategories(true);
    try {
      const categoryIds = await kitCategories.refetchCategoryIds();
      await onSave(
        { ...draft, updatedAt: new Date().toISOString() },
        { selectionCategoryIds: categoryIds },
      );
    } finally {
      setIsRefreshingCategories(false);
    }
  }

  if (!mounted) return null;

  return (
    <Drawer
      open={open}
      onClose={() => !saving && onClose()}
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

        <header className="flex items-start justify-between gap-4 px-6 pb-5 pt-6">
          <div className="flex flex-col gap-1">
            <h2 className="text-lg font-semibold leading-7 text-gray-900">
              Kit configuration
            </h2>
            <p className="text-sm leading-5 text-gray-500">
              Update kit, budget, approval, and storage behavior.
            </p>
          </div>
          <button
            type="button"
            aria-label="Close"
            onClick={onClose}
            disabled={saving}
            className="-mr-1 -mt-1 rounded-md p-1 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600"
          >
            <X className="size-5" />
          </button>
        </header>

        <div className="h-px w-full bg-gray-200" />

        <div className="flex-1 overflow-y-auto px-6 py-6">
          <WizardKitStorage
            draft={draft}
            currencySymbol={currencySymbol}
            onChange={setDraft}
          />
        </div>

        <footer className="flex justify-end gap-3 border-t border-gray-200 bg-white px-6 py-4">
          <Button
            type="button"
            variant="outline"
            className="h-10 rounded-lg bg-white px-4 text-sm font-semibold text-gray-700"
            onClick={onClose}
            disabled={saving}
            data-testid="kitconfigurationdrawer-button"
          >
            Cancel
          </Button>
          <Button
            type="button"
            className="h-10 rounded-lg px-4 text-sm font-semibold"
            disabled={saving || !canSave}
            onClick={() => void handleSave()}
            data-testid="kitconfigurationdrawer-button-2"
          >
            {saving ? "Saving..." : "Save changes"}
          </Button>
        </footer>
      </div>
    </Drawer>
  );
}
