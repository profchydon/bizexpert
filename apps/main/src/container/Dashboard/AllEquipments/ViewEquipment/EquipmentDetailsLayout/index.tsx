import React from "react";
import { IEquipment } from "@/types/equipments";
import {
  viewEquipmentLayoutClass,
  viewEquipmentMainClass,
  viewEquipmentRailClass,
} from "../viewEquipmentClasses";
import EquipmentSidebar from "./EquipmentSidebar";
import EquipmentTabs from "./EquipmentTabs";

interface FormattedItem {
  value: string;
  label: string;
  icon?: React.ReactNode;
}

interface Props {
  equipmentData: IEquipment;
  allEquipment: IEquipment[];
  onEdit: () => void;
  onViewDetails: () => void;
  onImproveScore: () => void;
  onCorrect: () => void;
  employeeDataOptions: FormattedItem[];
  currentEmployee: any;
}

const EquipmentDetailsLayout: React.FC<Props> = ({
  equipmentData,
  allEquipment,
  onEdit,
  onViewDetails,
  onImproveScore,
  employeeDataOptions,
  currentEmployee,
  onCorrect,
}) => {
  return (
    <div className={viewEquipmentLayoutClass}>
      <aside className={viewEquipmentRailClass}>
        <EquipmentSidebar
          equipment={equipmentData}
          allEquipment={allEquipment}
          employeeDataOptions={employeeDataOptions}
          currentEmployee={currentEmployee}
        />
      </aside>
      <div className={viewEquipmentMainClass}>
        <EquipmentTabs
          equipment={equipmentData}
          onImproveScore={onImproveScore}
          onEdit={onEdit}
          onViewDetails={onViewDetails}
          onCorrect={onCorrect}
        />
      </div>
    </div>
  );
};

export default EquipmentDetailsLayout;
