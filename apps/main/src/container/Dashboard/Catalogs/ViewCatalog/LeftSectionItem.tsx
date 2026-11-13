import React from "react";
import Image from "next/image";
import { roundedImage_placeholder } from "@/assets/images";

interface Props {
  title: string;
  description: string | React.ReactNode;
  icon: string | null;
}
const LeftSectionItem: React.FC<Props> = ({ description, title, icon }) => {
  return (
    <div className="flex flex-col gap-y-2">
      <span className="text-sm font-medium">{title}</span>
      <div className="flex items-center gap-x-2">
        {icon && <Image src={icon} alt={title} className="w-6 h-6" />}
        <span className="text-lg font-medium">{description}</span>
      </div>
    </div>
  );
};

export default LeftSectionItem;
