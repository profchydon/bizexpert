"use client";

import type { ReactNode } from "react";
import { Tabs } from "@/components/application/tabs/tabs";
import { DisabledWithTooltip } from "@/components/base/tooltip/disabled-with-tooltip";

export type StoragePageTabKey = "inventory" | "orders" | "impact";

export type StoragePageTabItem = {
  id: StoragePageTabKey;
  label: ReactNode;
  comingSoon?: boolean;
};

type Props = {
  items: StoragePageTabItem[];
  selectedKey: StoragePageTabKey;
  onSelectionChange: (key: StoragePageTabKey) => void;
};

export function StoragePageTabList({
  items,
  selectedKey,
  onSelectionChange,
}: Props) {
  return (
    <Tabs
      selectedKey={selectedKey}
      onSelectionChange={(key) => {
        const item = items.find((entry) => entry.id === key);
        if (item?.comingSoon) return;
        onSelectionChange(key as StoragePageTabKey);
      }}
    >
      <Tabs.List type="underline" items={items}>
        {(item) => {
          const tab = items.find((entry) => entry.id === item.id);
          if (!tab) return null;

          return (
            <Tabs.Item id={tab.id} isDisabled={tab.comingSoon}>
              {tab.comingSoon ? (
                <DisabledWithTooltip
                  isDisabled
                  reason="Coming soon"
                  triggerClassName="inline-flex"
                >
                  <span>{tab.label}</span>
                </DisabledWithTooltip>
              ) : (
                tab.label
              )}
            </Tabs.Item>
          );
        }}
      </Tabs.List>
    </Tabs>
  );
}
