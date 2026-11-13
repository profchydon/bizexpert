import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import Image from "next/image";
import React from "react";
import { ready_to_store } from "@/assets/icons";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  isButtonDisabled: boolean;
}

const ReadyToStoreModal: React.FC<Props> = ({
  isOpen,
  onClose,
  isButtonDisabled,
}) => {
  return (
    <Dialog
      open={isOpen}
      onOpenChange={onClose}
      data-testid="readytostoremodal-dialog"
    >
      <DialogContent className="overflow-y-auto">
        <div className="space-y-4 grid place-content-center mb-2">
          <div>
            <div className="grid place-content-center mb-4">
              <Image
                className="grid place-content-center"
                src={ready_to_store}
                alt="store-icon"
              />
            </div>
            <h3 className="font-bold text-gray-900 text-lg text-center">
              Ready for storage
            </h3>
          </div>
          <span className="text-gray-600 text-center">
            This equipment is ready to be added to your storage,
            <p className="text-gray-600 text-center">
              Would you like to proceed?
            </p>
          </span>
        </div>
        <div className="flex gap-x-4 border-t-2 ">
          <Button
            variant="outline"
            className="w-full mt-4"
            onClick={onClose}
            data-testid="readytostoremodal-button"
          >
            Cancel
          </Button>
          <Button
            className="w-full mt-4"
            disabled={isButtonDisabled}
            data-testid="readytostoremodal-button-2"
          >
            Confirm
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ReadyToStoreModal;
