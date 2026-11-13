export type StorageActionFeePaymentMethod = "Card" | "Credit";

export type StorageActionDeviceCheckFeeOrder = {
  type: "storage_device_check";
  equipment_id: string;
  company_id: string;
  reason: string;
  needed_by?: string;
};

export type StorageActionDisposalFeeOrder = {
  type: "storage_disposal";
  equipment_id: string;
  company_id: string;
  reason?: string;
  disposal_method?: string;
};

export type StorageActionDeployFeeOrder = {
  type: "storage_deploy_to_employee";
  equipment_id: string;
  company_id: string;
  employee_id: string;
  signature_requested?: boolean;
  device_setup?: string;
};

export type StorageActionFeeOrder =
  | StorageActionDeviceCheckFeeOrder
  | StorageActionDisposalFeeOrder
  | StorageActionDeployFeeOrder;

export type StorageActionFeeOrderSource = {
  kind: "deployment" | "device_check" | "disposal";
  deviceId: string;
  companyId?: string;
  checkReason?: string;
  checkNote?: string;
  neededBy?: string;
  disposalMethod?: string;
  employeeId?: string;
  deviceSetup?: string;
  signatureRequested?: boolean;
};

function optionalText(value: string | undefined) {
  const trimmed = value?.trim();
  return trimmed ? trimmed : undefined;
}

export function toStorageActionFeeOrders(
  items: StorageActionFeeOrderSource[],
  companyId: string,
): StorageActionFeeOrder[] {
  const orders: StorageActionFeeOrder[] = [];

  for (const item of items) {
    const equipmentId = item.deviceId.trim();
    const orderCompanyId = optionalText(item.companyId) ?? companyId.trim();
    if (!equipmentId || !orderCompanyId) continue;

    if (item.kind === "device_check") {
      const neededBy = optionalText(item.neededBy);
      orders.push({
        type: "storage_device_check",
        equipment_id: equipmentId,
        company_id: orderCompanyId,
        reason:
          optionalText(item.checkReason) ||
          optionalText(item.checkNote) ||
          "Re-grade check",
        ...(neededBy ? { needed_by: neededBy } : {}),
      });
      continue;
    }

    if (item.kind === "disposal") {
      const reason =
        optionalText(item.checkReason) || optionalText(item.checkNote);
      const disposalMethod = optionalText(item.disposalMethod);
      orders.push({
        type: "storage_disposal",
        equipment_id: equipmentId,
        company_id: orderCompanyId,
        ...(reason ? { reason } : {}),
        ...(disposalMethod ? { disposal_method: disposalMethod } : {}),
      });
      continue;
    }

    const employeeId = optionalText(item.employeeId);
    if (!employeeId) continue;
    const deviceSetup = optionalText(item.deviceSetup);
    orders.push({
      type: "storage_deploy_to_employee",
      equipment_id: equipmentId,
      company_id: orderCompanyId,
      employee_id: employeeId,
      ...(typeof item.signatureRequested === "boolean"
        ? { signature_requested: item.signatureRequested }
        : {}),
      ...(deviceSetup ? { device_setup: deviceSetup } : {}),
    });
  }

  return orders;
}

export type StorageActionInitiateOrder = Omit<
  StorageActionFeeOrder,
  "company_id"
>;

export function toStorageActionInitiateOrders(
  feeOrders: StorageActionFeeOrder[],
  signatureRequested?: boolean,
): StorageActionInitiateOrder[] {
  return feeOrders.map((order) => {
    const { company_id: _, ...rest } = order;
    if (rest.type !== "storage_deploy_to_employee") return rest;
    return {
      ...rest,
      ...(typeof signatureRequested === "boolean"
        ? { signature_requested: signatureRequested }
        : {}),
    };
  });
}
