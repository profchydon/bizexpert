"use client";

import type { ReactNode } from "react";
import { SlideoutMenu } from "@/components/application/slideout-menus/slideout-menu";
import { CloseButton } from "@/components/base/buttons/close-button";
import {
  AddEquipmentPanelTabs,
  type EquipmentAddTab,
} from "./addEquipmentPanelTabs";
import { ADD_EQUIPMENT_SLIDEOUT_RESIZE } from "./addEquipmentSlideoutResize";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  activeTab: EquipmentAddTab;
  onTabChange: (tab: EquipmentAddTab) => void;
  children: ReactNode;
};

export function AddEquipmentSlideoutShell({
  isOpen,
  onClose,
  activeTab,
  onTabChange,
  children,
}: Props) {
  return (
    <SlideoutMenu
      isOpen={isOpen}
      onOpenChange={(open) => !open && onClose()}
      isDismissable
      ariaLabel="Add equipment"
      dialogClassName="overflow-hidden"
      resizeOptions={ADD_EQUIPMENT_SLIDEOUT_RESIZE}
      data-testid="addequipment-drawerright"
    >
      <div className="flex w-full shrink-0 items-start justify-between px-6 py-5">
        <div>
          <h2 className="text-lg font-bold text-primary">Add equipment</h2>
          <p className="mt-0.5 text-sm text-tertiary">
            Add a device or import many at once.
          </p>
        </div>
        <CloseButton size="sm" onPress={onClose} />
      </div>

      <AddEquipmentPanelTabs activeTab={activeTab} onTabChange={onTabChange} />

      <div className="flex min-h-0 min-w-0 w-full flex-1 flex-col overflow-hidden bg-secondary">
        {children}
      </div>
    </SlideoutMenu>
  );
}
