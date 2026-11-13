import { product_1, roundedImage_placeholder } from "@/assets/images";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import truncate from "lodash/truncate";
import Image from "next/image";
import React, { FC } from "react";

interface Props {
  name: string;
  image?: string;
  quantity?: number;
  description?: string;
  children: React.ReactNode;
}
const EquipmentWrapper: FC<Props> = ({
  name,
  image,
  children,
  quantity,
  description,
}) => {
  return (
    <Card className="bg-white flex flex-col gap-y-3 rounded-xl w-full text-gray-600 p-4">
      <CardHeader className="flex flex-row items-center space-x-2 p-0">
        <div className="rounded-full w-[40px] flex flex-col justify-center items-center h-[40px] bg-gray-100 relative">
          <Image
            src={image || roundedImage_placeholder}
            alt={"roundedImage_placeholder"}
            className="w-full object-fill rounded-full"
            width={40}
            height={40}
          />
          {quantity && (
            <div className="absolute -bottom-1 shadow-xl right-0 p-2 rounded-full h-4 w-4 bg-gray-100 grid place-content-center">
              <span className="text-gray-700 text-xs font-medium">
                {quantity}
              </span>
            </div>
          )}
        </div>
        <p className="text-sm text-gray-700 font-semibold text-left">
          {truncate(`${name} ${description || ""}`, { length: 40 })}
        </p>
      </CardHeader>
      <CardContent className="p-0 flex flex-row items-center gap-3 w-full">
        {children}
      </CardContent>
    </Card>
  );
};

export default EquipmentWrapper;
