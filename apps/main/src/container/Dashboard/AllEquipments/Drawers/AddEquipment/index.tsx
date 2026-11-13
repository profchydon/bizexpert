"use client";

import { useEffect, useState } from "react";
import { AddEquipmentSlideoutShell } from "./addEquipmentSlideoutShell";
import type { EquipmentAddTab } from "./addEquipmentPanelTabs";
import ImportEquipments from "./ImportEquipments";
import SingleEquipmentAddTab from "./SingleEquipmentAddTab";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: EquipmentAddTab;
};

const AddEquipments = ({ isOpen, onClose, initialTab = "import" }: Props) => {
  const [activeTab, setActiveTab] = useState<EquipmentAddTab>(initialTab);

  useEffect(() => {
    if (isOpen) setActiveTab(initialTab);
  }, [initialTab, isOpen]);

  return (
    <AddEquipmentSlideoutShell
      isOpen={isOpen}
      onClose={onClose}
      activeTab={activeTab}
      onTabChange={setActiveTab}
    >
      {activeTab === "import" ? <ImportEquipments onClose={onClose} /> : null}
      {activeTab === "add" ? <SingleEquipmentAddTab onClose={onClose} /> : null}
    </AddEquipmentSlideoutShell>
  );
};

export default AddEquipments;
