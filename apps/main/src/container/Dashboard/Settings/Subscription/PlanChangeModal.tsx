"use client";

import {
  CheckCircle,
  CreditCard02,
  MinusCircle,
  SwitchVertical01,
} from "@untitledui/icons";
import {
  Dialog,
  Modal,
  ModalOverlay,
} from "@/components/application/modals/modal";
import { Button } from "@/components/base/buttons/button";
import { CloseButton } from "@/components/base/buttons/close-button";
import { FeaturedIcon } from "@/components/foundations/featured-icon/featured-icon";
import { StripeIcon } from "@/components/foundations/payment-icons";
import { PAYMENT_TRUST } from "./featureHints";
import type { PlanChangeMode } from "./subscriptionView";

export function PlanChangeModal({
  open,
  mode,
  planName,
  currentName,
  rateLabel,
  devices,
  total,
  startsOn,
  description,
  features,
  isLoading,
  canPay,
  blockers = [],
  onClose,
  onConfirm,
}: {
  open: boolean;
  mode: PlanChangeMode;
  planName: string;
  currentName: string;
  rateLabel: string;
  devices: number;
  total: string;
  startsOn: string;
  description: string;
  features: string[];
  isLoading: boolean;
  canPay: boolean;
  blockers?: string[];
  onClose: () => void;
  onConfirm: () => void;
}) {
  if (!open || mode === "current") return null;
  const upgrade = mode === "upgrade";
  const title = upgrade ? `Upgrade to ${planName}` : `Switch to ${planName}`;
  const listed = features.slice(0, 4);
  const extra = features.length - listed.length;
  const blocked = blockers.length > 0;

  return (
    <ModalOverlay
      isOpen
      isDismissable={!isLoading}
      onOpenChange={(next) => !next && onClose()}
      className="z-[1003]"
    >
      <Modal className="z-[1003] max-w-lg">
        <Dialog data-testid="planchangemodal-dialog">
          <div className="flex w-full flex-col rounded-2xl bg-primary p-6 shadow-xl">
            <div className="flex items-start justify-between gap-4">
              <FeaturedIcon
                icon={upgrade ? CreditCard02 : SwitchVertical01}
                size="md"
                color={upgrade ? "brand" : "warning"}
                theme="light"
              />
              {!isLoading && <CloseButton size="sm" onPress={onClose} />}
            </div>
            <h3 className="mt-4 text-md font-semibold text-primary">{title}</h3>
            <p className="mt-1 text-sm text-tertiary">{description}</p>
            <div className="mt-5 flex flex-col gap-3 rounded-xl border border-secondary bg-secondary p-4">
              <div className="flex items-center justify-between gap-4">
                <span className="text-sm text-tertiary">{planName}</span>
                <span className="text-sm text-secondary tabular-nums">
                  {rateLabel}
                </span>
              </div>
              <div className="flex items-center justify-between gap-4">
                <span className="text-sm text-tertiary">Devices</span>
                <span className="text-sm text-secondary tabular-nums">
                  {devices}
                </span>
              </div>
              <div className="h-px w-full bg-border-secondary" />
              <div className="flex items-center justify-between gap-4">
                <span className="text-sm font-semibold text-primary">
                  {upgrade ? "Due today" : `From ${startsOn}`}
                </span>
                <span className="text-lg font-semibold text-primary tabular-nums">
                  {total}
                </span>
              </div>
              {upgrade && devices > 0 && (
                <p className="text-xs text-tertiary">
                  Then {total} on {startsOn}, and monthly after that.
                </p>
              )}
            </div>
            {blocked && (
              <div className="mt-5 flex flex-col gap-2">
                <p className="text-sm font-semibold text-primary">
                  Resolve this before switching
                </p>
                <ul className="flex flex-col gap-2">
                  {blockers.map((item) => (
                    <li
                      key={item}
                      className="flex items-start gap-2 text-sm text-secondary"
                    >
                      <MinusCircle className="mt-0.5 size-4 shrink-0 text-warning-primary" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {listed.length > 0 && (
              <div className="mt-5 flex flex-col gap-2">
                <p className="text-sm font-semibold text-primary">
                  {upgrade ? "What you get" : "What you lose"}
                </p>
                <ul className="flex flex-col gap-2">
                  {listed.map((feature) => (
                    <li
                      key={feature}
                      className="flex items-start gap-2 text-sm text-secondary"
                    >
                      {upgrade ? (
                        <CheckCircle className="mt-0.5 size-4 shrink-0 text-fg-success-primary" />
                      ) : (
                        <MinusCircle className="mt-0.5 size-4 shrink-0 text-fg-quaternary" />
                      )}
                      {feature}
                    </li>
                  ))}
                </ul>
                {extra > 0 && (
                  <p className="text-xs text-tertiary">
                    Plus {extra} more in the full comparison below.
                  </p>
                )}
              </div>
            )}
            {upgrade && (
              <div className="mt-5 flex items-center gap-2 text-xs text-quaternary">
                <StripeIcon className="h-5 w-7 shrink-0" />
                {PAYMENT_TRUST}
              </div>
            )}
            <div className="mt-6 grid grid-cols-2 gap-3">
              <Button
                color="secondary"
                size="md"
                className="w-full"
                onClick={onClose}
                data-testid="planchangemodal-button"
              >
                {upgrade ? "Cancel" : `Keep ${currentName}`}
              </Button>
              <Button
                color="primary"
                size="md"
                className="w-full"
                isDisabled={!canPay || isLoading || blocked}
                isLoading={isLoading}
                iconLeading={upgrade ? CreditCard02 : SwitchVertical01}
                onClick={onConfirm}
                data-testid="planchangemodal-button-2"
              >
                {upgrade ? "Continue to Stripe" : `Switch to ${planName}`}
              </Button>
            </div>
            {!canPay && !blocked && (
              <p className="mt-3 text-xs text-tertiary">
                {upgrade
                  ? "Checkout is not available for this plan yet."
                  : "This switch cannot be scheduled yet."}
              </p>
            )}
          </div>
        </Dialog>
      </Modal>
    </ModalOverlay>
  );
}
