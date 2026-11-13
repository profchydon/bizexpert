"use client";

import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
import { cart_icon_primary } from "@/assets/icons";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  storage_icon_primary_100,
  truck_icon_primary_100,
  service_icon,
  equip_icon,
} from "@/assets/icons";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import routes from "@/routes";
import { trackFirstCountrySelected } from "@/lib/activationAnalytics";
import { useRouter } from "next/navigation";
import StoreItemModal from "./ImportEquipmentStorage/StoreItemModal";

const details = [
  {
    icon: equip_icon,
    name: "Equip your employee",
    description: "Recover equipment from employees, And store them.",
    route: routes.EQUIP_EMPLOYEE,
    enabled: true,
  },
  {
    icon: truck_icon_primary_100,
    name: "Off-board of device",
    description: "Recover equipment from employees, And store them.",
    enabled: true,
  },
  {
    icon: storage_icon_primary_100,
    name: "Storage",
    description: "Unlimited users and unlimited individual data.",
    enabled: true,
    modal: false,
  },
  {
    icon: service_icon,
    name: "Service Contract",
    description: "Unlimited users and unlimited individual data.",
    enabled: true,
  },
];

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const CountryFirstModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const router = useRouter();
  const [selectedStep, setSelectedStep] = useState("");
  const [selectedRoute, setSelectedRoute] = useState("");
  const [isShowStoreModal, setIsShowStoreModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<(typeof details)[0] | null>(
    null,
  );

  const handleClick = (detail: (typeof details)[0]) => {
    if (detail.enabled) {
      setSelectedStep(detail.name);
      setSelectedItem(detail);
      if (detail.route) {
        setSelectedRoute(detail.route);
      }
    }
  };

  const handleConfirm = () => {
    trackFirstCountrySelected();

    if (selectedItem?.name === "Storage") {
      setIsShowStoreModal(true);
      onClose();
    } else if (selectedRoute) {
      router.push(selectedRoute);
      onClose();
    }
  };

  return (
    <>
      <Dialog
        open={isOpen}
        onOpenChange={onClose}
        data-testid="countryfirstmodal-dialog"
      >
        <DialogContent className="overflow-y-auto p-6 max-h-[90vh]">
          <DialogHeader className="text-left">
            <div>
              <div className="text-lg font-semibold text-gray-900">
                What do you want to do today?
              </div>
              <span className="text-gray-600 text-sm">
                Select an option to manage equipment and employee resources.
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
                  data-testid="countryfirstmodal-checkbox"
                />
              </div>
            ))}
          </div>

          <div className="flex gap-x-4">
            <Button
              variant="outline"
              className="w-full"
              onClick={onClose}
              data-testid="countryfirstmodal-button"
            >
              Cancel
            </Button>

            <Button
              className="w-full"
              disabled={!selectedStep}
              onClick={handleConfirm}
              data-testid="countryfirstmodal-button-2"
            >
              Confirm
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      <StoreItemModal
        isOpen={isShowStoreModal}
        onClose={() => setIsShowStoreModal(false)}
      />
    </>
  );
};

export default CountryFirstModal;
