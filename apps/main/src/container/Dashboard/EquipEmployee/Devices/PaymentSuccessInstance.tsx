"use client";

import { CheckCircle } from "@untitledui/icons";
import {
  Dialog,
  Modal,
  ModalOverlay,
} from "@/components/application/modals/modal";
import { Button } from "@/components/base/buttons/button";
import { FeaturedIcon } from "@/components/foundations/featured-icon/featured-icon";

interface Props {
  onClose: () => void;
  onProceed: () => void;
  isOpen: boolean;
  disabled?: boolean;
}

const PaymentSuccessInstanceModal: React.FC<Props> = ({
  isOpen,
  onClose,
  onProceed,
  disabled,
}) => {
  if (!isOpen) return null;

  return (
    <ModalOverlay
      isOpen
      onOpenChange={(open) => !open && onClose()}
      className="z-[1003]"
    >
      <Modal className="z-[1003] max-w-lg">
        <Dialog data-testid="paymentsuccessinstance-dialog">
          <div className="flex w-full flex-col rounded-2xl bg-primary p-6 shadow-xl">
            <FeaturedIcon
              icon={CheckCircle}
              size="md"
              color="success"
              theme="light"
            />
            <h3 className="mt-4 text-md font-semibold text-primary">
              Payment successful
            </h3>
            <p className="mt-1 text-sm text-tertiary">
              The payment made is successful and order placed
            </p>
            <div className="mt-6">
              <Button
                color="primary"
                size="md"
                className="w-full"
                onClick={onProceed}
                disabled={disabled}
                data-testid="paymentsuccessinstance-button"
              >
                Complete
              </Button>
            </div>
          </div>
        </Dialog>
      </Modal>
    </ModalOverlay>
  );
};

export default PaymentSuccessInstanceModal;
