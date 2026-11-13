"use client";

import { CheckCircle2, CreditCard, Lock, X } from "lucide-react";
import { FeaturedIcon } from "@/components/FeaturedIcon";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import type { Subsidiary } from "../types";
import { cardProcessorLabel, replaceCardCopy } from "../utils/replaceCardCopy";
import { accountsDetailActionButtonClass } from "./accountsDetailHeaderClasses";
import {
  editCardOnFileFieldClass,
  editCardOnFileIconWrapClass,
  editCardOnFileStatusClass,
  editSubsidiaryFooterButtonClass,
  editSubsidiaryFooterClass,
  editSubsidiaryModalCloseButtonClass,
  editSubsidiaryModalContentClass,
  editSubsidiaryModalDescriptionClass,
  editSubsidiaryModalHeaderClass,
  editSubsidiaryModalTitleClass,
} from "./editSubsidiaryModalClasses";

interface Props {
  subsidiary: Subsidiary | null;
  processor: string | null;
  isOpen: boolean;
  isConfirming: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export function ReplaceCardModal({
  subsidiary,
  processor,
  isOpen,
  isConfirming,
  onClose,
  onConfirm,
}: Props) {
  const copy = replaceCardCopy(
    Boolean(subsidiary?.cardOnFile),
    subsidiary?.name ?? "this entity",
    cardProcessorLabel(processor),
  );
  const hasCard = Boolean(subsidiary?.cardOnFile);

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open && !isConfirming) onClose();
      }}
      data-testid="replacecardmodal-dialog"
    >
      <DialogContent
        className={editSubsidiaryModalContentClass}
        showCloseButton={false}
        onPointerDownOutside={(event) => {
          if (isConfirming) event.preventDefault();
        }}
        onEscapeKeyDown={(event) => {
          if (isConfirming) event.preventDefault();
        }}
      >
        <DialogTitle className="sr-only">{copy.title}</DialogTitle>
        <div className={editSubsidiaryModalHeaderClass}>
          <FeaturedIcon
            icon={CreditCard}
            size="md"
            color="brand"
            theme="light"
          />
          <button
            type="button"
            aria-label="Close"
            onClick={onClose}
            disabled={isConfirming}
            className={editSubsidiaryModalCloseButtonClass}
          >
            <X className="size-5" />
          </button>
        </div>
        <h3 className={editSubsidiaryModalTitleClass}>{copy.title}</h3>
        <p className={editSubsidiaryModalDescriptionClass}>
          {copy.description}
        </p>
        <div className="mt-5 flex flex-col gap-3">
          <div className={editCardOnFileFieldClass}>
            <div className={editCardOnFileIconWrapClass}>
              <CreditCard className="size-5 text-primary-600" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-gray-900">
                Card on file
              </p>
              {hasCard ? (
                <p className={editCardOnFileStatusClass}>
                  <CheckCircle2 className="size-4 shrink-0" />
                  {copy.status}
                </p>
              ) : (
                <p className="text-sm text-gray-600">{copy.status}</p>
              )}
            </div>
          </div>
          <p className="flex items-center gap-2 text-xs text-gray-500">
            <Lock className="size-4 shrink-0" />
            {copy.secure}
          </p>
        </div>
        <div className={editSubsidiaryFooterClass}>
          <Button
            type="button"
            variant="outline"
            className={`${editSubsidiaryFooterButtonClass} ${accountsDetailActionButtonClass}`}
            onClick={onClose}
            disabled={isConfirming}
            data-testid="replacecardmodal-button"
          >
            Cancel
          </Button>
          <Button
            type="button"
            className={`${editSubsidiaryFooterButtonClass} h-10 gap-1.5`}
            onClick={onConfirm}
            isLoading={isConfirming}
            disabled={isConfirming}
            data-testid="replacecardmodal-button-2"
          >
            <CreditCard className="size-5" />
            {copy.confirm}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
