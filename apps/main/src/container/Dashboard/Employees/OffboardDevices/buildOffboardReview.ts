import type { OffboardReviewEmployee } from "@/types/offboard";
import { feeForLine, type ServiceFeeTable } from "./offboardFeeTable";
import { resolveAssetTypeName } from "./resolveAssetTypeName";
import type { useOffboardDevicesState } from "./useOffboardDevicesState";
import type { useRetrievalWindows } from "./useRetrievalWindows";

type ReviewEmployee = Pick<
  OffboardReviewEmployee,
  "id" | "name" | "role" | "country"
>;

interface BuildOffboardReviewArgs {
  employees: ReviewEmployee[];
  devices: ReturnType<typeof useOffboardDevicesState>;
  windows: ReturnType<typeof useRetrievalWindows>;
  feeTable: ServiceFeeTable | null;
  assetTypes?: { id: string; name: string }[];
}

export const buildOffboardReview = ({
  employees,
  devices,
  windows,
  feeTable,
  assetTypes,
}: BuildOffboardReviewArgs): OffboardReviewEmployee[] =>
  employees.map((employee) => ({
    id: employee.id,
    name: employee.name,
    role: employee.role,
    country: employee.country,
    window: windows.getWindow(employee.id),
    devices: devices.getSelectedLines(employee.id).map((line) => ({
      ...line,
      fee: feeForLine(
        {
          ...line,
          assetType: resolveAssetTypeName(line.assetType, assetTypes),
        },
        feeTable,
      ),
    })),
  }));
