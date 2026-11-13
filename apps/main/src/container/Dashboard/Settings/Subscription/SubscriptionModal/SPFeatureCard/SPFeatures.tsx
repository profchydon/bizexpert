import { checked_icon_success_100, unchecked_gray_100 } from "@/assets/icons";
import { IPlanFeatures } from "@/types/plans";
import Image from "next/image";
import React, { FC, memo } from "react";

interface SPFeatureProps {
  data: IPlanFeatures[];
}

const SPFeatures: FC<SPFeatureProps> = ({ data }) => {
  return (
    <div className="w-full grid grid-cols-2 gap-4">
      {data?.map((item, index) => (
        <div key={item.id} className="flex flex-row items-center gap-3">
          <Image
            src={true ? checked_icon_success_100 : unchecked_gray_100}
            alt="checked-icon"
          />
          <span className="text-gray-600 font-normal text-base text-start ">
            {item.name}
          </span>
        </div>
      ))}
    </div>
  );
};

export default memo(SPFeatures);
