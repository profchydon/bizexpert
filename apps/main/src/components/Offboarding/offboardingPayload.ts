import { FeeTransformOutput } from "@/types/offboarding";
import { format } from "date-fns";
import { UNASSIGNED_ORDER_SUMMARY_KEY } from "@/utils/getInitials";

export const transformDataForOffboardingFee = (
  items: any[],
): FeeTransformOutput => {
  const output: FeeTransformOutput = {};

  items?.forEach((item) => {
    item?.assets?.forEach((asset: any) => {
      // Initialize assignee entry if it doesn't exist
      if (!output[item?.assignee?.id ?? UNASSIGNED_ORDER_SUMMARY_KEY]) {
        output[item?.assignee?.id ?? UNASSIGNED_ORDER_SUMMARY_KEY] = {
          equipment: [],
        };
      }

      const existingEquipment = output[
        item.assignee?.id ?? UNASSIGNED_ORDER_SUMMARY_KEY
      ].equipment.find((equip) => equip?.equipment_id === asset?.id);

      // If the equipment already exists, increment quantity, otherwise add a new entry
      if (existingEquipment) {
        existingEquipment.quantity += 1;

        // Set action type conditions
        if (asset.actionType === "Store") {
          existingEquipment.storage = true;
        } else if (asset.actionType === "Transfer") {
          existingEquipment.reassign = true;
        } else if (asset.actionType === "Sale") {
          existingEquipment.resale = true;
        } else if (asset.actionType === "Archive") {
          existingEquipment.dispose = true;
        }

        if (asset.factoryReset) {
          existingEquipment.factory_reset = true;
        }
      } else {
        const newEquipment: any = {
          equipment_id: asset?.id,
          quantity: 1,
        };

        // Set action type conditions
        if (asset.actionType === "Store") {
          newEquipment.storage = true;
        } else if (asset.actionType === "Transfer") {
          newEquipment.reassign = true;
        } else if (asset.actionType === "Sale") {
          newEquipment.resale = true;
        } else if (asset.actionType === "Archive") {
          newEquipment.dispose = true;
        }

        if (asset.factoryReset) {
          newEquipment.factory_reset = true;
        }

        output[
          item.assignee?.id ?? UNASSIGNED_ORDER_SUMMARY_KEY
        ].equipment.push(newEquipment);
      }
    });
  });

  return output;
};

type DataType = Record<string, any>;
export const getIdObject = (id: string, data: DataType): any | null => {
  if (!id || !data) return null;
  return data[id] || null;
};

interface ITransformPayment {
  items: any[];
  feeData: Record<string, any>;
  isSignatureRequired: boolean;
  isEmployeeOffboarding?: boolean;
}

const paymentCollectionDate = (
  asset: any,
  isEmployeeOffboarding: boolean,
): { start: string; end: string } => {
  if (isEmployeeOffboarding) {
    return asset?.collectionWindow ?? { start: "", end: "" };
  }
  const date = asset?.collectionDate
    ? format(asset.collectionDate as string, "yyyy-MM-dd")
    : "";
  return { start: date, end: date };
};

export const transformDataForOffboardingPayment = ({
  items,
  feeData,
  isSignatureRequired,
  isEmployeeOffboarding = false,
}: ITransformPayment): FeeTransformOutput => {
  const output: FeeTransformOutput = {};

  items?.forEach((item) => {
    item?.assets?.forEach((asset: any) => {
      // Initialize assignee entry if it doesn't exist
      if (!output[item?.assignee?.id ?? UNASSIGNED_ORDER_SUMMARY_KEY]) {
        output[item?.assignee?.id ?? UNASSIGNED_ORDER_SUMMARY_KEY] = {
          equipment: [],
          total_fee:
            getIdObject(item?.assignee?.id, feeData)?.fees?.total_fee || 0,
        };
      }

      const existingEquipment = output[
        item.assignee?.id ?? UNASSIGNED_ORDER_SUMMARY_KEY
      ].equipment.find((equip) => equip?.equipment_id === asset?.id);

      // If the equipment already exists, increment quantity, otherwise add a new entry
      if (existingEquipment) {
        existingEquipment.quantity += 1;
        existingEquipment.collection_date = paymentCollectionDate(
          asset,
          isEmployeeOffboarding,
        );

        // Set action type conditions
        if (asset.actionType === "Store") {
          existingEquipment.storage = true;
          existingEquipment.duration = `${asset?.storageDuration || ""} months`;
        } else if (asset.actionType === "Transfer") {
          existingEquipment.reassign = true;
          existingEquipment.assignee = asset?.receiver?.id;
        } else if (asset.actionType === "Sale") {
          existingEquipment.resale = true;
          existingEquipment.estimated_value = asset?.estimatedSalesPrice;
        } else if (asset.actionType === "Archive") {
          if (isEmployeeOffboarding) existingEquipment.dispose = true;
          else existingEquipment.archive = true;
        }

        if (asset.factoryReset) existingEquipment.factory_reset = true;
      } else {
        const newEquipment: any = {
          equipment_id: asset?.id,
          quantity: 1,
          signature_requested: isSignatureRequired,
          collection_date: paymentCollectionDate(asset, isEmployeeOffboarding),
        };

        // Set action type conditions
        if (asset.actionType === "Store") {
          newEquipment.storage = true;
          newEquipment.duration = `${asset?.storageDuration || ""} months`;
        } else if (asset.actionType === "Transfer") {
          newEquipment.reassign = true;
          newEquipment.assignee = asset?.receiver?.id;
        } else if (asset.actionType === "Sale") {
          newEquipment.resale = true;
          newEquipment.estimated_value = asset?.estimatedSalesPrice;
        } else if (asset.actionType === "Archive") {
          if (isEmployeeOffboarding) newEquipment.dispose = true;
          else newEquipment.archive = true;
        }

        if (asset.factoryReset) newEquipment.factory_reset = true;

        output[
          item.assignee?.id ?? UNASSIGNED_ORDER_SUMMARY_KEY
        ].equipment.push(newEquipment);
      }
    });
  });

  return output;
};
