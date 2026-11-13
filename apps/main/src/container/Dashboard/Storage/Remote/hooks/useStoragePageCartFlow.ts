"use client";

import { useState } from "react";
import type { BulkRecipient } from "../components/BulkActionsModal";
import type { Recipient } from "../components/deploy/types";
import {
  type DeviceActionKind,
  availableActions,
  canOfferDeviceCheck,
  canQueueDeviceCheck,
} from "../data/deviceActions";
import { REQUEST_KIND_LABEL } from "../data/storageMeta";
import type {
  DisposalMethod,
  RequestKind,
  StoredDevice,
} from "../types/storage";
import { extractApiErrorMessage } from "@/utils/extractApiErrorMessage";
import { queueStorageCartAction } from "../utils/queueStorageCartAction";
import { runWithPending } from "../utils/runWithPending";
import {
  toBulkCartItems,
  toDeployCartItem,
  toDeviceCheckCartItem,
  toDisposeCartItem,
} from "../utils/queueStorageCartActions";

const NO_PERMISSION =
  "You don't have permission to request this. Ask an IT admin on your team.";

type Notify = (
  title: string,
  description: string,
  color?: "success" | "error" | "warning",
) => void;

export function useStoragePageCartFlow({
  readOnly,
  notify,
  checkInProgress,
}: {
  readOnly: boolean;
  notify: Notify;
  checkInProgress: (device: StoredDevice | null) => boolean;
}) {
  const [deployTarget, setDeployTarget] = useState<StoredDevice | null>(null);
  const [disposeTarget, setDisposeTarget] = useState<StoredDevice | null>(null);
  const [checkTarget, setCheckTarget] = useState<StoredDevice | null>(null);
  const [bulk, setBulk] = useState<{
    kind: DeviceActionKind;
    devices: StoredDevice[];
  } | null>(null);
  const [cartActionError, setCartActionError] = useState<string | null>(null);
  const [isCartPending, setIsCartPending] = useState(false);

  const queue = (
    items: Parameters<typeof queueStorageCartAction>[0],
    onSuccess: () => void,
  ) =>
    runWithPending(setIsCartPending, () =>
      queueStorageCartAction(items, onSuccess, (error) => {
        const { title, description } = extractApiErrorMessage(
          error,
          "Could not add this to your cart.",
        );
        setCartActionError(description || title);
      }),
    );

  const onAction = (kind: RequestKind, device: StoredDevice) => {
    if (readOnly) return notify("Read-only access", NO_PERMISSION, "warning");
    setCartActionError(null);
    if (kind === "deployment") return setDeployTarget(device);
    if (kind === "disposal") return setDisposeTarget(device);
    if (kind === "device_check") {
      if (!canOfferDeviceCheck(device) && !checkInProgress(device)) {
        return;
      }
      return setCheckTarget(device);
    }
    notify(
      `${REQUEST_KIND_LABEL[kind]} coming soon`,
      "This action will be available in the next release of Storage.",
    );
  };

  const onBulkAction = (kind: DeviceActionKind, list: StoredDevice[]) => {
    if (readOnly) return notify("Read-only access", NO_PERMISSION, "warning");
    const allowed = list.filter((device) =>
      availableActions(device).includes(kind),
    );
    if (allowed.length > 0) {
      setCartActionError(null);
      setBulk({ kind, devices: allowed });
    }
  };

  const handleDeploy = (
    device: StoredDevice,
    recipient: Recipient,
    wipeRequested?: boolean,
  ) => {
    void queue([toDeployCartItem(device, recipient, wipeRequested)], () =>
      setDeployTarget(null),
    );
  };

  const handleDispose = (device: StoredDevice, method: DisposalMethod) => {
    void queue([toDisposeCartItem(device, method)], () =>
      setDisposeTarget(null),
    );
  };

  const handleRequestCheck = (
    device: StoredDevice,
    reason: string,
    neededBy?: string,
  ) => {
    if (!canQueueDeviceCheck(device, checkInProgress(device))) return;
    void queue([toDeviceCheckCartItem(device, reason, neededBy)], () =>
      setCheckTarget(null),
    );
  };

  const handleBulkConfirm = (
    recipients?: Record<string, BulkRecipient>,
    disposalMethod?: DisposalMethod,
    wipeSelections?: Record<string, boolean>,
  ) => {
    if (!bulk) return;
    void queue(
      toBulkCartItems(
        bulk.kind,
        bulk.devices,
        recipients,
        disposalMethod,
        wipeSelections,
      ),
      () => setBulk(null),
    );
  };

  const handleRequestBuyback = () => {
    notify(
      "Buyback coming soon",
      "Buyback quotes will be available in the next release of Storage.",
    );
    setDisposeTarget(null);
  };

  return {
    bulk,
    cartActionError,
    checkInProgress,
    checkTarget,
    deployTarget,
    disposeTarget,
    handleBulkConfirm,
    handleDeploy,
    handleDispose,
    handleRequestBuyback,
    handleRequestCheck,
    isCartPending,
    onAction,
    onBulkAction,
    setBulk,
    setCheckTarget,
    setDeployTarget,
    setDisposeTarget,
  };
}
