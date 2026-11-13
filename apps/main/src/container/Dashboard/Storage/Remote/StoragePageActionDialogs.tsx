"use client";

import {
  BulkActionsModal,
  type BulkRecipient,
} from "./components/BulkActionsModal";
import { RequestCheckModal } from "./components/check/RequestCheckModal";
import { DeployToEmployeeModal } from "./components/deploy/DeployToEmployeeModal";
import type { Recipient } from "./components/deploy/types";
import { DisposeDeviceModal } from "./components/dispose/DisposeDeviceModal";
import type { CustomerPlan } from "./data/plans";
import type { DeviceActionKind } from "./data/deviceActions";
import type { DisposalMethod, StoredDevice } from "./types/storage";

type StoragePageActionDialogsProps = {
  bulk: { kind: DeviceActionKind; devices: StoredDevice[] } | null;
  checkInProgress: (device: StoredDevice | null) => boolean;
  checkTarget: StoredDevice | null;
  deployTarget: StoredDevice | null;
  disposeTarget: StoredDevice | null;
  onBulkClose: () => void;
  onBulkConfirm: (
    recipients?: Record<string, BulkRecipient>,
    disposalMethod?: DisposalMethod,
    wipeSelections?: Record<string, boolean>,
  ) => void;
  onCheckClose: () => void;
  onCheckConfirm: (
    device: StoredDevice,
    reason: string,
    neededBy?: string,
  ) => void | Promise<void>;
  checkSubmitError?: string | null;
  onDeployClose: () => void;
  onDeployConfirm: (
    device: StoredDevice,
    recipient: Recipient,
    wipeRequested?: boolean,
  ) => void;
  onDisposeClose: () => void;
  onDisposeConfirm: (device: StoredDevice, method: DisposalMethod) => void;
  onRequestBuyback: () => void;
  plan: CustomerPlan;
  isCartPending?: boolean;
};

export function StoragePageActionDialogs({
  bulk,
  checkInProgress,
  checkTarget,
  deployTarget,
  disposeTarget,
  onBulkClose,
  onBulkConfirm,
  onCheckClose,
  onCheckConfirm,
  checkSubmitError = null,
  onDeployClose,
  onDeployConfirm,
  onDisposeClose,
  onDisposeConfirm,
  onRequestBuyback,
  plan,
  isCartPending = false,
}: StoragePageActionDialogsProps) {
  return (
    <>
      <DeployToEmployeeModal
        device={deployTarget}
        isOpen={Boolean(deployTarget)}
        isLoading={isCartPending}
        onClose={onDeployClose}
        onConfirm={onDeployConfirm}
      />
      <DisposeDeviceModal
        device={disposeTarget}
        isOpen={Boolean(disposeTarget)}
        isLoading={isCartPending}
        plan={plan}
        onClose={onDisposeClose}
        onConfirm={onDisposeConfirm}
        onRequestBuyback={onRequestBuyback}
      />
      <RequestCheckModal
        device={checkTarget}
        isOpen={Boolean(checkTarget)}
        isLoading={isCartPending}
        alreadyInProgress={checkInProgress(checkTarget)}
        submitError={checkSubmitError}
        onClose={onCheckClose}
        onConfirm={onCheckConfirm}
      />
      <BulkActionsModal
        kind={bulk?.kind ?? null}
        devices={bulk?.devices ?? []}
        isOpen={Boolean(bulk)}
        isLoading={isCartPending}
        onClose={onBulkClose}
        onConfirm={onBulkConfirm}
      />
    </>
  );
}
