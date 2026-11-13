import React, { useCallback, useMemo } from "react";
import { useGetAssetTypesQuery } from "@/api/baseQueries/assetsApi/getAssetTypes";
import {
  buildAssetTypeMix,
  mapDispositionToAnalytics,
  trackDeviceDispositionSelected,
} from "@/lib/offboardAnalytics";
import type { Disposition } from "@/types/offboard";
import AssignedDevicesCard from "./AssignedDevicesCard";
import OffboardingWindowCard from "./OffboardingWindowCard";
import ServiceFeeBreakdown from "./ServiceFeeBreakdown";
import { resolveAssetTypeName } from "./resolveAssetTypeName";
import { useTrackOffboardFeeShown } from "./useTrackOffboardFeeShown";
import { useEmployeeOffboardFees } from "./useEmployeeOffboardFees";
import type { useOffboardDevicesState } from "./useOffboardDevicesState";
import type { useRetrievalWindows } from "./useRetrievalWindows";

type DevicesState = ReturnType<typeof useOffboardDevicesState>;
type WindowsState = ReturnType<typeof useRetrievalWindows>;

interface Props {
  currentId: string;
  sourceCountry?: string;
  excludeIds: string[];
  devices: DevicesState;
  windows: WindowsState;
}

const EmployeeDevicesSection: React.FC<Props> = ({
  currentId,
  sourceCountry,
  excludeIds,
  devices,
  windows,
}) => {
  const { data: assetTypesRes } = useGetAssetTypesQuery();
  const assetTypes = assetTypesRes?.data;
  const lines = devices.getLines(currentId);
  const selectedLines = devices.getSelectedLines(currentId);
  const { breakdown, isLoading: isFeesLoading } = useEmployeeOffboardFees({
    employeeId: currentId,
    lines: selectedLines,
  });
  const assetTypeMix = useMemo(
    () => buildAssetTypeMix(selectedLines, assetTypes),
    [assetTypes, selectedLines],
  );

  useTrackOffboardFeeShown(breakdown, assetTypeMix, isFeesLoading);

  const trackDisposition = useCallback(
    (lineId: string, disposition: Disposition) => {
      const analyticsDisposition = mapDispositionToAnalytics(disposition);
      if (!analyticsDisposition) return;
      const line = lines.find((item) => item.id === lineId);
      if (!line) return;
      trackDeviceDispositionSelected(
        analyticsDisposition,
        resolveAssetTypeName(line.assetType, assetTypes) ?? "unknown",
      );
    },
    [assetTypes, lines],
  );

  return (
    <div className="flex flex-col gap-6">
      <AssignedDevicesCard
        lines={lines}
        employeeId={currentId}
        selectedIds={devices.getSelectedIds(currentId)}
        sourceCountry={sourceCountry}
        excludeIds={excludeIds}
        onFee={(lineId, fee) => devices.updateLine(currentId, lineId, { fee })}
        onToggleSelect={(lineId, checked) =>
          devices.toggleSelect(currentId, lineId, checked)
        }
        onSelectAll={(checked) =>
          devices.setSelection(
            currentId,
            checked ? lines.map((line) => line.id) : [],
          )
        }
        onDisposition={(lineId, value) => {
          devices.setDisposition(currentId, lineId, value);
          trackDisposition(lineId, value);
        }}
        onWipe={(lineId, value) => devices.setWipe(currentId, lineId, value)}
        onReassign={(lineId, target) =>
          devices.setReassignTarget(currentId, lineId, target)
        }
        onDispositionMany={(lineIds, value) => {
          devices.setDispositionMany(currentId, lineIds, value);
          lineIds.forEach((lineId) => trackDisposition(lineId, value));
        }}
        onWipeMany={(lineIds, value) =>
          devices.setWipeMany(currentId, lineIds, value)
        }
        onReassignMany={(lineIds, target) =>
          devices.reassignMany(currentId, lineIds, target)
        }
      />

      <OffboardingWindowCard
        value={windows.getWindow(currentId)}
        onApply={(window) => windows.setWindow(currentId, window)}
      />

      {selectedLines.length > 0 && (
        <ServiceFeeBreakdown breakdown={breakdown} isLoading={isFeesLoading} />
      )}
    </div>
  );
};

export default EmployeeDevicesSection;
