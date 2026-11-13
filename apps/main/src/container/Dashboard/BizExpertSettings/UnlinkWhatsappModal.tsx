"use client";

import { Unlink, X } from "lucide-react";
import { FeaturedIcon } from "@/components/FeaturedIcon";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import type { WhatsappIdentity } from "@/types/bizexpert";
import {
  unlinkWhatsappDescription,
  unlinkWhatsappTitle,
} from "./unlinkWhatsappCopy";
import {
  settingsDeleteModalBodyClass,
  settingsDeleteModalCancelClass,
  settingsDeleteModalCloseButtonClass,
  settingsDeleteModalConfirmClass,
  settingsDeleteModalContentClass,
  settingsDeleteModalFooterClass,
  settingsDeleteModalTitleClass,
} from "./settingsPageClasses";

type Props = {
  isOpen: boolean;
  identity: WhatsappIdentity;
  isUnlinking: boolean;
  onClose: () => void;
  onConfirm: () => void;
};

export function UnlinkWhatsappModal({
  isOpen,
  identity,
  isUnlinking,
  onClose,
  onConfirm,
}: Props) {
  const title = unlinkWhatsappTitle();

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open && !isUnlinking) onClose();
      }}
    >
      <DialogContent
        className={settingsDeleteModalContentClass}
        showCloseButton={false}
      >
        <DialogTitle className="sr-only">{title}</DialogTitle>
        <button
          type="button"
          aria-label="Close"
          onClick={onClose}
          className={settingsDeleteModalCloseButtonClass}
          disabled={isUnlinking}
        >
          <X className="size-5 shrink-0" />
        </button>
        <FeaturedIcon
          icon={Unlink}
          size="md"
          color="error"
          theme="light"
          className="rounded-full"
        />
        <h3 className={settingsDeleteModalTitleClass}>{title}</h3>
        <DialogDescription className={settingsDeleteModalBodyClass}>
          {unlinkWhatsappDescription(identity.whatsappPhone)}
        </DialogDescription>
        <div className={settingsDeleteModalFooterClass}>
          <Button
            variant="outline"
            size="md"
            className={settingsDeleteModalCancelClass}
            onClick={onClose}
            disabled={isUnlinking}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            size="md"
            className={settingsDeleteModalConfirmClass}
            isLoading={isUnlinking}
            onClick={onConfirm}
          >
            Unlink number
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
