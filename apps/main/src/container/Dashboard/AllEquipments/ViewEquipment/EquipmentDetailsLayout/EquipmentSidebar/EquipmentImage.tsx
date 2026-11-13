import { monitor_placeholder } from "@/assets/images";
import { SafeImage } from "@/components/SafeImage";
import React from "react";
import {
  viewEquipmentDeviceImageAreaClass,
  viewEquipmentDeviceImageClass,
} from "../../viewEquipmentClasses";

interface Props {
  image?: string;
  name: string;
  type: string;
}

const imageDictionaryByType: Record<string, typeof monitor_placeholder> = {
  Macbook: monitor_placeholder,
  Computer: monitor_placeholder,
};

const EquipmentImage: React.FC<Props> = ({ image, name, type }) => {
  return (
    <div className={viewEquipmentDeviceImageAreaClass}>
      <SafeImage
        src={image}
        alt={name}
        width={240}
        height={240}
        className={viewEquipmentDeviceImageClass}
        fallback={imageDictionaryByType[type] ?? monitor_placeholder}
      />
    </div>
  );
};

export default EquipmentImage;
