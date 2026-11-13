"use client";

import {
  getRowActionDisabledState,
  getTransferActionLabel,
} from "@/components/AllEquipments/equipmentRowActionState";
import { Button } from "@/components/base/buttons/button";
import { Dropdown } from "@/components/base/dropdown/dropdown";
import {
  useGetTelemetryDeviceQuery,
  useRestoreTelemetryCollectingMutation,
  useStopTelemetryCollectingMutation,
} from "@/api/baseQueries/companiesApi/telemetryApi";
import { useWorkspaceCompanyId } from "@/hooks/useWorkspaceCompanyId";
import { Offboard_asset } from "@/types/offboarding";
import { hasAccess, IUserRole } from "@/utils/hasAccess";
import {
  ChevronDown,
  Edit01,
  Lock01,
  Package,
  SwitchHorizontal01,
} from "@untitledui/icons";
import React, { memo, useState } from "react";
import { telemetryEligible } from "../../telemetry/eligibility";
import { resolveOwnership } from "../../telemetry/ownership";
import { RevokeTelemetryModal } from "../../telemetry/RevokeTelemetryModal";

interface OffboardAsset {
  id: string;
  actionType?: "Transfer" | "Store" | "Sale";
}

interface Props {
  item: {
    id: string;
    assignee?: string | { name?: string };
    status?: string;
    country: string;
    type?: string;
    title?: string;
    source?: string;
    telemetry_ownership?: "company" | "employee" | null;
  };
  onTransferEquipment: () => void;
  onStoreEquipment?: () => void;
  onSellEquipment?: () => void;
  onAddEquipment?: () => void;
  offboardingData?: Offboard_asset | OffboardAsset[];
  userRole: IUserRole;
}

const holderName = (assignee?: string | { name?: string }) => {
  if (!assignee) return "";
  return typeof assignee === "string" ? assignee : (assignee.name ?? "");
};

const EquipmentDetailsActions: React.FC<Props> = memo(
  ({
    item,
    offboardingData,
    onTransferEquipment,
    onStoreEquipment,
    onAddEquipment,
    userRole,
  }) => {
    const companyId = useWorkspaceCompanyId() as string;
    const [revokeOpen, setRevokeOpen] = useState(false);
    const telemetryQuery = useGetTelemetryDeviceQuery(
      { companyId, deviceId: item.id },
      { skip: !companyId || !item.id || !telemetryEligible(item.type) },
    );
    const [stopCollecting, stopState] = useStopTelemetryCollectingMutation();
    const [restoreCollecting, restoreState] =
      useRestoreTelemetryCollectingMutation();
    const device = telemetryQuery.data?.data;
    const employeeOwned =
      resolveOwnership({
        telemetry_ownership:
          (device?.telemetry_ownership as "company" | "employee" | undefined) ??
          item.telemetry_ownership,
        source: item.source,
      }) === "employee";
    const revoked = Boolean(device?.flags.revoked || device?.agent?.stopped_at);
    const canStop = Boolean(device?.agent) && telemetryEligible(item.type);

    const offboardingList = Array.isArray(offboardingData)
      ? offboardingData
      : offboardingData
        ? [offboardingData]
        : [];

    const matchedEquipment = offboardingList.find(
      (data) => data.id === item.id,
    );
    const transferState = getRowActionDisabledState(
      item.status,
      "transfer",
      matchedEquipment?.actionType,
    );
    const storeState = getRowActionDisabledState(
      item.status,
      "store",
      matchedEquipment?.actionType,
    );

    return (
      <>
        <Dropdown.Root>
          <Button
            size="md"
            color="primary"
            className="w-full"
            iconTrailing={ChevronDown}
            data-testid="equipmentdetailsactions-button"
          >
            Actions
          </Button>
          <Dropdown.Popover className="w-56">
            <Dropdown.Menu selectionMode="none">
              {!employeeOwned ? (
                <Dropdown.Item
                  icon={SwitchHorizontal01}
                  label={getTransferActionLabel(item.status)}
                  isDisabled={transferState.isDisabled}
                  disabledReason={transferState.reason}
                  onAction={onTransferEquipment}
                />
              ) : null}
              {!employeeOwned ? (
                <Dropdown.Item
                  icon={Package}
                  label="Store equipment"
                  isDisabled={storeState.isDisabled}
                  disabledReason={storeState.reason}
                  onAction={onStoreEquipment}
                />
              ) : null}
              {hasAccess(userRole, ["Super Administrator", "Administrator"]) ? (
                <Dropdown.Item
                  icon={Edit01}
                  label="Add note"
                  onAction={onAddEquipment}
                />
              ) : null}
              {canStop ? (
                <Dropdown.Item
                  icon={Lock01}
                  label={revoked ? "Restore telemetry" : "Stop telemetry"}
                  isDisabled={stopState.isLoading || restoreState.isLoading}
                  onAction={() => {
                    if (revoked) {
                      void restoreCollecting({ companyId, deviceId: item.id });
                      return;
                    }
                    setRevokeOpen(true);
                  }}
                />
              ) : null}
            </Dropdown.Menu>
          </Dropdown.Popover>
        </Dropdown.Root>
        <RevokeTelemetryModal
          isOpen={revokeOpen}
          onOpenChange={setRevokeOpen}
          deviceName={item.title || "this device"}
          holder={holderName(item.assignee)}
          onConfirm={() => {
            void stopCollecting({ companyId, deviceId: item.id })
              .unwrap()
              .then(() => {
                setRevokeOpen(false);
              });
          }}
        />
      </>
    );
  },
);

export default EquipmentDetailsActions;
