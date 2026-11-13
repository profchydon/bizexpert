import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import Image from "next/image";
import React from "react";
import { sale_icon } from "@/assets/icons";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  handleConfirm: () => void;
  isButtonDisabled?: boolean;
}

const SaleEquipmentModal: React.FC<Props> = ({
  isOpen,
  onClose,
  handleConfirm,
  isButtonDisabled,
}) => {
  return (
    <Dialog
      open={isOpen}
      onOpenChange={onClose}
      data-testid="saleequipmentmodal-dialog"
    >
      <DialogContent className="overflow-y-auto">
        <div className="space-y-3 grid place-content-center mb-2">
          <div>
            <div className="grid place-content-center mb-4">
              <Image
                className="grid place-content-center"
                src={sale_icon}
                alt="sale-icon"
              />
            </div>
            <h3 className="font-semibold text-gray-900 text-lg text-center">
              Sale equipment
            </h3>
          </div>
          <span className="text-gray-600 text-center font-normal text-sm">
            Are you sure you want to sale equipment
          </span>
        </div>
        <div className="flex gap-x-4">
          <Button
            variant="outline"
            className="w-full mt-4"
            onClick={onClose}
            data-testid="saleequipmentmodal-button"
          >
            Cancel
          </Button>
          <Button
            className="w-full mt-4"
            onClick={handleConfirm}
            data-testid="saleequipmentmodal-button-2"
          >
            Confirm
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SaleEquipmentModal;
