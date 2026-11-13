"use client";

import { useState } from "react";
import { Briefcase01, CheckVerified01, User01 } from "@untitledui/icons";
import {
  Dialog,
  Modal,
  ModalOverlay,
} from "@/components/application/modals/modal";
import { Button } from "@/components/base/buttons/button";
import { CloseButton } from "@/components/base/buttons/close-button";
import { FeaturedIcon } from "@/components/foundations/featured-icon/featured-icon";
import { cx } from "@/utils/cx";
import type { Ownership } from "@/container/Dashboard/AllEquipments/ViewEquipment/telemetry/types";
import type { DiscoveredDevice } from "./types";

const CHOICES: {
  value: Ownership;
  icon: typeof Briefcase01;
  title: string;
  body: string;
}[] = [
  {
    value: "company",
    icon: Briefcase01,
    title: "Company owned",
    body: "Purchased by the company. Full telemetry and lifecycle actions.",
  },
  {
    value: "employee",
    icon: User01,
    title: "Employee owned",
    body: "Personal device. Basic signals only, privacy protected.",
  },
];

// Left-aligned stacked modal: the classification choice is the body content.
export function ClassifyDeviceModal({
  device,
  onClose,
  onApprove,
}: {
  device: DiscoveredDevice | null;
  onClose: () => void;
  onApprove: (device: DiscoveredDevice, ownership: Ownership) => void;
}) {
  const [ownership, setOwnership] = useState<Ownership>("company");
  return (
    <ModalOverlay
      isOpen={device !== null}
      onOpenChange={(open) => !open && onClose()}
      isDismissable
    >
      <Modal className="max-w-md">
        <Dialog data-testid="classifydevicemodal-dialog">
          {device && (
            <div className="flex w-full flex-col rounded-2xl bg-primary p-6 shadow-xl">
              <div className="flex items-start justify-between gap-4">
                <FeaturedIcon
                  icon={CheckVerified01}
                  size="md"
                  color="brand"
                  theme="light"
                />
                <CloseButton size="sm" onPress={onClose} />
              </div>
              <h3 className="mt-4 text-md font-semibold text-primary">
                Add {device.hostname} to your Device Fleet
              </h3>
              <p className="mt-1 text-sm text-tertiary">
                {device.model}, serial {device.serial}, running {device.os}. The
                agent sees it signed in as {device.employeeAccount}. Choose who
                owns it to set how much Rayda can see.
              </p>
              <div className="mt-5 flex flex-col gap-3">
                {CHOICES.map(({ value, icon: Icon, title, body }) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setOwnership(value)}
                    className={cx(
                      "flex items-start gap-3 rounded-xl border p-3.5 text-left outline-focus-ring focus-visible:outline-2",
                      ownership === value
                        ? "border-brand bg-brand-primary_alt ring-1 ring-border-brand"
                        : "border-secondary hover:bg-secondary",
                    )}
                  >
                    <Icon
                      className={cx(
                        "mt-0.5 size-5 shrink-0",
                        ownership === value
                          ? "text-fg-brand-primary"
                          : "text-fg-quaternary",
                      )}
                    />
                    <span className="flex flex-col gap-0.5">
                      <span className="text-sm font-semibold text-primary">
                        {title}
                      </span>
                      <span className="text-sm text-tertiary">{body}</span>
                    </span>
                  </button>
                ))}
              </div>
              <div className="mt-6 grid grid-cols-2 gap-3">
                <Button
                  color="secondary"
                  size="md"
                  className="w-full"
                  onClick={onClose}
                  data-testid="classifydevicemodal-button"
                >
                  Cancel
                </Button>
                <Button
                  color="primary"
                  size="md"
                  className="w-full"
                  onClick={() => onApprove(device, ownership)}
                  data-testid="classifydevicemodal-button-2"
                >
                  Add to fleet
                </Button>
              </div>
            </div>
          )}
        </Dialog>
      </Modal>
    </ModalOverlay>
  );
}
