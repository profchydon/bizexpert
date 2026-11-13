"use client";

import { SlideoutMenu } from "@/components/application/slideout-menus/slideout-menu";
import { Button } from "@/components/base/buttons/button";
import type { IEquipment } from "@/types/equipments";
import EquipmentOtherDetailsContent from "./EquipmentOtherDetailsContent";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  equipment: IEquipment;
};

const EquipmentOtherDetails = ({ isOpen, onClose, equipment }: Props) => (
  <SlideoutMenu
    isOpen={isOpen}
    onOpenChange={(open) => !open && onClose()}
    isDismissable
    ariaLabel="Other details"
    data-testid="equipmentotherdetails-drawerright"
  >
    <SlideoutMenu.Header
      onClose={onClose}
      className="pb-5 shadow-[inset_0px_-1px_0px_0px] shadow-border-secondary"
    >
      <div className="flex flex-col gap-1 pr-8">
        <h2 className="text-lg font-semibold text-primary">Other details</h2>
      </div>
    </SlideoutMenu.Header>

    <SlideoutMenu.Content className="w-full">
      <EquipmentOtherDetailsContent equipment={equipment} />
    </SlideoutMenu.Content>

    <SlideoutMenu.Footer>
      <div className="flex justify-end">
        <Button
          size="md"
          color="secondary"
          onPress={onClose}
          data-testid="equipmentotherdetails-button"
        >
          Close
        </Button>
      </div>
    </SlideoutMenu.Footer>
  </SlideoutMenu>
);

export default EquipmentOtherDetails;
