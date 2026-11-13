import {
  dispose_equipment_icon_primary,
  refresh_device_icon_primary,
} from "@/assets/icons";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import Image from "next/image";
import React, { FC } from "react";

const optionList = [
  {
    name: "Buy equipment",
    description: `Purchase new device`,
  },
  {
    name: "From storage",
    description: `Retrieve from storage`,
  },
];

interface Props {
  isOpen: boolean;
  onClose: () => void;
  selectedStep: string;
  setSelectedStep: (value: string) => void;
  handleContinue: () => void;
}

const StoreEquipmentModal: FC<Props> = (props) => {
  const { isOpen, onClose, selectedStep, setSelectedStep, handleContinue } =
    props;

  const handleClick = (name: string) => {
    setSelectedStep(name as string);
  };

  return (
    <div>
      <Dialog
        open={isOpen}
        onOpenChange={onClose}
        data-testid="storeequipmentmodal-dialog"
      >
        <DialogContent className="overflow-y-auto p-6 max-h-[90vh]">
          <DialogHeader className="text-left">
            <Image
              src={dispose_equipment_icon_primary}
              alt="dispose_equipment_icon_primary"
            />
            <div>
              <div className="text-lg font-semibold text-gray-900">
                Store equipment
              </div>
              <span className="text-gray-600 text-sm font-normal">
                Are you sure you want to store this equipment? To ensure your
                employees have the tools they need, please choose how you’d like
                to replace it: purchase new devices or retrieve existing ones
                from storage.
              </span>
            </div>
          </DialogHeader>

          <div className="space-y-4 mb-6">
            {optionList?.map((item, index) => (
              <div
                key={index}
                className={cn(
                  "border grid grid-cols-[auto,1fr,auto] gap-x-4 rounded-xl p-4 cursor-pointer border-gray-200",
                  item?.name === selectedStep && "border-primary-500",
                )}
                onClick={() => handleClick(item?.name)}
              >
                <Checkbox
                  checked={selectedStep === item?.name}
                  data-testid="storeequipmentmodal-checkbox"
                />
                <div className="flex flex-col gap-y-1">
                  <span className="text-gray-700 font-medium text-base">
                    {item?.name}
                  </span>
                  <span className="text-gray-500 text-sm font-normal">
                    {item?.description}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="flex gap-x-4">
            <Button
              variant="outline"
              className="w-full"
              onClick={onClose}
              data-testid="storeequipmentmodal-button"
            >
              Cancel
            </Button>
            <Button
              className="w-full"
              disabled={!selectedStep}
              onClick={handleContinue}
              data-testid="storeequipmentmodal-button-2"
            >
              Confirm
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default StoreEquipmentModal;
