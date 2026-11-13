"use client";

import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import routes from "@/routes";
import { useRouter } from "next/navigation";
import { ready_to_store, move_modal, import_icon } from "@/assets/icons";

const details = [
  {
    icon: import_icon,
    name: "Import new items",
    description: "Import items from a spreadsheet or other source",
    route: routes.STORAGE,
    enabled: true,
  },
  {
    icon: move_modal,
    name: "Move from existing inventory",
    description: "Transfer Items already in your system to storage",
    enabled: false,
  },
];

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const StoreItemModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const router = useRouter();
  const [selectedStep, setSelectedStep] = useState("");
  const [selectedRoute, setSelectedRoute] = useState("");

  const handleClick = (detail: (typeof details)[0]) => {
    if (detail.enabled) {
      setSelectedStep(detail.name);
      if (detail.route) {
        setSelectedRoute(detail.route);
      }
    }
  };

  return (
    <div>
      <Dialog
        open={isOpen}
        onOpenChange={onClose}
        data-testid="storeitemmodal-dialog"
      >
        <DialogContent className="overflow-y-auto p-6 max-h-[90vh]">
          <DialogHeader className="text-left">
            <Image src={ready_to_store} alt="store" />
            <div>
              <div className="text-lg font-semibold text-gray-900">
                Store Items
              </div>
              <span className="text-gray-600 text-sm">
                How would you like to add items to storage?
              </span>
            </div>
          </DialogHeader>

          <div className="space-y-4 mb-6">
            {details.map((detail) => (
              <div
                key={detail.name}
                className={cn(
                  "border grid grid-cols-[auto,1fr,auto] gap-x-4 rounded-xl p-4",
                  detail.enabled
                    ? "cursor-pointer border-gray-200"
                    : "cursor-not-allowed border-gray-300 opacity-50",
                  detail.name === selectedStep &&
                    detail.enabled &&
                    "border-primary-600",
                )}
                onClick={() => handleClick(detail)}
              >
                <Image src={detail.icon} alt="icon" />
                <div className="flex flex-col gap-y-1">
                  <span className="text-gray-700 font-medium text-base">
                    {detail.name}
                  </span>
                  <span className="text-gray-600 text-sm font-normal">
                    {detail.description}
                  </span>
                </div>
                <Checkbox
                  checked={selectedStep === detail.name}
                  disabled={!detail.enabled}
                  data-testid="storeitemmodal-checkbox"
                />
              </div>
            ))}
          </div>

          <div className="flex gap-x-4">
            <Button
              variant="outline"
              className="w-full"
              onClick={onClose}
              data-testid="storeitemmodal-button"
            >
              Close
            </Button>
            <Button
              className="w-full"
              disabled={!selectedStep}
              onClick={() => {
                if (selectedRoute) {
                  router.push(selectedRoute);
                } else {
                  onClose();
                }
              }}
              data-testid="storeitemmodal-button-2"
            >
              Confirm
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default StoreItemModal;
