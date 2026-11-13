import type {
  StorageDeployWriteItem,
  StorageDeviceCheckWriteItem,
  StorageDisposalWriteItem,
} from "./cartLineTypes";

export type StorageCartWriteSource = {
  kind: "deployment" | "device_check" | "disposal";
  deviceId: string;
  checkReason?: string;
  checkNote?: string;
  neededBy?: string;
  disposalMethod?: string;
  employeeId?: string;
  deviceSetup?: string;
  signatureRequested?: boolean;
};

export type StorageCartWriteItem =
  | StorageDeviceCheckWriteItem
  | StorageDisposalWriteItem
  | StorageDeployWriteItem;

export function toStorageCartWriteItems(
  items: StorageCartWriteSource[],
  companyId: string,
): StorageCartWriteItem[] {
  const writeItems: StorageCartWriteItem[] = [];

  for (const item of items) {
    if (!item.deviceId || !companyId) continue;

    if (item.kind === "device_check") {
      const reason =
        item.checkReason?.trim() || item.checkNote?.trim() || "Re-grade check";
      const neededBy = item.neededBy?.trim();
      writeItems.push({
        type: "storage_device_check",
        equipment_id: item.deviceId,
        company_id: companyId,
        reason,
        ...(neededBy ? { needed_by: neededBy } : {}),
      });
      continue;
    }

    if (item.kind === "disposal") {
      const reason =
        item.checkReason?.trim() || item.checkNote?.trim() || undefined;
      const disposalMethod = item.disposalMethod?.trim();
      writeItems.push({
        type: "storage_disposal",
        equipment_id: item.deviceId,
        company_id: companyId,
        ...(reason ? { reason } : {}),
        ...(disposalMethod ? { disposal_method: disposalMethod } : {}),
      });
      continue;
    }

    const employeeId = item.employeeId?.trim();
    if (!employeeId) continue;
    const deviceSetup = item.deviceSetup?.trim();
    writeItems.push({
      type: "storage_deploy_to_employee",
      equipment_id: item.deviceId,
      company_id: companyId,
      employee_id: employeeId,
      ...(typeof item.signatureRequested === "boolean"
        ? { signature_requested: item.signatureRequested }
        : {}),
      ...(deviceSetup ? { device_setup: deviceSetup } : {}),
    });
  }

  return writeItems;
}
