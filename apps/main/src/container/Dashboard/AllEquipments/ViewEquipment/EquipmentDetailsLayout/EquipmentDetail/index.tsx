import React from "react";
import EquipmentOverview from "./EquipmentOverview";
import EquipmentAssetStatus from "./EquipmentAssetStatus";
import { RawActivity } from "@/types/activity";
import EquipmentRecentActivity from "./EquipmentRecentActivity";
import ReachedEndLifeAlert from "@/components/DeviceRefresh/ReachedEndLifeAlert";
import { IEquipment } from "@/types/equipments";
import { IUserRole } from "@/utils/hasAccess";
import { viewEquipmentOverviewStackClass } from "../../viewEquipmentClasses";

interface Props {
  equipment: IEquipment;
  onEdit: () => void;
  onViewDetails: () => void;
  onImproveScore: () => void;
  onCorrect: () => void;
  userRole: IUserRole;
}

const EquipmentDetail: React.FC<Props> = (props) => {
  const {
    equipment,
    onEdit,
    onViewDetails,
    onImproveScore,
    onCorrect,
    userRole,
  } = props;

  const isRefreshTrue =
    equipment?.refresh_details?.refresh_status === "Due" ||
    equipment?.refresh_details?.refresh_status === "Overdue";

  return (
    <div className={viewEquipmentOverviewStackClass}>
      {isRefreshTrue && (
        <ReachedEndLifeAlert onCorrect={onCorrect} status={equipment?.status} />
      )}

      <EquipmentOverview
        equipment={equipment}
        onEdit={onEdit}
        onViewDetails={onViewDetails}
      />
      <EquipmentAssetStatus
        equipment={equipment}
        onImproveScore={onImproveScore}
        isRefreshTrue={isRefreshTrue}
      />
      <EquipmentRecentActivity
        activities={equipment?.history as RawActivity[]}
        userRole={userRole}
      />
    </div>
  );
};

export default EquipmentDetail;
