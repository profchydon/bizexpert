import { cn } from "@/lib/utils";
import React, { ReactNode } from "react";

interface Props {
  label: string | ReactNode;
  value?: string | ReactNode;
  titleStyle?: string;
}

const EquipmentDetailItem: React.FC<Props> = ({ label, value, titleStyle }) => {
  return (
    <div>
      <h3 className={cn("text-sm font-medium text-gray-600 mb-1", titleStyle)}>
        {label}
      </h3>
      {value && <p className="text-gray-900 empty:none">{value}</p>}
    </div>
  );
};

export default EquipmentDetailItem;
