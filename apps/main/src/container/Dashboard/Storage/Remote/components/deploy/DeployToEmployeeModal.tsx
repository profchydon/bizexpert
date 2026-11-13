"use client";

import { useState } from "react";
import { AlertTriangle, Truck01, XClose } from "@untitledui/icons";
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
import { EmployeePicker } from "../../support/DeviceAssignment/components/EmployeePicker";
import { useEmployeeDirectory } from "../../support/Employees/data/employee-directory";
import type { StoredDevice } from "../../types/storage";
import { DeviceAvatar } from "../DeviceAvatar";
import { DeployModalFooter } from "./DeployModalFooter";
import { DeployRecipientSummary } from "./DeployRecipientSummary";
import { DeployWipePrompt } from "./WipePrompts";
import type { Recipient } from "./types";

interface Props {
  device: StoredDevice | null;
  isOpen: boolean;
  isLoading?: boolean;
  onClose: () => void;
  onConfirm: (
    device: StoredDevice,
    recipient: Recipient,
    wipeRequested?: boolean,
  ) => void;
}

export function DeployToEmployeeModal({
  device,
  isOpen,
  isLoading = false,
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
        <Dialog data-testid="deploytoemployeemodal-dialog">
          {isOpen && device && (
            <DeployFlow
              key={device.id}
              device={device}
              isLoading={isLoading}
              onClose={onClose}
              onConfirm={onConfirm}
            />
          )}
        </Dialog>
      </Modal>
    </ModalOverlay>
  );
}

function DeployFlow({
  device,
  isLoading,
  onClose,
  onConfirm,
}: {
  device: StoredDevice;
  isLoading: boolean;
  onClose: () => void;
  onConfirm: Props["onConfirm"];
}) {
  const employees = useEmployeeDirectory();
  const [employeeId, setEmployeeId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [wipe, setWipe] = useState(true);
  const employee = employeeId
    ? (employees.find((e) => e.id === employeeId) ?? null)
    : null;
  const crossBorder = !!employee && employee.country !== device.country;
  const notWiped = device.wipeStatus === "not_wiped";

  const confirm = () => {
    if (!employee) return;
    if (device.status !== "available" && device.status !== "pending_check") {
      setError(
        "This device was just actioned elsewhere and is no longer available. Pick another unit.",
      );
      return;
    }
    onConfirm(
      device,
      {
        id: employee.id,
        name: employee.name,
        email: employee.email,
        country: employee.country,
        address: employee.address,
        phone: "",
      },
      notWiped ? wipe : undefined,
    );
  };

  return (
    <div className="flex max-h-[85dvh] w-full max-w-lg flex-col overflow-hidden rounded-xl border border-secondary bg-primary shadow-xl">
      <header className="flex items-start gap-4 border-b border-secondary px-6 py-5">
        <FeaturedIcon icon={Truck01} size="md" color="brand" theme="light" />
        <div className="flex-1">
          <h2 className="text-lg font-semibold text-primary">
            Deploy to employee
          </h2>
          <p className="text-sm text-tertiary">
            Ship {device.deviceName} from storage
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
        <div className="flex flex-col gap-5">
          <div className="flex items-center gap-3 rounded-lg border border-secondary p-3">
            <DeviceAvatar
              image={device.image}
              assetType={device.assetType}
              name={device.deviceName}
              size="md"
            />
            <div>
              <p className="text-sm font-semibold text-primary">
                {device.deviceName}
              </p>
              <p className="text-xs text-tertiary">
                {device.serialNumber} · {device.warehouse}, {device.country}
              </p>
            </div>
          </div>

          {notWiped && (
            <DeployWipePrompt
              checked={wipe}
              currency={device.currency}
              onChange={setWipe}
            />
          )}

          <div className="flex flex-col gap-1.5">
            <span className="text-sm font-medium text-secondary">Employee</span>
            <EmployeePicker
              selectedId={employeeId}
              employees={employees}
              deviceCountry={device.country}
              showAddEmployeeAction={false}
              onSelect={(id) => setEmployeeId(id)}
            />
            {crossBorder && (
              <p className="mt-1 flex items-center gap-1 text-xs text-warning-primary">
                <AlertTriangle className="size-3 shrink-0" /> Ships cross-border
                from {device.country} to {employee?.country}.
              </p>
            )}
          </div>

          {employee && <DeployRecipientSummary employee={employee} />}

          {error && <p className="text-sm text-error-primary">{error}</p>}
        </div>
      </div>

      <DeployModalFooter
        canConfirm={Boolean(employee)}
        isLoading={isLoading}
        onClose={onClose}
        onConfirm={confirm}
      />
    </div>
  );
}
