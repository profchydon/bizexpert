"use client";

import { Lock01 } from "@untitledui/icons";
import {
  Dialog,
  Modal,
  ModalOverlay,
} from "@/components/application/modals/modal";
import { Button } from "@/components/base/buttons/button";
import { CloseButton } from "@/components/base/buttons/close-button";
import { FeaturedIcon } from "@/components/foundations/featured-icon/featured-icon";

// Centre-aligned stacked modal (CLAUDE.md rule 13), following RevokeAdminModal, which is the one
// complete revoke pattern in the app.
//
// The second paragraph is the part that has to be here rather than only on the screen afterwards:
// an admin choosing this needs to know before they confirm that it does not take the agent off the
// machine. Rayda stops listening; the person holding the device is the only one who can uninstall.
export function RevokeTelemetryModal({
  isOpen,
  onOpenChange,
  deviceName,
  holder,
  onConfirm,
}: {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  deviceName: string;
  holder: string;
  onConfirm: () => void;
}) {
  const first = holder.split(" ")[0] || "the assignee";

  return (
    <ModalOverlay isOpen={isOpen} onOpenChange={onOpenChange}>
      <Modal className="max-w-100">
        <Dialog data-testid="revoketelemetrymodal-dialog">
          <div className="relative flex w-full flex-col items-center rounded-2xl bg-primary p-6 text-center shadow-xl">
            <CloseButton
              size="sm"
              onPress={() => onOpenChange(false)}
              className="absolute top-4 right-4"
            />
            <FeaturedIcon
              icon={Lock01}
              size="md"
              color="warning"
              theme="light"
              className="rounded-full"
            />
            <h3 className="mt-4 text-md font-semibold text-primary">
              Stop collecting from {deviceName}?
            </h3>
            <p className="mt-1 text-sm text-tertiary">
              Rayda stops accepting check-ins from this device. Its readings and
              compliance history stay on this page as a record.
            </p>
            <p className="mt-2 text-sm text-tertiary">
              This does not uninstall anything. The agent may still be running
              until {first} removes it, and you can restore collecting at any
              time.
            </p>
            <div className="mt-6 grid w-full grid-cols-2 gap-3">
              <Button
                color="secondary"
                size="md"
                className="w-full"
                onClick={() => onOpenChange(false)}
                data-testid="revoketelemetrymodal-button"
              >
                Cancel
              </Button>
              <Button
                color="primary-destructive"
                size="md"
                className="w-full"
                onClick={onConfirm}
                data-testid="revoketelemetrymodal-button-2"
              >
                Stop collecting
              </Button>
            </div>
          </div>
        </Dialog>
      </Modal>
    </ModalOverlay>
  );
}
