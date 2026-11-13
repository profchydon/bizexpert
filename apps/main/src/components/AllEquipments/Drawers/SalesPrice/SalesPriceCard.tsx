import { product_1, roundedImage_placeholder } from "@/assets/images";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardFooter, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";
import React, { FC } from "react";

interface Props {
  image?: string;
  name: string;
  estimatedPrice: string;
}
const SalesPriceCard: FC<Props> = ({ image, name, estimatedPrice }) => {
  return (
    <Card className="bg-white flex flex-col gap-y-3 rounded-xl w-full text-gray-600 p-4">
      <CardHeader className="flex flex-row items-center space-x-2 p-0">
        <div className="rounded-full w-[40px] flex flex-col justify-center items-center h-[40px] bg-gray-100">
          <Image
            src={image || roundedImage_placeholder}
            alt={"image_placeholder"}
            className="w-full object-fill rounded-full"
            width={40}
            height={40}
          />
        </div>
        <p className="text-sm text-gray-700 font-semibold text-left">{name}</p>
      </CardHeader>
      <Separator />
      <CardFooter className="p-0 flex flex-row items-center gap-3">
        <p className="text-sm text-gray-600">
          Estimated price:{" "}
          <span className="text-gray-900 font-medium">
            {estimatedPrice || ""}
          </span>
        </p>
      </CardFooter>
    </Card>
  );
};

export default SalesPriceCard;
