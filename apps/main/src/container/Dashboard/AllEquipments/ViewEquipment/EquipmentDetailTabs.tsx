"use client";

import type { ReactNode } from "react";
import { Tabs } from "@/components/application/tabs/tabs";
import type { EquipmentDetailTabItem } from "./equipmentDetailTabItems";
import { viewEquipmentTabPanelClass } from "./viewEquipmentClasses";

type Props = {
  activeTab: string;
  onTabChange: (tab: string) => void;
  tabs: EquipmentDetailTabItem[];
  children: ReactNode;
};

const EquipmentDetailTabs = ({
  activeTab,
  onTabChange,
  tabs,
  children,
}: Props) => (
  <>
    <Tabs
      selectedKey={activeTab}
      onSelectionChange={(key) => onTabChange(String(key))}
    >
      <Tabs.List type="button-border" items={tabs}>
        {(item) => <Tabs.Item {...item} />}
      </Tabs.List>
    </Tabs>
    <div className={viewEquipmentTabPanelClass}>{children}</div>
  </>
);

export default EquipmentDetailTabs;
