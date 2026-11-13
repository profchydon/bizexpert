"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { OfficesTab } from "../Offices/components/OfficesTab";
import { SubsidiariesTab } from "./SubsidiariesTab";
import {
  accountsPageTabTriggerClass,
  accountsPageTabsListClass,
} from "./accountsPageTabClasses";

interface Props {
  tab: string;
  onTabChange: (value: string) => void;
  onCreate: () => void;
}

export function AccountsPageTabs({ tab, onTabChange, onCreate }: Props) {
  return (
    <Tabs
      value={tab}
      onValueChange={onTabChange}
      className="flex min-h-0 flex-1 flex-col"
    >
      <TabsList className={accountsPageTabsListClass}>
        <TabsTrigger
          value="subsidiaries"
          className={accountsPageTabTriggerClass}
        >
          Entities
        </TabsTrigger>
        <TabsTrigger value="offices" className={accountsPageTabTriggerClass}>
          Offices
        </TabsTrigger>
      </TabsList>
      <TabsContent value="subsidiaries" className="mt-6">
        <SubsidiariesTab onCreate={onCreate} />
      </TabsContent>
      <TabsContent
        value="offices"
        className="mt-6 flex min-h-0 flex-1 flex-col"
      >
        <OfficesTab />
      </TabsContent>
    </Tabs>
  );
}
