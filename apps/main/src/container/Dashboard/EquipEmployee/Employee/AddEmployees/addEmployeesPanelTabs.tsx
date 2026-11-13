"use client";

import { Tab, TabList, Tabs } from "react-aria-components";
import { cx } from "@/utils/cx";

export type EmployeeAddTab = "import" | "add" | "hris" | "invite";

const PANEL_TABS: { id: EmployeeAddTab; label: string }[] = [
  { id: "import", label: "Import employees" },
  { id: "add", label: "Add employee" },
  { id: "hris", label: "HRIS integration" },
];

type Props = {
  activeTab: EmployeeAddTab;
  onTabChange: (tab: EmployeeAddTab) => void;
  disabledTabs?: EmployeeAddTab[];
};

export function AddEmployeesPanelTabs({
  activeTab,
  onTabChange,
  disabledTabs = [],
}: Props) {
  return (
    <Tabs
      selectedKey={activeTab}
      onSelectionChange={(key) => onTabChange(key as EmployeeAddTab)}
      className="w-full shrink-0 px-6 pt-1"
    >
      <TabList className="relative flex w-full gap-4 before:absolute before:inset-x-0 before:bottom-0 before:h-px before:bg-border-secondary">
        {PANEL_TABS.map((tab) => (
          <Tab
            key={tab.id}
            id={tab.id}
            isDisabled={disabledTabs.includes(tab.id)}
            className={({ isSelected, isHovered, isDisabled }) =>
              cx(
                "z-10 cursor-pointer px-1 pt-0 pb-2.5 text-sm font-semibold outline-hidden",
                isDisabled && "cursor-not-allowed opacity-50",
                isSelected || isHovered
                  ? "border-fg-brand-primary_alt text-brand-secondary border-b-2"
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
