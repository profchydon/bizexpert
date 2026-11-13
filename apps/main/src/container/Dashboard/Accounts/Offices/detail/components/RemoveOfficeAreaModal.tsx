"use client";

import { useEffect, useState } from "react";
import { AlertTriangle, Trash2, X } from "lucide-react";
import { FeaturedIcon } from "@/components/FeaturedIcon";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import type { ServerOfficeArea } from "@/types/offices";
import { buildOfficeAreaRemoveCopy } from "../utils/officeAreaRemoveCopy";
import {
  removeAreaModalBodyClass,
  removeAreaModalCancelButtonClass,
  removeAreaModalCloseButtonClass,
  removeAreaModalConfirmButtonClass,
  removeAreaModalContentClass,
  removeAreaModalDismissButtonClass,
  removeAreaModalSingleFooterClass,
  removeAreaModalSplitFooterClass,
  removeAreaModalTitleClass,
} from "./removeOfficeAreaModalClasses";

interface Props {
  area: ServerOfficeArea | null;
  isOpen: boolean;
  isRemoving?: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export function RemoveOfficeAreaModal({
  area,
  isOpen,
  isRemoving = false,
  onClose,
  onConfirm,
}: Props) {
  const [lastArea, setLastArea] = useState<ServerOfficeArea | null>(area);

  useEffect(() => {
    if (area) setLastArea(area);
  }, [area]);

  const shownArea = area ?? lastArea;
  const { blocked, title, body } = buildOfficeAreaRemoveCopy(
    shownArea?.name ?? "",
    shownArea?.asset_count ?? 0,
  );

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => !open && onClose()}
      data-testid="removeofficeareamodal-dialog"
    >
      <DialogContent
        className={removeAreaModalContentClass}
        showCloseButton={false}
      >
        <DialogTitle className="sr-only">{title}</DialogTitle>
        <button
          type="button"
          aria-label="Close"
          onClick={onClose}
          className={removeAreaModalCloseButtonClass}
        >
          <X className="size-5 shrink-0" />
        </button>
        <FeaturedIcon
          icon={blocked ? AlertTriangle : Trash2}
          size="md"
          color={blocked ? "warning" : "error"}
          theme="light"
          className="rounded-full"
        />
        <h3 className={removeAreaModalTitleClass}>{title}</h3>
        <p className={removeAreaModalBodyClass}>{body}</p>
        {blocked ? (
          <div className={removeAreaModalSingleFooterClass}>
            <Button
              size="md"
              className={removeAreaModalDismissButtonClass}
              onClick={onClose}
              data-testid="removeofficeareamodal-button"
            >
              Got it
            </Button>
          </div>
        ) : (
          <div className={removeAreaModalSplitFooterClass}>
            <Button
              variant="outline"
              size="md"
              className={removeAreaModalCancelButtonClass}
              onClick={onClose}
              data-testid="removeofficeareamodal-button-2"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              size="md"
              className={removeAreaModalConfirmButtonClass}
              isLoading={isRemoving}
              onClick={onConfirm}
              data-testid="removeofficeareamodal-button-3"
            >
              Remove area
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
