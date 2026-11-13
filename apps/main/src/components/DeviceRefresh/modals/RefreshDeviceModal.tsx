import { refresh_device_icon_primary } from "@/assets/icons";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import Image from "next/image";
import React, { FC } from "react";

const optionList = [
  {
    name: "Dispose equipment",
    description: `Dispose securely with data wiping. Schedule a pickup, and we’ll handle the rest.`,
  },
  {
    name: "Store equipment",
    description: `Store for future use. Add notes, and access it later for reassignment.`,
  },
];

interface Props {
  isOpen: boolean;
  onClose: () => void;
  selectedStep: string;
  setSelectedStep: (value: string) => void;
  handleContinue: () => void;
}

const RefreshDeviceModal: FC<Props> = (props) => {
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
        data-testid="refreshdevicemodal-dialog"
      >
        <DialogContent className="overflow-y-auto p-6 max-h-[90vh]">
          <DialogHeader className="text-left">
            <Image
              src={refresh_device_icon_primary}
              alt="refresh_device_icon_primary"
            />
            <div>
              <div className="text-lg font-semibold text-gray-900">
                Refresh device
              </div>
              <span className="text-gray-600 text-sm font-normal">
                What do you want to do with the device
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
                  data-testid="refreshdevicemodal-checkbox"
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
              data-testid="refreshdevicemodal-button"
            >
              Cancel
            </Button>
            <Button
              className="w-full"
              disabled={!selectedStep}
              onClick={handleContinue}
              data-testid="refreshdevicemodal-button-2"
            >
              Confirm
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default RefreshDeviceModal;
