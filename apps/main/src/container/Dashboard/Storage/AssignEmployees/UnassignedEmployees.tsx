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
import { IEmployees } from "@/types/employees";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { removeUserscore } from "@/utils/underScoreTransformer";

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
  onRemove: () => void;
  items: IEmployees[];
}

const UnassignedEmployees: React.FC<Props> = ({
  isOpen,
  onClose,
  items,
  onRemove,
}) => {
  return (
    <div>
      <Dialog
        open={isOpen}
        onOpenChange={onClose}
        data-testid="unassignedemployees-dialog"
      >
        <DialogContent className="md:min-w-[400px] flex flex-col w-[calc(100%-10px)] space-y-3 overflow-y-auto">
          <div className="text-left">
            <Image src={check_verified_100} alt="cart-icon" />
            <div className="pt-3">
              <div className="text-lg font-semibold text-gray-900">
                No items assigned
              </div>
              <span className="text-gray-600 text-sm">
                The following employees have no assigned items. Would you like
                to remove them from the list?
              </span>
            </div>
          </div>

          <div className="space-y-4 mb-6">
            {items?.map((item) => (
              <div className="flex flex-row items-start gap-x-3">
                <Avatar className="h-10 w-10">
                  <AvatarFallback className="text-gray-600 bg-gray-100">{`${item?.first_name?.[0]} ${item?.last_name?.[0]}`}</AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <p className="text-gray-900 font-medium text-sm">{`${item?.first_name} ${item?.last_name}`}</p>
                  <p className="text-gray-600 text-sm">{item?.email}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="flex gap-x-4">
            <Button
              variant="outline"
              className="w-full mt-4"
              onClick={onClose}
              data-testid="unassignedemployees-button"
            >
              Assign items
            </Button>
            <Button
              className="w-full mt-4"
              onClick={onRemove}
              data-testid="unassignedemployees-button-2"
            >
              Remove
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UnassignedEmployees;
