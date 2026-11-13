import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import Image from "next/image";
import React from "react";
import { check_circle } from "@/assets/icons";
import routes from "@/routes";
import { IEmployees } from "@/types/employees";
import { useRouter } from "next/navigation";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onContinue: () => void;
}

const ActionConfirmation: React.FC<Props> = ({
  isOpen,
  onClose,
  onContinue,
}) => {
  return (
    <Dialog
      open={isOpen}
      onOpenChange={onClose}
      data-testid="actionconfirmation-dialog"
    >
      <DialogContent className="md:min-w-[400px] w-[calc(100%-10px)] overflow-y-auto">
        <div className="grid place-content-center">
          <Image src={check_circle} alt="icon" />
        </div>
        <div className="flex flex-col gap-y-2">
          <div className="text-lg font-semibold text-gray-900 text-center">
            Action Confirmation
          </div>
          <span className="block text-center text-sm">
            By not selecting those items, they will be kept by an employee and
            archived on the platform. Once archived, this action cannot be
            reversed.
          </span>
        </div>
        <div className="flex gap-x-4 mt-4">
          <Button
            variant="outline"
            className="w-full"
            onClick={onClose}
            data-testid="actionconfirmation-button"
          >
            Back
          </Button>

          <Button
            variant="primary"
            className="w-full"
            onClick={onContinue}
            data-testid="actionconfirmation-button-2"
          >
            Continue
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ActionConfirmation;
