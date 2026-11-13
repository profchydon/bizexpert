import { Offboard_asset } from "@/types/offboarding";

export const cancelSelectAReceiver = ({
  offboardingData,
  equipID,
  editInstance,
  modifyInstance,
  baseRoute,
  push,
  dispatchDelete,
  resetAndClose,
}: {
  offboardingData: Offboard_asset | Offboard_asset[];
  equipID?: string | null;
  editInstance: boolean;
  modifyInstance: boolean;
  baseRoute: string;
  push: (path: string) => void;
  dispatchDelete: (id: string) => void;
  resetAndClose: () => void;
}) => {
  const resetStateAndNavigate = () => {
    if (editInstance && baseRoute) {
      push(`${baseRoute}/view-actions`);
    } else if (!modifyInstance && baseRoute) {
      push(baseRoute);
    } else if (baseRoute) {
      push(`${baseRoute}/order-summary`);
    }
    resetAndClose();
  };

  if (Array.isArray(offboardingData)) {
    offboardingData
      .filter((item) => item.statusFlow !== "Completed")
      .forEach((item) => dispatchDelete(item.id));
    resetStateAndNavigate();
    return;
  }

  if (offboardingData?.statusFlow !== "Completed" && equipID) {
    dispatchDelete(equipID);
  }

  resetStateAndNavigate();
};
