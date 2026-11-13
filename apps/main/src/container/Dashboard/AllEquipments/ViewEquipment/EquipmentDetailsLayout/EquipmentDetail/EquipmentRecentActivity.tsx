import EquipmentActivityItem from "./EquipmentActivityItem";
import { RawActivity } from "@/types/activity";
import { IUserRole } from "@/utils/hasAccess";
import React, { memo, useMemo } from "react";
import { transformEquipmentActivities } from "../../equipmentActivityTransform";
import { ViewEquipmentDetailCard } from "../../ViewEquipmentDetailCard";

interface Props {
  activities: RawActivity[];
  userRole: IUserRole;
}

const EquipmentRecentActivity: React.FC<Props> = ({ activities, userRole }) => {
  const activityList = useMemo(() => {
    const items = transformEquipmentActivities(activities, userRole);

    return items.map((activity, index) => (
      <EquipmentActivityItem
        key={activity.id}
        activity={activity}
        isLast={index === items.length - 1}
      />
    ));
  }, [activities, userRole]);

  return (
    <ViewEquipmentDetailCard title="Recent activity">
      <ul className="max-h-[600px] overflow-y-auto pr-2">{activityList}</ul>
    </ViewEquipmentDetailCard>
  );
};

export default memo(EquipmentRecentActivity);
