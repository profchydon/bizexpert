import { removeItemsNotCompleted } from "@/components/Offboarding/util";
import PageHeader from "@/components/PageHeader";
import { Button } from "@/components/base/buttons/button";
import { DisabledWithTooltip } from "@/components/base/tooltip/disabled-with-tooltip";
import { getSeeActionsDisabledReason } from "@/components/AllEquipments/equipmentDisabledReasons";
import { useEntitlementOn } from "@/container/Dashboard/Settings/Subscription/useCompanyEntitlements";
import { useActiveWorkspace } from "@/hooks/useActiveWorkspace";
import { useTransitionRouter } from "@/hooks/useTransitionRouter";
import routes from "@/routes";
import { appendEntityWorkspaceParam } from "@/utils/workspace/activeWorkspace";
import { useAppDispatch, useAppSelector } from "@/store";
import { resetOffboardingData } from "@/store/slices/offboardingSlice";
import { ICompany } from "@/types/auth";
import { Offboard_asset } from "@/types/offboarding";
import { Download01, Plus } from "@untitledui/icons";
import { useSearchParams } from "next/navigation";
import React, { FC, useEffect, useMemo, useState } from "react";
import AddEquipments from "./Drawers/AddEquipment";
import { AssetDetailUpgradeDialog } from "./AssetDetailUpgradeDialog";
import AssetVaultTabs from "./AssetVaultTabs";
import {
  assetVaultTabHref,
  AssetVaultTab,
  DISCOVERED_TAB_ENABLED,
  FLEET_INSIGHTS_BUTTON_ENABLED,
  resolveAssetVaultTab,
} from "./assetVaultTab";

interface Props {
  company: ICompany;
}

const AllEquipment: FC<Props> = ({ company }) => {
  const {
    push,
    replace,
    back,
    isPending: isTabNavigatePending,
  } = useTransitionRouter();
  const { activeEntityId } = useActiveWorkspace();
  const searchParams = useSearchParams();
  const dispatch = useAppDispatch();
  const activeTab = resolveAssetVaultTab(searchParams);
  const assetUpgradeOpen = searchParams.get("assetUpgrade") === "1";
  const [isImportEquipmentsOpen, setIsImportEquipmentsOpen] = useState(false);
  const toggleImportEquipments = () =>
    setIsImportEquipmentsOpen(!isImportEquipmentsOpen);

  const offboardingData = useAppSelector(
    (state) => state.persistedReducers.offboarding,
  ) as Offboard_asset;

  const [isActionDrawerOpen, setIsActionDrawerOpen] = useState(false);
  const [isExportDrawerOpen, setIsExportDrawerOpen] = useState(false);

  const feats = company?.subscription?.plan?.features?.map((feat) => feat.name);
  const fleetAccess = useEntitlementOn("telemetry_agent");
  const showFleetInsightsButton =
    FLEET_INSIGHTS_BUTTON_ENABLED && fleetAccess.ready && fleetAccess.on;

  const actionsDB = useMemo(() => {
    if (!offboardingData) {
      return [];
    }
    if (Array.isArray(offboardingData)) {
      return offboardingData;
    }
    return [offboardingData];
  }, [offboardingData]) as Offboard_asset[];

  const handleClose = () => {
    toggleImportEquipments();
    push(assetVaultTabHref("equipment", activeEntityId));
  };

  const handleTabChange = (tab: AssetVaultTab) => {
    push(assetVaultTabHref(tab, activeEntityId));
  };

  useEffect(() => {
    removeItemsNotCompleted(offboardingData, dispatch);
  }, [dispatch, offboardingData]);

  useEffect(() => {
    dispatch(resetOffboardingData());
  }, [dispatch]);

  useEffect(() => {
    if (searchParams.get("tab") !== "discovered") {
      return;
    }
    if (DISCOVERED_TAB_ENABLED && (!fleetAccess.ready || fleetAccess.on)) {
      return;
    }
    replace(assetVaultTabHref("equipment", activeEntityId));
  }, [
    activeEntityId,
    fleetAccess.on,
    fleetAccess.ready,
    replace,
    searchParams,
  ]);

  const showEquipmentActions = activeTab === "equipment";

  const actionsCount = actionsDB.length;

  return (
    <div className="flex flex-col py-8">
      <PageHeader
        breadCrumbs={["Device Fleet"]}
        pageTitle="Device Fleet"
        pageDescription="Easily view and manage all equipment in your company."
        onBack={back}
      >
        {showEquipmentActions && (
          <div className="flex items-center gap-3">
            {showFleetInsightsButton ? (
              <Button
                color="secondary"
                size="md"
                onPress={() =>
                  push(
                    appendEntityWorkspaceParam(
                      routes.FLEET_INSIGHTS,
                      activeEntityId ?? null,
                    ),
                  )
                }
                isLoading={isTabNavigatePending}
                data-testid="allequipment-button"
              >
                Fleet Insights
              </Button>
            ) : null}
            {feats?.includes("Asset Management") && (
              <>
                <Button
                  color="secondary"
                  size="md"
                  iconLeading={Plus}
                  onPress={toggleImportEquipments}
                  data-testid="allequipment-button-2"
                >
                  Add equipment
                </Button>
                <Button
                  color="secondary"
                  size="md"
                  iconLeading={Download01}
                  onPress={() => setIsExportDrawerOpen(true)}
                  data-testid="allequipment-button-3"
                >
                  Export data
                </Button>
              </>
            )}
            <DisabledWithTooltip
              isDisabled={actionsCount < 1}
              reason={getSeeActionsDisabledReason(actionsCount)}
            >
              <Button
                size="md"
                isDisabled={actionsCount < 1}
                onPress={() => setIsActionDrawerOpen(true)}
                data-testid="allequipment-button-4"
              >
                {actionsCount} See actions
              </Button>
            </DisabledWithTooltip>
          </div>
        )}
      </PageHeader>

      <div className="mt-8">
        <AssetVaultTabs
          activeTab={activeTab}
          onTabChange={handleTabChange}
          isTabNavigatePending={isTabNavigatePending}
          isActionDrawerOpen={isActionDrawerOpen}
          setIsActionDrawerOpen={setIsActionDrawerOpen}
          isExportDrawerOpen={isExportDrawerOpen}
          setIsExportDrawerOpen={setIsExportDrawerOpen}
          company={company}
        />
      </div>

      <AddEquipments isOpen={isImportEquipmentsOpen} onClose={handleClose} />
      <AssetDetailUpgradeDialog
        open={assetUpgradeOpen}
        onClose={() => replace(assetVaultTabHref(activeTab, activeEntityId))}
      />
    </div>
  );
};

export default AllEquipment;
