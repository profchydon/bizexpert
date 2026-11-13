"use client";

import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { DialogDescription } from "@radix-ui/react-dialog";
import { payment_error_icon } from "@/assets/icons";

interface Props {
  onClose: () => void;
  isOpen: boolean;
  disabled?: boolean;
}

const PaymentErrorInstanceModal: React.FC<Props> = ({
  isOpen,
  onClose,
  disabled,
}) => {
  return (
    <div>
      <Dialog
        open={isOpen}
        onOpenChange={onClose}
        data-testid="paymenterrorinstance-dialog"
      >
        <DialogContent className="w-[80%] md:max-w-[400px] overflow-y-auto rounded-xl">
          <DialogHeader className="items-center pt-6">
            <Image src={payment_error_icon} alt="payment_error_icon" />
          </DialogHeader>
          <DialogDescription className="flex flex-col gap-y-2">
            <p className="text-center text-lg font-semibold text-gray-900">
              Payment Error
            </p>
            <p className="text-center text-sm font-normal text-gray-600">
              We're sorry, but there was an issue processing your payment.
            </p>
          </DialogDescription>

          <div className="flex mt-8">
            <Button
              variant="outline"
              className="w-full"
              onClick={onClose}
              data-testid="paymenterrorinstance-button"
            >
              Cancel
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PaymentErrorInstanceModal;
