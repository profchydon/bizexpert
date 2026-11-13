"use client";

import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
import { cart_icon_primary } from "@/assets/icons";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  laptop_icon_grey,
  building_icon_100,
  user_icon_100,
  check_verified_100,
  check_icon_green,
} from "@/assets/icons";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { Clock4 } from "lucide-react";
import routes from "@/routes";
import { useRouter } from "next/navigation";

const details = [
  {
    icon: laptop_icon_grey,
    name: "Onboard or off-board employees",
    description: "Use our onboarding & off boarding feature",
    isCompleted: false,
    route: routes.EQUIP_EMPLOYEE,
  },

  {
    icon: user_icon_100,
    name: "Onboard employee",
    description: "Start employees",
    isCompleted: false,
  },
  {
    icon: building_icon_100,
    name: "Add Departments/Levels",
    description: "Add your Departments/Levels",
    isCompleted: false,
  },
];

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const ChecklistModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const router = useRouter();
  const [selectedStep, setSelectedStep] = useState("");

  return (
    <div>
      <Dialog
        open={isOpen}
        onOpenChange={onClose}
        data-testid="checklistmodal-dialog"
      >
        <DialogContent className="md:min-w-[400px] w-[calc(100%-10px)] overflow-y-auto">
          <DialogHeader className="text-left">
            <Image src={check_verified_100} alt="cart-icon" />
            <div>
              <div className="text-lg font-semibold text-gray-900">
                Onboarding checklist
              </div>
              <span className="text-gray-600 text-sm">
                Complete tasks for best results
              </span>

              <div className="px-2 py-[4px] rounded-2xl w-fit bg-error-50 flex items-center mt-5">
                <Clock4 className="text-error-700 text-xs h-[13px] font-black" />{" "}
                <span className="text-error-600 text-xs">Needs attention</span>
              </div>
            </div>
          </DialogHeader>

          <div className="space-y-4 mb-6">
            {details.map((detail) => (
              <div
                key={detail.name}
                className={cn(
                  "border cursor-pointer border-gray-200 grid grid-cols-[auto,1fr,auto] gap-x-4 rounded-xl p-4",
                  detail.name === selectedStep &&
                    !detail.isCompleted &&
                    "border-primary-600",
                  detail.isCompleted && "items-center",
                )}
                onClick={() => {
                  if (!detail.isCompleted && detail.route) {
                    setSelectedStep(detail.name);
                    router.push(detail.route);
                  }
                }}
              >
                <Image src={detail.icon} alt="" />
                <div className="flex flex-col gap-y-1">
                  <span className="text-gray-700 font-medium text-xs">
                    {detail.name}
                  </span>
                  <span className="text-gray-600 text-xs">
                    {detail.description}
                  </span>
                </div>
                {!detail.isCompleted && (
                  <Button
                    variant="outline"
                    className="bg-primary-50 text-primary-700 text-sm w-[12ch] border-primary-50"
                    data-testid="checklistmodal-button"
                  >
                    Add
                  </Button>
                )}
                {detail.isCompleted && (
                  <Image src={check_icon_green} alt="completed-icon" />
                )}
              </div>
            ))}
          </div>
          <div className="flex gap-x-4 border-t-2 ">
            <Button
              variant="outline"
              className="w-full mt-4"
              onClick={onClose}
              data-testid="checklistmodal-button-2"
            >
              Cancel
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ChecklistModal;
