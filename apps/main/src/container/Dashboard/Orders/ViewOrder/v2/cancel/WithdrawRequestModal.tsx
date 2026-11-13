"use client";

import { ClockRewind } from "@untitledui/icons";
import {
  Dialog,
  Modal,
  ModalOverlay,
} from "@/components/application/modals/modal";
import { ELEVATED_MODAL_OVERLAY_CLASS } from "@/utils/drawerOverlayStacking";
import { Button } from "@/components/base/buttons/button";
import { CloseButton } from "@/components/base/buttons/close-button";
import { FeaturedIcon } from "@/components/foundations/featured-icon/featured-icon";

interface Props {
  isOpen: boolean;
  subject: string;
  onClose: () => void;
  onConfirm: () => void;
  isLoading?: boolean;
}

export function WithdrawRequestModal({
  isOpen,
  subject,
  onClose,
  onConfirm,
  isLoading,
}: Props) {
  return (
    <ModalOverlay
      isOpen={isOpen}
      onOpenChange={(open) => !open && onClose()}
      isDismissable
      className={ELEVATED_MODAL_OVERLAY_CLASS}
    >
      <Modal className="max-w-md">
        <Dialog data-testid="withdrawrequestmodal-dialog">
          <div className="relative flex w-full flex-col items-center rounded-2xl bg-primary p-6 text-center shadow-xl">
            <CloseButton
              size="sm"
              onPress={onClose}
              className="absolute top-4 right-4"
            />
            <FeaturedIcon
              icon={ClockRewind}
              size="md"
              color="warning"
              theme="light"
              className="rounded-full"
            />
            <h3 className="mt-4 text-md font-semibold text-primary">
              Withdraw this cancellation request?
            </h3>
            <p className="mt-1 text-sm text-tertiary">
              Rayda stops reviewing it and {subject} carries on as planned.
              Nothing has been refunded either way, and you can ask to cancel
              again while the order is still open.
            </p>
            <div className="mt-6 grid w-full grid-cols-2 gap-3">
              <Button
                color="secondary"
                size="md"
                className="w-full"
                onClick={onClose}
                data-testid="withdrawrequestmodal-button"
              >
                Keep request
              </Button>
              <Button
                color="primary"
                size="md"
                className="w-full"
                onClick={onConfirm}
                isDisabled={isLoading}
                data-testid="withdrawrequestmodal-button-2"
              >
                Withdraw request
              </Button>
            </div>
          </div>
        </Dialog>
      </Modal>
    </ModalOverlay>
  );
}
