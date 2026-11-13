"use client";

import { EyeOff } from "@untitledui/icons";
import {
  Dialog,
  Modal,
  ModalOverlay,
} from "@/components/application/modals/modal";
import { Button } from "@/components/base/buttons/button";
import { CloseButton } from "@/components/base/buttons/close-button";
import { FeaturedIcon } from "@/components/foundations/featured-icon/featured-icon";
import type { DiscoveredDevice } from "./types";

// Center-aligned stacked confirm for taking a device out of the review queue.
export function DismissDeviceModal({
  device,
  onClose,
  onDismiss,
}: {
  device: DiscoveredDevice | null;
  onClose: () => void;
  onDismiss: (device: DiscoveredDevice) => void;
}) {
  return (
    <ModalOverlay
      isOpen={device !== null}
      onOpenChange={(open) => !open && onClose()}
      isDismissable
    >
      <Modal className="max-w-md">
        <Dialog data-testid="dismissdevicemodal-dialog">
          {device && (
            <div className="relative flex w-full flex-col items-center rounded-2xl bg-primary p-6 text-center shadow-xl">
              <CloseButton
                size="sm"
                onPress={onClose}
                className="absolute top-4 right-4"
              />
              <FeaturedIcon
                icon={EyeOff}
                size="md"
                color="gray"
                theme="light"
                className="rounded-full"
              />
              <h3 className="mt-4 text-md font-semibold text-primary">
                Dismiss {device.hostname}?
              </h3>
              <p className="mt-1 text-sm text-tertiary">
                It stays out of your Device Fleet and will not be suggested
                again unless the agent sees it on a new account.
              </p>
              <div className="mt-6 grid w-full grid-cols-2 gap-3">
                <Button
                  color="secondary"
                  size="md"
                  className="w-full"
                  onClick={onClose}
                  data-testid="dismissdevicemodal-button"
                >
                  Cancel
                </Button>
                <Button
                  color="primary-destructive"
                  size="md"
                  className="w-full"
                  onClick={() => onDismiss(device)}
                  data-testid="dismissdevicemodal-button-2"
                >
                  Dismiss device
                </Button>
              </div>
            </div>
          )}
        </Dialog>
      </Modal>
    </ModalOverlay>
  );
}
