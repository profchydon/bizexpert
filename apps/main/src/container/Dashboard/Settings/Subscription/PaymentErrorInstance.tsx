"use client";

import { AlertCircle, CreditCard02 } from "@untitledui/icons";
import {
  Dialog,
  Modal,
  ModalOverlay,
} from "@/components/application/modals/modal";
import { Button } from "@/components/base/buttons/button";
import { CloseButton } from "@/components/base/buttons/close-button";
import { FeaturedIcon } from "@/components/foundations/featured-icon/featured-icon";

const PaymentErrorInstanceModal = ({
  isOpen,
  onClose,
}: {
  onClose: () => void;
  isOpen: boolean;
}) => {
  if (!isOpen) return null;

  return (
    <ModalOverlay
      isOpen
      onOpenChange={(open) => !open && onClose()}
      className="z-[1003]"
    >
      <Modal className="z-[1003] max-w-lg">
        <Dialog data-testid="paymenterrorinstance-dialog">
          <div className="flex w-full flex-col rounded-2xl bg-primary p-6 shadow-xl">
            <div className="flex items-start justify-between gap-4">
              <FeaturedIcon
                icon={AlertCircle}
                size="md"
                color="error"
                theme="light"
              />
              <CloseButton size="sm" onPress={onClose} />
            </div>
            <h3 className="mt-4 text-md font-semibold text-primary">
              Payment declined
            </h3>
            <p className="mt-1 text-sm text-tertiary">
              Your bank declined the charge. Head back to Stripe to use a
              different card. Your plan has not changed.
            </p>
            <div className="mt-6 grid grid-cols-2 gap-3">
              <Button
                color="secondary"
                size="md"
                className="w-full"
                onClick={onClose}
                data-testid="paymenterrorinstance-button"
              >
                Cancel
              </Button>
              <Button
                color="primary"
                size="md"
                className="w-full"
                iconLeading={CreditCard02}
                onClick={onClose}
                data-testid="paymenterrorinstance-button-2"
              >
                Try again
              </Button>
            </div>
          </div>
        </Dialog>
      </Modal>
    </ModalOverlay>
  );
};

export default PaymentErrorInstanceModal;
