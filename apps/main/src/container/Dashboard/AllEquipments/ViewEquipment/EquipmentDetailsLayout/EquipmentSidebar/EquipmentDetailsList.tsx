import React from "react";
import {
  viewEquipmentStatItemClass,
  viewEquipmentStatLabelClass,
  viewEquipmentStatValueClass,
  viewEquipmentStatsListClass,
} from "../../viewEquipmentClasses";

interface Props {
  usage: {
    duration?: string;
    insuranceExpiry?: string;
    storageDuration?: string;
    equipmentStatus?: string;
  };
}

const EquipmentDetailsList: React.FC<Props> = ({ usage }) => {
  const showStorage =
    usage?.storageDuration && usage?.equipmentStatus === "in_storage";

  if (!usage?.duration && !usage?.insuranceExpiry && !showStorage) {
    return null;
  }

  return (
    <div className={viewEquipmentStatsListClass}>
      {usage?.duration ? (
        <div className={viewEquipmentStatItemClass}>
          <span className={viewEquipmentStatLabelClass}>Usage duration</span>
          <span className={viewEquipmentStatValueClass}>{usage.duration}</span>
        </div>
      ) : null}
      {usage?.insuranceExpiry ? (
        <div className={viewEquipmentStatItemClass}>
          <span className={viewEquipmentStatLabelClass}>
            Insurance expiring in
          </span>
          <span className={viewEquipmentStatValueClass}>
            {usage.insuranceExpiry}
          </span>
        </div>
      ) : null}
      {showStorage ? (
        <div className={viewEquipmentStatItemClass}>
          <span className={viewEquipmentStatLabelClass}>Storage duration</span>
          <span className={viewEquipmentStatValueClass}>
            {usage.storageDuration}
          </span>
        </div>
      ) : null}
    </div>
  );
};

export default EquipmentDetailsList;
