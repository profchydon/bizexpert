"use client";

import { useState } from "react";
import AllEquipmentsTable from "@/components/AllEquipments/AllEquipmentsTable";
import { DisabledWithTooltip } from "@/components/base/tooltip/disabled-with-tooltip";
import { getAssetVaultTabDisabledReason } from "@/components/AllEquipments/equipmentDisabledReasons";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FloatingAlert } from "@/components/application/alerts/floating-alert";
import { useEntitlementOn } from "@/container/Dashboard/Settings/Subscription/useCompanyEntitlements";
import routes from "@/routes";
import React, { FC } from "react";
import DeviceRefreshContent from "./DeviceRefresh/DeviceRefreshContent";
import { ICompany } from "@/types/auth";
import { AssetVaultTab, DISCOVERED_TAB_ENABLED } from "./assetVaultTab";
import { DiscoveredBanner } from "./discovered/DiscoveredBanner";
import { DiscoveredTable } from "./discovered/DiscoveredTable";
import { usePendingDiscoveredCount } from "./discovered/store";

interface Props {
  activeTab: AssetVaultTab;
  onTabChange: (tab: AssetVaultTab) => void;
  isTabNavigatePending?: boolean;
  isActionDrawerOpen: boolean;
  setIsActionDrawerOpen: (value: boolean) => void;
  isExportDrawerOpen: boolean;
  setIsExportDrawerOpen: (value: boolean) => void;
  company: ICompany;
}

const tabTrigger = (
  value: AssetVaultTab,
  label: string,
  isTabNavigatePending: boolean,
  badge?: number,
) => (
  <DisabledWithTooltip
    isDisabled={isTabNavigatePending}
    reason={getAssetVaultTabDisabledReason(isTabNavigatePending)}
    triggerClassName="inline-flex"
  >
    <TabsTrigger value={value} disabled={isTabNavigatePending}>
      {label}
      {badge ? (
        <span className="ml-2 rounded-full bg-brand-50 px-1.5 text-xs font-semibold text-brand-700">
          {badge}
        </span>
      ) : null}
    </TabsTrigger>
  </DisabledWithTooltip>
);

const AssetVaultTabs: FC<Props> = ({
  activeTab,
  onTabChange,
  isTabNavigatePending = false,
  isActionDrawerOpen,
  setIsActionDrawerOpen,
  isExportDrawerOpen,
  setIsExportDrawerOpen,
  company,
}) => {
  const pendingCount = usePendingDiscoveredCount();
  const [alert, setAlert] = useState<string | null>(null);
  const telemetry = useEntitlementOn("telemetry_agent");
  const showDiscovered =
    DISCOVERED_TAB_ENABLED && telemetry.ready && telemetry.on;

  return (
    <>
      <Tabs
        value={activeTab}
        onValueChange={(value) => onTabChange(value as AssetVaultTab)}
        className="w-full"
      >
        <TabsList className="flex justify-normal">
          {tabTrigger("equipment", "Equipment", isTabNavigatePending)}
          {showDiscovered
            ? tabTrigger(
                "discovered",
                "Discovered",
                isTabNavigatePending,
                pendingCount,
              )
            : null}
          {tabTrigger("archived", "Archive", isTabNavigatePending)}
          {tabTrigger("refresh", "Device refresh", isTabNavigatePending)}
        </TabsList>
        <TabsContent value="equipment">
          {showDiscovered && pendingCount > 0 ? (
            <DiscoveredBanner
              count={pendingCount}
              onReview={() => onTabChange("discovered")}
            />
          ) : null}
          <AllEquipmentsTable
            baseRoute={routes.All_Equipments}
            isActionDrawerOpen={isActionDrawerOpen}
            setIsActionDrawerOpen={setIsActionDrawerOpen}
            isExportDrawerOpen={isExportDrawerOpen}
            setIsExportDrawerOpen={setIsExportDrawerOpen}
          />
        </TabsContent>
        {showDiscovered ? (
          <TabsContent value="discovered">
            <DiscoveredTable onToast={setAlert} />
          </TabsContent>
        ) : null}
        <TabsContent value="archived">
          <AllEquipmentsTable
            baseRoute={routes.All_Equipments}
            isActionDrawerOpen={isActionDrawerOpen}
            setIsActionDrawerOpen={setIsActionDrawerOpen}
            isExportDrawerOpen={isExportDrawerOpen}
            setIsExportDrawerOpen={setIsExportDrawerOpen}
            archived={true}
          />
        </TabsContent>
        <TabsContent value="refresh">
          <DeviceRefreshContent company={company} />
        </TabsContent>
      </Tabs>
      <FloatingAlert
        show={Boolean(alert)}
        color="success"
        title={alert ?? ""}
        onDismiss={() => setAlert(null)}
      />
    </>
  );
};

export default AssetVaultTabs;
