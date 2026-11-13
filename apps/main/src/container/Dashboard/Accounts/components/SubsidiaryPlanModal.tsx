"use client";

import { Building02 } from "@untitledui/icons";
import {
  Dialog,
  Modal,
  ModalOverlay,
} from "@/components/application/modals/modal";
import { Button } from "@/components/base/buttons/button";
import { CloseButton } from "@/components/base/buttons/close-button";
import { FeaturedIcon } from "@/components/foundations/featured-icon/featured-icon";
import { useTransitionRouter } from "@/hooks/useTransitionRouter";
import routes from "@/routes";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export function SubsidiaryPlanModal({ isOpen, onClose }: Props) {
  const { push, isPending } = useTransitionRouter();

  if (!isOpen) return null;

  return (
    <ModalOverlay
      isOpen
      onOpenChange={(open) => {
        if (!open && !isPending) onClose();
      }}
      className="z-[1003]"
    >
      <Modal className="z-[1003] max-w-lg">
        <Dialog data-testid="subsidiaryplanmodal-dialog">
          <div className="flex w-full flex-col rounded-2xl bg-primary p-6 shadow-xl">
            <div className="flex items-start justify-between gap-4">
              <FeaturedIcon
                icon={Building02}
                size="md"
                color="brand"
                theme="light"
              />
              <CloseButton size="sm" onPress={onClose} isDisabled={isPending} />
            </div>
            <h3 className="mt-4 text-md font-semibold text-primary">
              Scale plan required
            </h3>
            <p className="mt-1 text-sm text-tertiary">
              Creating additional entities, each billed independently with its
              own currency, card, and credit, is available on the Scale plan.
            </p>
            <div className="mt-6 grid grid-cols-2 gap-3">
              <Button
                color="secondary"
                size="md"
                className="w-full"
                disabled={isPending}
                onClick={onClose}
                data-testid="subsidiaryplanmodal-button"
              >
                Close
              </Button>
              <Button
                color="primary"
                size="md"
                className="w-full"
                isLoading={isPending}
                onClick={() => push(routes.SETTINGS_SUBSCRIPTION)}
                data-testid="subsidiaryplanmodal-button-2"
              >
                Upgrade to Scale
              </Button>
            </div>
          </div>
        </Dialog>
      </Modal>
    </ModalOverlay>
  );
}
