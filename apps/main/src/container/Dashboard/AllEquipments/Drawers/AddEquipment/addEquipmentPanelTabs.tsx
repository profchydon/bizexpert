"use client";

import { Tab, TabList, Tabs } from "react-aria-components";
import { cx } from "@/utils/cx";

export type EquipmentAddTab = "import" | "add";

const PANEL_TABS: { id: EquipmentAddTab; label: string }[] = [
  { id: "import", label: "Import equipment" },
  { id: "add", label: "Add equipment" },
];

type Props = {
  activeTab: EquipmentAddTab;
  onTabChange: (tab: EquipmentAddTab) => void;
};

export function AddEquipmentPanelTabs({ activeTab, onTabChange }: Props) {
  return (
    <Tabs
      selectedKey={activeTab}
      onSelectionChange={(key) => onTabChange(key as EquipmentAddTab)}
      className="w-full shrink-0 px-6 pt-1"
    >
      <TabList className="relative flex w-full gap-4 before:absolute before:inset-x-0 before:bottom-0 before:h-px before:bg-border-secondary">
        {PANEL_TABS.map((tab) => (
          <Tab
            key={tab.id}
            id={tab.id}
            className={({ isSelected, isHovered }) =>
              cx(
                "z-10 cursor-pointer px-1 pb-2.5 pt-0 text-sm font-semibold outline-hidden",
                isSelected || isHovered
                  ? "border-b-2 border-fg-brand-primary_alt text-brand-secondary"
                  : "border-b-2 border-transparent text-quaternary",
              )
            }
          >
            {tab.label}
          </Tab>
        ))}
      </TabList>
    </Tabs>
  );
}
