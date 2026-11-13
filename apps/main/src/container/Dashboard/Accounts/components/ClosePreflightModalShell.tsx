"use client";

import { Trash2, X } from "lucide-react";
import type { ReactNode } from "react";
import { FeaturedIcon } from "@/components/FeaturedIcon";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import {
  preflightModalCloseButtonClass,
  preflightModalContentClass,
  preflightModalDescriptionClass,
  preflightModalFooterClass,
  preflightModalHeaderClass,
  preflightModalTitleClass,
} from "./preflightModalClasses";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  subjectName: string;
  description: string;
  testId: string;
  children: ReactNode;
  footer: ReactNode;
}

export function ClosePreflightModalShell({
  isOpen,
  onClose,
  subjectName,
  description,
  testId,
  children,
  footer,
}: Props) {
  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
      data-testid="closepreflightmodalshell-dialog"
    >
      <DialogContent
        className={preflightModalContentClass}
        showCloseButton={false}
      >
        <DialogTitle className="sr-only">Close {subjectName}</DialogTitle>
        <div className={preflightModalHeaderClass}>
          <FeaturedIcon icon={Trash2} size="md" color="error" theme="light" />
          <button
            type="button"
            aria-label="Close"
            onClick={onClose}
            className={preflightModalCloseButtonClass}
          >
            <X className="size-5" />
          </button>
        </div>
        <h3 className={preflightModalTitleClass}>Close {subjectName}?</h3>
        <p className={preflightModalDescriptionClass}>{description}</p>
        {children}
        <div className={preflightModalFooterClass}>{footer}</div>
      </DialogContent>
    </Dialog>
  );
}
