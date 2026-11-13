"use client";

import { UserX } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import {
  preflightModalContentClass,
  preflightModalDescriptionClass,
  preflightModalFooterClass,
  preflightModalTitleClass,
} from "./preflightModalClasses";
import { accountsDetailActionButtonClass } from "./accountsDetailHeaderClasses";

interface Props {
  name: string | null;
  entityName: string;
  pending?: boolean;
  isOpen: boolean;
  isSaving: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export function RevokeEntityAdminDialog({
  name,
  entityName,
  pending = false,
  isOpen,
  isSaving,
  onClose,
  onConfirm,
}: Props) {
  const who = name ?? "This person";

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => !open && !isSaving && onClose()}
      data-testid="revokeentityadmindialog-dialog"
    >
      <DialogContent
        className={cn(preflightModalContentClass, "z-[1012] text-center")}
        overlayClassName="z-[1011]"
      >
        <div className="flex flex-col items-center">
          <div className="flex size-12 items-center justify-center rounded-full bg-error-50 text-error-600">
            <UserX className="size-6" />
          </div>
          <DialogTitle className={preflightModalTitleClass}>
            {pending ? "Cancel invitation?" : "Revoke admin access?"}
          </DialogTitle>
          <DialogDescription className={preflightModalDescriptionClass}>
            {pending
              ? `${who} hasn't accepted yet. Cancel the invitation and they won't join ${entityName} as an admin.`
              : `${who} will no longer be an admin of ${entityName}. They lose their admin access to it.`}
          </DialogDescription>
          <div className={preflightModalFooterClass}>
            <Button
              type="button"
              variant="outline"
              className={accountsDetailActionButtonClass}
              onClick={onClose}
              disabled={isSaving}
              data-testid="revokeentityadmindialog-button"
            >
              {pending ? "Keep invite" : "Cancel"}
            </Button>
            <Button
              type="button"
              variant="destructive"
              className="h-10 rounded-lg text-sm font-semibold"
              onClick={onConfirm}
              isLoading={isSaving}
              data-testid="revokeentityadmindialog-button-2"
            >
              {pending ? "Cancel invitation" : "Revoke access"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
