"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { GripVertical, X } from "lucide-react";
import Drawer from "react-modern-drawer";
import { Button } from "@/components/ui/button";
import { useUpdateKitMutation } from "@/api/baseQueries/companiesApi/kitsApi/updateKit";
import { useAuthUserDetail } from "@/utils/useAuthUser";
import displayErrorMessage from "@/utils/displayErrorMessage";
import displaySuccessMessage from "@/utils/displaySuccessMessage";
import type { FulfillmentMode, Kit, KitListItem } from "../types";
import { extractKitErrorMessage, getKitFulfillmentMode } from "../utils";
import KitDetailsFields from "./KitDetailsFields";
import { useWorkspaceCompanyId } from "@/hooks/useWorkspaceCompanyId";

interface Props {
  kit: Kit | KitListItem | null;
  onClose: () => void;
  onSaved?: () => void;
}

const MIN_WIDTH = 360;
const MAX_WIDTH = 960;
const DEFAULT_WIDTH = 400;

const KitEditDrawer = ({ kit, onClose, onSaved }: Props) => {
  const [mounted, setMounted] = useState(false);
  const [width, setWidth] = useState(DEFAULT_WIDTH);
  const [isResizing, setIsResizing] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [mode, setMode] = useState<FulfillmentMode>("split");
  const [nameError, setNameError] = useState("");

  const { getCompanyDetails } = useAuthUserDetail();
  const company = getCompanyDetails();
  const companyId = useWorkspaceCompanyId();
  const [updateKit, { isLoading }] = useUpdateKitMutation();

  const resizeStart = useRef({ x: 0, width: DEFAULT_WIDTH });

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!kit) return;
    setName(kit.name ?? "");
    setDescription(("description" in kit ? kit.description : "") ?? "");
    setMode(getKitFulfillmentMode(kit.fulfillment_mode));
    setNameError("");
  }, [kit]);

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

  const startResize = (event: React.PointerEvent<HTMLDivElement>) => {
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

  const save = async () => {
    const trimmed = name.trim();
    if (!trimmed) return setNameError("Kit name is required.");
    if (!kit || !companyId) return;

    try {
      await updateKit({
        companyId: companyId,
        kitId: kit.id,
        payload: {
          name: trimmed,
          description: description.trim() || null,
          fulfillment_mode: mode,
        },
      }).unwrap();
      displaySuccessMessage("Kit updated", "Kit details have been saved.");
      onSaved?.();
      onClose();
    } catch (error) {
      displayErrorMessage(
        extractKitErrorMessage(error, "Failed to update kit"),
      );
    }
  };

  if (!mounted) return null;

  return (
    <Drawer
      open={Boolean(kit)}
      onClose={onClose}
      direction="right"
      enableOverlay
      lockBackgroundScroll
      duration={isResizing ? 0 : 200}
      size={width}
      zIndex={1004}
      overlayOpacity={0.4}
      overlayColor="#0C111D"
      className="border-l border-gray-200 bg-white shadow-2xl"
    >
      <div className="relative flex h-full flex-col">
        <div
          role="separator"
          aria-orientation="vertical"
          aria-label="Resize drawer"
          onPointerDown={startResize}
          className="group absolute left-0 top-0 z-10 flex h-full w-2 -translate-x-1/2 cursor-col-resize items-center justify-center"
        >
          <span
            className={
              "flex h-8 w-5 items-center justify-center rounded-md border border-gray-200 bg-white text-gray-400 shadow-md transition group-hover:text-gray-600" +
              (isResizing ? " text-gray-600" : "")
            }
          >
            <GripVertical className="size-3.5" strokeWidth={2.5} />
          </span>
        </div>

        <div className="flex items-start justify-between gap-4 border-b border-gray-200 px-6 py-5">
          <div className="flex flex-col gap-1">
            <h2 className="text-lg font-semibold text-gray-900">Edit Kit</h2>
            <p className="text-sm text-gray-500">
              Update kit details and fulfillment mode.
            </p>
          </div>
          <button
            type="button"
            aria-label="Close"
            onClick={onClose}
            className="-mr-1 -mt-1 rounded-md p-1 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
          >
            <X className="size-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-5">
          <KitDetailsFields
            withSeparator
            name={name}
            description={description}
            fulfillmentMode={mode}
            nameError={nameError}
            onNameChange={(value) => {
              setName(value);
              setNameError("");
            }}
            onDescriptionChange={setDescription}
            onFulfillmentModeChange={setMode}
          />
        </div>

        <div className="flex justify-end gap-3 border-t border-gray-200 bg-white px-6 py-4">
          <Button
            variant="outline"
            size="sm"
            onClick={onClose}
            disabled={isLoading}
            data-testid="kiteditdrawer-button"
          >
            Cancel
          </Button>
          <Button
            size="sm"
            onClick={save}
            disabled={isLoading}
            data-testid="kiteditdrawer-button-2"
          >
            {isLoading ? "Saving..." : "Save"}
          </Button>
        </div>
      </div>
    </Drawer>
  );
};

export default KitEditDrawer;
