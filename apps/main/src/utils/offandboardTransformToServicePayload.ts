type GroupedAssigneeData = {
  actionType: string;
  assignee: {
    id: string;
    country_id: string;
  };
  receiver?: any;
  assets: {
    id?: string;
    asset_pricing_id?: string;
    flowType: "offboarding" | "onboarding";
    employee_id?: string;
    fulfillment_date?: string;
    storage?: boolean;

    // Add these for proper typing
    collectionDate?: string;
    storageDuration?: string;
    actionType?: string;
    pricing?: {
      id: string;
    };
  }[];
  collectionDate: string;
};

export type FlowSource = "from_marketplace" | "from_storage";

type ServicePayload = {
  [flowType: string]: {
    payment_method: string;
    country_id: string;
    service_type: string;
    employee_country_id?: string;
    orders: {
      [employee_id: string]: {
        equipment?: {
          equipment_id: string;
          quantity: number;
          storage?: boolean;
          collection_date?: string;
          duration?: string;
          archive?: boolean;
          signature_requested?: boolean;
        }[];
        assets?: {
          asset_pricing_id: string;
          employee_id: string;
          quantity: number;
          fulfillment_date: string;
          note?: string;
          signature_requested?: boolean;
        }[];
      };
    };
  };
};

interface Props {
  groupedData: GroupedAssigneeData[];
  payment_method: string;
  flowSource: FlowSource;
  countryId: string;
  companyCountryId: string;
  isDeviceRefreshFlow: boolean;
  isSignatureRequired?: boolean;
}

export const offandboardTransformToServicePayload = ({
  groupedData,
  payment_method,
  flowSource,
  countryId,
  companyCountryId,
  isDeviceRefreshFlow,
  isSignatureRequired,
}: Props): ServicePayload => {
  const result: ServicePayload = {};

  groupedData.forEach((group) => {
    group.assets.forEach((asset) => {
      const flowType = asset.flowType; // "onboarding" | "offboarding"
      const assigneeId = group.assignee?.id;

      // Determine payload key for onboarding
      const onboardingKey =
        flowType === "onboarding"
          ? flowSource === "from_marketplace"
            ? "onboarding"
            : "onboarding_from_storage"
          : "offboarding";

      if (!result[onboardingKey]) {
        result[onboardingKey] = {
          payment_method,
          country_id: !isDeviceRefreshFlow
            ? flowType === "offboarding"
              ? companyCountryId
              : countryId
            : companyCountryId,
          service_type:
            flowType === "offboarding" ? "Offboarding" : "Onboarding",
          ...(flowType === "onboarding" &&
            flowSource === "from_marketplace" && {
              employee_country_id: countryId,
            }),
          orders: {},
        };
      }

      if (!result[onboardingKey].orders[assigneeId]) {
        result[onboardingKey].orders[assigneeId] = {};
      }

      // Handle Offboarding
      if (flowType === "offboarding") {
        if (!result[onboardingKey].orders[assigneeId].equipment) {
          result[onboardingKey].orders[assigneeId].equipment = [];
        }

        result[onboardingKey].orders[assigneeId].equipment?.push({
          equipment_id: asset?.id!,
          quantity: 1,
          collection_date: asset?.collectionDate,
          ...(asset?.actionType !== "Dispose"
            ? {
                storage: true,
                duration: "3",
              }
            : {
                archive: true,
              }),
          ...(asset?.storageDuration && {
            duration: asset?.storageDuration,
          }),
        });
      }

      // Handle Onboarding
      if (flowType === "onboarding") {
        if (flowSource === "from_marketplace") {
          if (!result[onboardingKey].orders[assigneeId].assets) {
            result[onboardingKey].orders[assigneeId].assets = [];
          }

          result[onboardingKey].orders[assigneeId].assets?.push({
            asset_pricing_id: asset?.pricing?.id! as string,
            employee_id: assigneeId,
            quantity: 1,
            fulfillment_date: asset?.fulfillment_date!,
            note: (asset as any)?.note,
            signature_requested: isSignatureRequired,
          });
        }

        if (flowSource === "from_storage") {
          if (!result[onboardingKey].orders[assigneeId].equipment) {
            result[onboardingKey].orders[assigneeId].equipment = [];
          }

          result[onboardingKey].orders[assigneeId].equipment?.push({
            equipment_id: asset?.id!,
            quantity: 1,
            signature_requested: isSignatureRequired,
          });
        }
      }
    });
  });

  return result;
};
