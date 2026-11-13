"use client";

import type { PointerEvent as ReactPointerEvent, ReactNode } from "react";
import { useState } from "react";
import Drawer from "react-modern-drawer";
import { CheckCircle, MessageCircle, X } from "lucide-react";

import { Button } from "@/components/ui/button";

import { useWorkspaceCurrencySymbol } from "@/hooks/useWorkspaceCurrencySymbol";

import type { EmployeeSelection } from "../../types";
import { formatMoney } from "../../utils";
import { formatSelectionSubmittedFull } from "../../utilsSelections";
import { ResizableDrawerHandle } from "../overlays/ResizableDrawerHandle";
import { SelectionStatusBadge } from "./SelectionStatusBadge";
import { SelectedItemsList } from "./SelectedItemsList";

const MIN_WIDTH = 380;
const MAX_WIDTH = 560;
const DEFAULT_WIDTH = 440;

export function EmployeeSelectionDetailDrawer({
  selection,
  onClose,
  onApprove,
  onRequestChanges,
}: {
  selection: EmployeeSelection | null;
  onClose: () => void;
  onApprove: (id: string) => void;
  onRequestChanges: (selection: EmployeeSelection) => void;
}) {
  const currencySymbol = useWorkspaceCurrencySymbol();
  const [width, setWidth] = useState(DEFAULT_WIDTH);
  const [isResizing, setIsResizing] = useState(false);

  function startResize(event: ReactPointerEvent<HTMLDivElement>) {
    event.preventDefault();
    const startX = event.clientX;
    const startWidth = width;
    setIsResizing(true);
    document.body.style.userSelect = "none";
    document.body.style.cursor = "col-resize";

    function move(moveEvent: PointerEvent) {
      const delta = startX - moveEvent.clientX;
      setWidth(Math.min(MAX_WIDTH, Math.max(MIN_WIDTH, startWidth + delta)));
    }

    function stop() {
      setIsResizing(false);
      document.body.style.userSelect = "";
      document.body.style.cursor = "";
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", stop);
    }

    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", stop);
  }

  return (
    <Drawer
      open={selection !== null}
      onClose={onClose}
      direction="right"
      enableOverlay
      lockBackgroundScroll
      duration={isResizing ? 0 : 200}
      size={width}
      zIndex={1014}
      overlayOpacity={0.35}
      overlayColor="#344054"
      className="border-l border-gray-200 bg-white shadow-2xl"
    >
      {selection ? (
        <div className="relative flex h-full flex-col bg-white">
          <ResizableDrawerHandle
            resizing={isResizing}
            onPointerDown={startResize}
          />
          <header className="flex items-start justify-between gap-4 px-6 pb-5 pt-6">
            <div className="flex min-w-0 flex-col gap-1.5 pr-8">
              <h2 className="truncate text-base font-medium text-gray-900">
                {selection.employeeName}
              </h2>
              <p className="text-sm font-normal text-gray-500">
                Submitted {formatSelectionSubmittedFull(selection.submittedAt)}
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

          <div className="h-px w-full bg-gray-200" />

          <div className="flex flex-1 flex-col gap-6 overflow-y-auto px-6 py-6">
            <section className="flex flex-wrap items-center gap-2">
              <SelectionStatusBadge status={selection.status} size="md" />
              <InfoPill>
                {selection.employeeRole} · {selection.employeeLevel}
              </InfoPill>
              <InfoPill>{selection.employeeCountry}</InfoPill>
            </section>

            {selection.changeRequestNotes ? (
              <section className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                <div className="flex items-center gap-2">
                  <MessageCircle className="size-4 text-gray-500" />
                  <h3 className="text-sm font-normal text-gray-900">
                    Change request notes
                  </h3>
                </div>
                <p className="mt-2 text-sm font-normal text-gray-600">
                  {selection.changeRequestNotes}
                </p>
              </section>
            ) : null}

            <section className="flex flex-col gap-3">
              <div className="flex items-baseline justify-between">
                <h3 className="text-sm font-medium text-gray-900">
                  Selected items
                </h3>
                <span className="text-xs font-normal text-gray-500">
                  {selection.items.length} item
                  {selection.items.length === 1 ? "" : "s"}
                </span>
              </div>
              <SelectedItemsList items={selection.items} />
            </section>

            <section className="flex items-center justify-between rounded-lg bg-gray-50 px-4 py-3">
              <span className="text-sm font-normal text-gray-600">
                Total cost
              </span>
              <span className="text-base font-medium tabular-nums text-gray-900">
                {formatMoney(selection.totalCost, currencySymbol)}
              </span>
            </section>
          </div>

          <footer className="border-t border-gray-200 bg-white px-6 py-3">
            <div className="grid w-full grid-cols-2 gap-3">
              <Button
                type="button"
                variant="outline"
                className="h-10 w-full gap-2 rounded-lg px-3 text-sm font-normal text-gray-700"
                onClick={() => onRequestChanges(selection)}
                data-testid="employeeselectiondetaildrawer-button"
              >
                <MessageCircle className="size-4" />
                Request changes
              </Button>
              <Button
                type="button"
                disabled={selection.status === "APPROVED"}
                className="h-10 w-full gap-2 rounded-lg px-3 text-sm font-normal"
                onClick={() => {
                  onApprove(selection.id);
                  onClose();
                }}
                data-testid="employeeselectiondetaildrawer-button-2"
              >
                <CheckCircle className="size-4" />
                {selection.status === "APPROVED"
                  ? "Approved"
                  : "Approve selection"}
              </Button>
            </div>
          </footer>
        </div>
      ) : null}
    </Drawer>
  );
}

function InfoPill({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex h-6 items-center rounded-full border border-gray-200 bg-gray-50 px-2 text-xs font-normal text-gray-700">
      {children}
    </span>
  );
}
