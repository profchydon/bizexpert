import React, { FC } from "react";
import AddEquipmentField from "./AddEquipmentField";
import DrawerRight from "@/components/DrawerRight";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}
const AddEquipmentsLayout: FC<Props> = ({ isOpen, onClose }) => {
  return (
    <DrawerRight
      isOpen={isOpen}
      onClose={onClose}
      onCancel={onClose}
      onSave={() => {}}
      drawerTitle="Add equipment"
      drawerDescription="Download template to add equipment details to the platform"
      width={"872"}
      className="px-0"
      hideDefaultFooterBtn
      data-testid="addequipments-drawerright"
    >
      {isOpen && <AddEquipmentField onClose={onClose} />}
    </DrawerRight>
  );
};

export default AddEquipmentsLayout;
