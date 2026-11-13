"use client";

import { useState } from "react";
import { Trash02, XClose } from "@untitledui/icons";
import {
  Dialog,
  Modal,
  ModalOverlay,
} from "@/components/application/modals/modal";
import { ButtonUtility } from "@/components/base/buttons/button-utility";
import { FeaturedIcon } from "@/components/foundations/featured-icon/featured-icon";
import {
  ELEVATED_MODAL_CONTENT_CLASS,
  ELEVATED_MODAL_OVERLAY_CLASS,
} from "@/utils/drawerOverlayStacking";
import { type CustomerPlan, planAllowsBuyback } from "../../data/plans";
import type { DisposalMethod, StoredDevice } from "../../types/storage";
import { isDeviceAlreadyErased } from "../../utils/isDeviceAlreadyErased";
import { DisposeBuybackStep } from "./DisposeBuybackStep";
import { DisposeConfirmStep } from "./DisposeConfirmStep";
import { DEFAULT_DISPOSAL_METHOD } from "./DisposalMethodChoice";
import { DisposeReviewStep } from "./DisposeReviewStep";
import type { DisposeStep } from "./types";

interface Props {
  device: StoredDevice | null;
  isOpen: boolean;
  isLoading?: boolean;
  plan: CustomerPlan;
  onClose: () => void;
  onConfirm: (device: StoredDevice, method: DisposalMethod) => void;
  onRequestBuyback: (device: StoredDevice) => void;
}

export function DisposeDeviceModal({
  device,
  isOpen,
  isLoading = false,
  plan,
  onClose,
  onConfirm,
  onRequestBuyback,
}: Readonly<Props>) {
  return (
    <ModalOverlay
      isOpen={isOpen}
      onOpenChange={(open) => {
        if (!open && !isLoading) onClose();
      }}
      isDismissable={!isLoading}
      className={ELEVATED_MODAL_OVERLAY_CLASS}
    >
      <Modal className={ELEVATED_MODAL_CONTENT_CLASS}>
        <Dialog data-testid="disposedevicemodal-dialog">
          {isOpen && device && (
            <DisposeFlow
              key={device.id}
              device={device}
              isLoading={isLoading}
              plan={plan}
              onClose={onClose}
              onConfirm={onConfirm}
              onRequestBuyback={onRequestBuyback}
            />
          )}
        </Dialog>
      </Modal>
    </ModalOverlay>
  );
}

function DisposeFlow({
  device,
  isLoading,
  plan,
  onClose,
  onConfirm,
  onRequestBuyback,
}: Readonly<
  Omit<Props, "device" | "isOpen"> & {
    device: StoredDevice;
    isLoading: boolean;
  }
>) {
  const eligible = planAllowsBuyback(plan);
  const alreadyErased = isDeviceAlreadyErased(device);
  const [step, setStep] = useState<DisposeStep>("review");
  const [method, setMethod] = useState<DisposalMethod>(DEFAULT_DISPOSAL_METHOD);
  const [acknowledged, setAcknowledged] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const confirm = () => {
    if (device.status !== "available" && device.status !== "pending_check") {
      setError(
        "This device has an active request. Resolve it before requesting disposal.",
      );
      return;
    }
    onConfirm(device, method);
  };

  return (
    <div className="flex max-h-[85dvh] w-full max-w-lg flex-col overflow-hidden rounded-xl border border-secondary bg-primary shadow-xl">
      <header className="flex items-start gap-4 border-b border-secondary px-6 py-5">
        <FeaturedIcon icon={Trash02} size="md" color="error" theme="light" />
        <div className="flex-1">
          <h2 className="text-lg font-semibold text-primary">
            Request disposal
          </h2>
          <p className="text-sm text-tertiary">
            Retire {device.deviceName} from storage
          </p>
        </div>
        <ButtonUtility
          size="sm"
          color="tertiary"
          icon={XClose}
          tooltip="Close"
          isDisabled={isLoading}
          onClick={onClose}
        />
      </header>
      <div className="min-h-0 flex-1 overflow-y-auto px-6 py-5">
        {step === "review" && (
          <DisposeReviewStep
            device={device}
            alreadyErased={alreadyErased}
            method={method}
            onMethod={setMethod}
            onCancel={onClose}
            onContinue={() => setStep(eligible ? "buyback" : "confirm")}
          />
        )}
        {step === "buyback" && (
          <DisposeBuybackStep
            onRequestQuote={() => onRequestBuyback(device)}
            onSkip={() => setStep("confirm")}
            onBack={() => setStep("review")}
          />
        )}
        {step === "confirm" && (
          <DisposeConfirmStep
            device={device}
            alreadyErased={alreadyErased}
            method={method}
            acknowledged={acknowledged}
            onAcknowledge={setAcknowledged}
            error={error}
            isLoading={isLoading}
            onBack={() => setStep(eligible ? "buyback" : "review")}
            onConfirm={confirm}
          />
        )}
      </div>
    </div>
  );
}
