"use client";

import { type FC, useEffect, useState } from "react";
import { PackageSearch, Send01, Trash01, XClose } from "@untitledui/icons";
import {
  Dialog,
  Modal,
  ModalOverlay,
} from "@/components/application/modals/modal";
import { Button } from "@/components/base/buttons/button";
import { ButtonUtility } from "@/components/base/buttons/button-utility";
import { Checkbox } from "@/components/base/checkbox/checkbox";
import { FeaturedIcon } from "@/components/foundations/featured-icon/featured-icon";
import { useEmployeeDirectory } from "@/container/Dashboard/Storage/Remote/support/Employees/data/employee-directory";
import {
  ELEVATED_MODAL_CONTENT_CLASS,
  ELEVATED_MODAL_OVERLAY_CLASS,
} from "@/utils/drawerOverlayStacking";
import { cx } from "@/utils/cx";
import type { DeviceActionKind } from "../data/deviceActions";
import type { DisposalMethod, StoredDevice } from "../types/storage";
import { BulkDeployAssign } from "./BulkDeployAssign";
import { CountryFlag } from "./CountryFlag";
import { DeviceAvatar } from "./DeviceAvatar";
import { BulkWipeBanner } from "./deploy/WipePrompts";
import {
  DisposalMethodChoice,
  DEFAULT_DISPOSAL_METHOD,
} from "./dispose/DisposalMethodChoice";

export interface BulkRecipient {
  id: string;
  name: string;
  country: string;
}

interface ActionConfig {
  title: string;
  confirm: string;
  color: "primary" | "primary-destructive";
  blurb: string;
  icon: FC<{ className?: string }>;
  iconColor: "brand" | "error";
}

const CFG: Record<DeviceActionKind, ActionConfig> = {
  deployment: {
    title: "Deploy devices",
    confirm: "Confirm deployment",
    color: "primary",
    blurb: "Choose who each device ships to.",
    icon: Send01,
    iconColor: "brand",
  },
  device_check: {
    title: "Request device check",
    confirm: "Request checks",
    color: "primary",
    blurb: "We'll re-check and update the condition grade for these devices.",
    icon: PackageSearch,
    iconColor: "brand",
  },
  disposal: {
    title: "Request disposal",
    confirm: "Confirm disposal",
    color: "primary-destructive",
    blurb: "Choose whether to donate or destroy these devices.",
    icon: Trash01,
    iconColor: "error",
  },
};

interface Props {
  kind: DeviceActionKind | null;
  devices: StoredDevice[];
  isOpen: boolean;
  isLoading?: boolean;
  onClose: () => void;
  onConfirm: (
    recipients?: Record<string, BulkRecipient>,
    disposalMethod?: DisposalMethod,
    wipeSelections?: Record<string, boolean>,
  ) => void;
}

export function BulkActionsModal({
  kind,
  devices,
  isOpen,
  isLoading = false,
  onClose,
  onConfirm,
}: Props) {
  const employees = useEmployeeDirectory();
  const [assignments, setAssignments] = useState<Record<string, string | null>>(
    {},
  );
  const [ack, setAck] = useState(false);
  const [wipeSel, setWipeSel] = useState<Record<string, boolean>>({});
  const [disposalMethod, setDisposalMethod] = useState<DisposalMethod>(
    DEFAULT_DISPOSAL_METHOD,
  );

  // Not-wiped devices start with their wipe checkbox ticked (recommended default).
  useEffect(() => {
    if (isOpen) {
      setAssignments({});
      setAck(false);
      setWipeSel(
        Object.fromEntries(
          devices
            .filter((d) => d.wipeStatus === "not_wiped")
            .map((d) => [d.id, true]),
        ),
      );
      setDisposalMethod(DEFAULT_DISPOSAL_METHOD);
    }
  }, [isOpen, kind, devices]);
  if (!kind || devices.length === 0) return null;

  const cfg = CFG[kind];
  const isDeploy = kind === "deployment";
  const notWiped = isDeploy
    ? devices.filter((d) => d.wipeStatus === "not_wiped").length
    : 0;
  const assignedCount = devices.filter((d) => assignments[d.id]).length;
  const canConfirm = isDeploy
    ? assignedCount === devices.length
    : kind === "disposal"
      ? ack
      : true;

  const assignAll = (employeeId: string) =>
    setAssignments(Object.fromEntries(devices.map((d) => [d.id, employeeId])));
  const assignOne = (deviceId: string, employeeId: string | null) =>
    setAssignments((prev) => ({ ...prev, [deviceId]: employeeId }));

  const submit = () => {
    if (!isDeploy)
      return onConfirm(
        undefined,
        kind === "disposal" ? disposalMethod : undefined,
      );
    const recipients: Record<string, BulkRecipient> = {};
    for (const d of devices) {
      const emp = employees.find((e) => e.id === assignments[d.id]);
      if (emp)
        recipients[d.id] = { id: emp.id, name: emp.name, country: emp.country };
    }
    onConfirm(recipients, undefined, notWiped > 0 ? wipeSel : undefined);
  };

  return (
    <ModalOverlay
      isOpen={isOpen}
      onOpenChange={(o) => !o && !isLoading && onClose()}
      isDismissable={!isLoading}
      className={ELEVATED_MODAL_OVERLAY_CLASS}
    >
      <Modal
        className={cx(
          isDeploy ? "max-w-3xl" : "max-w-lg",
          ELEVATED_MODAL_CONTENT_CLASS,
        )}
      >
        <Dialog data-testid="bulkactionsmodal-dialog">
          <div className="flex max-h-[85dvh] w-full flex-col overflow-hidden rounded-xl bg-primary shadow-xl">
            <div className="flex items-start gap-4 border-b border-secondary px-6 py-5">
              <FeaturedIcon
                icon={cfg.icon}
                size="md"
                color={cfg.iconColor}
                theme="light"
              />
              <div className="flex-1 pt-0.5">
                <h2 className="text-lg font-semibold text-primary">
                  {cfg.title}
                </h2>
                <p className="mt-1 text-sm text-tertiary">{cfg.blurb}</p>
              </div>
              <ButtonUtility
                size="sm"
                color="tertiary"
                icon={XClose}
                aria-label="Close"
                isDisabled={isLoading}
                onClick={onClose}
              />
            </div>

            <div className="flex flex-col gap-5 overflow-y-auto px-6 py-6">
              {kind === "disposal" && (
                <DisposalMethodChoice
                  value={disposalMethod}
                  onChange={setDisposalMethod}
                />
              )}
              {isDeploy && notWiped > 0 && <BulkWipeBanner count={notWiped} />}
              {isDeploy ? (
                <BulkDeployAssign
                  devices={devices}
                  employees={employees}
                  assignments={assignments}
                  wipeSelections={wipeSel}
                  onAssign={assignOne}
                  onAssignAll={assignAll}
                  onWipeChange={(id, v) =>
                    setWipeSel((prev) => ({ ...prev, [id]: v }))
                  }
                />
              ) : (
                <div className="flex flex-col gap-2">
                  <p className="text-xs font-medium text-tertiary">
                    {devices.length}{" "}
                    {devices.length === 1 ? "device" : "devices"}
                  </p>
                  <ul className="flex max-h-72 flex-col gap-2 overflow-y-auto">
                    {devices.map((d) => (
                      <li
                        key={d.id}
                        className="flex items-center gap-3 rounded-lg border border-secondary bg-primary p-3"
                      >
                        <DeviceAvatar
                          image={d.image}
                          assetType={d.assetType}
                          name={d.deviceName}
                          size="md"
                        />
                        <div className="flex min-w-0 flex-1 flex-col">
                          <span className="truncate text-sm font-medium text-primary">
                            {d.deviceName}
                          </span>
                          <span className="truncate text-xs text-tertiary">
                            {d.serialNumber}
                          </span>
                        </div>
                        <span className="flex shrink-0 items-center gap-1.5">
                          <CountryFlag
                            country={d.country}
                            countryCode={d.countryCode}
                          />
                          <span className="text-xs text-secondary">
                            {d.country}
                          </span>
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {kind === "disposal" && (
                <div className="rounded-lg border border-secondary bg-secondary p-3">
                  <Checkbox
                    isSelected={ack}
                    onChange={setAck}
                    label={
                      disposalMethod === "donate"
                        ? "I understand these devices will be erased and donated, and cannot be recovered."
                        : "I understand these devices will be permanently destroyed, and cannot be recovered."
                    }
                    data-testid="bulkactionsmodal-checkbox"
                  />
                </div>
              )}
            </div>

            <div className="flex flex-col gap-3 border-t border-secondary px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
              {isDeploy && (
                <span className="text-sm text-tertiary">
                  {assignedCount} of {devices.length} assigned
                </span>
              )}
              <div className="flex items-center justify-end gap-2 sm:ml-auto">
                <Button
                  color="secondary"
                  size="md"
                  isDisabled={isLoading}
                  onClick={onClose}
                  data-testid="bulkactionsmodal-button"
                >
                  Cancel
                </Button>
                <Button
                  color={cfg.color}
                  size="md"
                  isDisabled={!canConfirm || isLoading}
                  isLoading={isLoading}
                  onClick={submit}
                  data-testid="bulkactionsmodal-button-2"
                >
                  {cfg.confirm}
                </Button>
              </div>
            </div>
          </div>
        </Dialog>
      </Modal>
    </ModalOverlay>
  );
}
