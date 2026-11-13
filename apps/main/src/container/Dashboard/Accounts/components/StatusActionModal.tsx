"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, CreditCard, DollarSign, X } from "lucide-react";
import { FeaturedIcon } from "@/components/FeaturedIcon";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import type { Subsidiary } from "../types";
import { formatCurrencyAmount } from "../utils/formatCurrencyAmount";
import type { BannerAction } from "./SubsidiaryStatusBanner";
import {
  statusActionModalBodyClass,
  statusActionModalCloseButtonClass,
  statusActionModalContentClass,
  statusActionModalDescriptionClass,
  statusActionModalFooterClass,
  statusActionModalTitleClass,
} from "./statusActionModalClasses";

interface ActionConfig {
  icon: typeof CreditCard;
  color: "brand" | "warning" | "success";
  title: string;
  body: (subsidiary: Subsidiary) => string;
  confirmLabel: string;
  resolves: boolean;
}

const ACTIONS: Record<BannerAction, ActionConfig> = {
  "card-capture": {
    icon: CreditCard,
    color: "brand",
    title: "Complete card capture",
    body: () =>
      "You'll be taken to Stripe's secure hosted page to add a card for this entity, then returned here. Billing activates as soon as capture completes.",
    confirmLabel: "Continue to Stripe",
    resolves: true,
  },
  "settle-invoice": {
    icon: DollarSign,
    color: "warning",
    title: "Settle outstanding invoice",
    body: (subsidiary) =>
      `An invoice of ${formatCurrencyAmount(subsidiary.currency, 3200)} is 15+ days overdue. Pay it now to lift the suspension and restore this entity's credit.`,
    confirmLabel: "Pay now",
    resolves: true,
  },
};

interface Props {
  action: BannerAction | null;
  subsidiary: Subsidiary;
  onClose: () => void;
  onResolve: (action: BannerAction) => void | Promise<void>;
  isConfirmLoading?: boolean;
}

export function StatusActionModal({
  action,
  subsidiary,
  onClose,
  onResolve,
  isConfirmLoading = false,
}: Props) {
  const [sent, setSent] = useState(false);
  const [confirmPending, setConfirmPending] = useState(false);
  const config = action ? ACTIONS[action] : null;
  const confirmLoading = isConfirmLoading || confirmPending;

  useEffect(() => {
    if (!action) setConfirmPending(false);
  }, [action]);

  function handleClose() {
    onClose();
    setSent(false);
    setConfirmPending(false);
  }

  function handleConfirm() {
    if (!action || !config || confirmLoading) return;
    if (config.resolves) {
      setConfirmPending(true);
      void onResolve(action);
      return;
    }
    setSent(true);
  }

  return (
    <Dialog
      open={action !== null}
      onOpenChange={(open) => {
        if (!open && !confirmLoading) handleClose();
      }}
      data-testid="statusactionmodal-dialog"
    >
      <DialogContent
        className={statusActionModalContentClass}
        showCloseButton={false}
        onPointerDownOutside={(event) => {
          if (confirmLoading) event.preventDefault();
        }}
        onEscapeKeyDown={(event) => {
          if (confirmLoading) event.preventDefault();
        }}
      >
        <DialogTitle className="sr-only">{config?.title}</DialogTitle>
        <div className={statusActionModalBodyClass}>
          {config && (
            <>
              <button
                type="button"
                aria-label="Close"
                onClick={handleClose}
                disabled={confirmLoading}
                className={statusActionModalCloseButtonClass}
              >
                <X className="size-5" />
              </button>
              <FeaturedIcon
                icon={sent ? CheckCircle2 : config.icon}
                size="md"
                color={sent ? "success" : config.color}
                theme="light"
                className="mx-auto rounded-full"
              />
              <h3 className={statusActionModalTitleClass}>
                {sent ? "Request sent" : config.title}
              </h3>
              <p className={statusActionModalDescriptionClass}>
                {sent
                  ? `Rayda will reach out about ${subsidiary.name} shortly.`
                  : config.body(subsidiary)}
              </p>
              {sent ? (
                <Button
                  className="mt-6 w-full"
                  onClick={handleClose}
                  data-testid="statusactionmodal-button"
                >
                  Done
                </Button>
              ) : (
                <div className={statusActionModalFooterClass}>
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={handleClose}
                    disabled={confirmLoading}
                    data-testid="statusactionmodal-button-2"
                  >
                    Cancel
                  </Button>
                  <Button
                    className="w-full"
                    onClick={handleConfirm}
                    isLoading={confirmLoading}
                    disabled={confirmLoading}
                    aria-label={config.confirmLabel}
                    data-testid="statusactionmodal-button-3"
                  >
                    {confirmLoading ? "Redirecting…" : config.confirmLabel}
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
