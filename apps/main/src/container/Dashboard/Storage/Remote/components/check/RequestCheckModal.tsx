"use client";

import { useState } from "react";
import { PackageSearch, XClose } from "@untitledui/icons";
import type { DateValue } from "react-aria-components";
import { DatePicker } from "@/components/application/date-picker/date-picker";
import {
  Dialog,
  Modal,
  ModalOverlay,
} from "@/components/application/modals/modal";
import { ButtonUtility } from "@/components/base/buttons/button-utility";
import { TextArea } from "@/components/base/textarea/textarea";
import { FeaturedIcon } from "@/components/foundations/featured-icon/featured-icon";
import {
  ELEVATED_MODAL_CONTENT_CLASS,
  ELEVATED_MODAL_OVERLAY_CLASS,
} from "@/utils/drawerOverlayStacking";
import type { StoredDevice } from "../../types/storage";
import { DeviceAvatar } from "../DeviceAvatar";
import { CheckFreshness } from "../CheckFreshness";
import { GradeBadge } from "../StorageBadges";
import { RequestCheckFooter } from "./RequestCheckFooter";
import {
  isRequestCheckNeededByUnavailable,
  requestCheckMinNeededByDate,
} from "./requestCheckNeededByDate";

interface Props {
  device: StoredDevice | null;
  isOpen: boolean;
  isLoading?: boolean;
  alreadyInProgress: boolean;
  submitError?: string | null;
  onClose: () => void;
  onConfirm: (
    device: StoredDevice,
    reason: string,
    neededBy?: string,
  ) => void | Promise<void>;
}

export function RequestCheckModal({
  device,
  isOpen,
  isLoading = false,
  alreadyInProgress,
  submitError,
  onClose,
  onConfirm,
}: Props) {
  return (
    <ModalOverlay
      isOpen={isOpen}
      onOpenChange={(open) => !open && !isLoading && onClose()}
      isDismissable={!isLoading}
      className={ELEVATED_MODAL_OVERLAY_CLASS}
    >
      <Modal className={ELEVATED_MODAL_CONTENT_CLASS}>
        <Dialog data-testid="requestcheckmodal-dialog">
          {isOpen && device && (
            <CheckFlow
              key={device.id}
              device={device}
              isLoading={isLoading}
              alreadyInProgress={alreadyInProgress}
              submitError={submitError}
              onClose={onClose}
              onConfirm={onConfirm}
            />
          )}
        </Dialog>
      </Modal>
    </ModalOverlay>
  );
}

function CheckFlow({
  device,
  isLoading,
  alreadyInProgress,
  submitError = null,
  onClose,
  onConfirm,
}: {
  device: StoredDevice;
  isLoading: boolean;
  alreadyInProgress: boolean;
  submitError?: string | null;
  onClose: () => void;
  onConfirm: Props["onConfirm"];
}) {
  const [reason, setReason] = useState("");
  const [neededBy, setNeededBy] = useState<DateValue | null>(null);
  const pendingBlocked =
    alreadyInProgress || /pending device check/i.test(submitError ?? "");

  return (
    <div className="flex max-h-[85dvh] w-full max-w-lg flex-col overflow-hidden rounded-xl border border-secondary bg-primary shadow-xl">
      <header className="flex items-start gap-4 border-b border-secondary px-6 py-5">
        <FeaturedIcon
          icon={PackageSearch}
          size="md"
          color="brand"
          theme="light"
        />
        <div className="flex-1">
          <h2 className="text-lg font-semibold text-primary">
            Request device check
          </h2>
          <p className="text-sm text-tertiary">
            Re-grade {device.deviceName} in storage
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

      <div className="flex min-h-0 flex-1 flex-col gap-5 overflow-y-auto px-6 py-5">
        <div className="flex items-center gap-3 rounded-lg border border-secondary p-3">
          <DeviceAvatar
            image={device.image}
            assetType={device.assetType}
            name={device.deviceName}
            size="md"
          />
          <div className="flex flex-1 flex-col">
            <span className="text-sm font-semibold text-primary">
              {device.deviceName}
            </span>
            <span className="text-xs text-tertiary">
              {device.serialNumber} · {device.country}
            </span>
          </div>
          <span className="flex flex-col items-end gap-1">
            {device.grade ? (
              <GradeBadge grade={device.grade} label={device.gradeLabel} />
            ) : (
              <span className="text-xs text-quaternary">Ungraded</span>
            )}
            <CheckFreshness device={device} />
          </span>
        </div>

        {(alreadyInProgress || pendingBlocked) && (
          <div className="rounded-lg bg-warning-secondary p-3 text-sm text-warning-primary">
            {submitError ?? "A check is already in progress for this device."}
          </div>
        )}

        <TextArea
          label="Reason for this check (optional)"
          value={reason}
          onChange={setReason}
          placeholder="e.g. Pre-deployment check for a senior hire"
          rows={3}
        />

        <div className="flex flex-col gap-1.5">
          <span className="text-sm font-medium text-secondary">
            When do you need this by? (optional)
          </span>
          <DatePicker
            aria-label="Requested by"
            value={neededBy}
            onChange={setNeededBy}
            minValue={requestCheckMinNeededByDate()}
            isDateUnavailable={isRequestCheckNeededByUnavailable}
          />
        </div>

        <div className="flex flex-col gap-1 rounded-lg bg-secondary p-3">
          <span className="text-sm text-secondary">
            A device check is charged per device — added to your cart and billed
            at checkout.
          </span>
          <span className="text-xs text-quaternary">
            Storage Device Check — {device.model} — {device.country}
          </span>
        </div>
      </div>

      <RequestCheckFooter
        canConfirm={!pendingBlocked}
        isLoading={isLoading}
        onClose={onClose}
        onConfirm={() => onConfirm(device, reason, neededBy?.toString())}
      />
    </div>
  );
}
