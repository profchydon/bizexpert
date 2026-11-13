import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import Image from "next/image";
import React from "react";
import { store_icon } from "@/assets/icons";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  handleConfirm: () => void;
  isButtonDisabled?: boolean;
}

const StoreEquipmentModal: React.FC<Props> = ({
  isOpen,
  onClose,
  handleConfirm,
  isButtonDisabled,
}) => {
  return (
    <Dialog
      open={isOpen}
      onOpenChange={onClose}
      data-testid="storeequipmentmodal-dialog"
    >
      <DialogContent className="overflow-y-auto">
        <div className="space-y-3 grid place-content-center mb-2">
          <div>
            <div className="grid place-content-center mb-4">
              <Image
                className="grid place-content-center"
                src={store_icon}
                alt="store-icon"
              />
            </div>
            <h3 className="font-semibold text-gray-900 text-lg text-center">
              Store equipment
            </h3>
          </div>
          <span className="text-gray-600 text-center font-normal text-sm">
            Are you sure you want to store equipment
          </span>
        </div>
        <div className="flex gap-x-4">
          <Button
            variant="outline"
            className="w-full mt-4"
            onClick={onClose}
            data-testid="storeequipmentmodal-button"
          >
            Cancel
          </Button>
          <Button
            className="w-full mt-4"
            onClick={handleConfirm}
            data-testid="storeequipmentmodal-button-2"
          >
            Confirm
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default StoreEquipmentModal;
