"use client";

import {
  useClassifyDiscoveredDeviceMutation,
  useDismissDiscoveredDeviceMutation,
  useGetDiscoveredDevicesQuery,
  type DiscoveredDevice,
} from "@/api/baseQueries/companiesApi/telemetryApi";
import { useWorkspaceCompanyId } from "@/hooks/useWorkspaceCompanyId";
import type { Ownership } from "@/container/Dashboard/AllEquipments/ViewEquipment/telemetry/types";
import { DISCOVERED_TAB_ENABLED } from "../assetVaultTab";

export function usePendingDiscovered(): DiscoveredDevice[] {
  const companyId = useWorkspaceCompanyId() as string;
  const query = useGetDiscoveredDevicesQuery(
    { companyId },
    { skip: !DISCOVERED_TAB_ENABLED || !companyId },
  );
  return query.data?.data ?? [];
}

export function usePendingDiscoveredCount(): number {
  return usePendingDiscovered().length;
}

export function useDiscoveredActions() {
  const companyId = useWorkspaceCompanyId() as string;
  const [classify] = useClassifyDiscoveredDeviceMutation();
  const [dismiss] = useDismissDiscoveredDeviceMutation();

  return {
    approveDiscovered: (device: DiscoveredDevice, ownership: Ownership) =>
      classify({ companyId, agentId: device.id, ownership }).unwrap(),
    dismissDiscovered: (device: DiscoveredDevice) =>
      dismiss({ companyId, agentId: device.id }).unwrap(),
  };
}
