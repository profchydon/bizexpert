import React from "react";
import DrawerRight from "@/components/DrawerRight";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { iphone, dell, hp } from "@/assets/images";

const cardData = [
  {
    id: "1",
    imageIcon: dell,
    imageAlt: "my_product_icon",
    item_name: "Dell XPS 13",
    Estimated_Price: "$7,845.67",
  },
  {
    id: "2",
    imageIcon: iphone,
    imageAlt: "my_product_icon",
    item_name: "iPhone 12",
    Estimated_Price: "$8,845.67",
  },
  {
    id: "3",
    imageIcon: hp,
    imageAlt: "my_product_icon",
    item_name: "iPad Pro",
    Estimated_Price: "$6,845.67",
  },
];

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const SalesEquipmentPrice: React.FC<Props> = ({ isOpen, onClose }) => {
  return (
    <DrawerRight
      isOpen={isOpen}
      onCancel={onClose}
      onClose={onClose}
      hideDefaultFooterBtn
      drawerTitle="Sales Price"
      drawerDescription="See the estimated sales price right here"
      data-testid="salesequipmentprice-drawerright"
    >
      <div className="flex flex-col w-full gap-y-4">
        <div className="flex flex-col rounded-xl border border-primary-300 bg-primary-50 p-6 ">
          <span className="font-semibold text-base text-primary-700">
            $15,000 - $19,600
          </span>
          <span className="text-primary-600 text-base font-normal">
            This is the extimated price for sales
          </span>
        </div>

        {cardData.map((data: any, index: number) => (
          <Card key={index}>
            <CardContent className="p-4 flex flex-col items-start space-y-3">
              <div className="flex flex-row items-center space-x-2">
                <Image src={data.imageIcon} alt="data.imageAlt" />

                <span className="text-sm font-semibold">{data.item_name}</span>
              </div>

              <Separator className="w-full bg-gray-200 h-0.5" />

              <div className="flex flex-row items-center space-x-2">
                <span className="text-gray-600 font-normal text-sm">
                  Estimated Price:
                </span>
                <span className="font-medium text-sm text-gray-900">
                  {data.Estimated_Price}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="fixed bottom-0 left-0 right-0 border-t bg-white px-6 py-4 ">
        <div className="grid place-content-end my-auto h-full w-full">
          <div className="flex gap-x-6 ">
            <Button
              className="text-sm font-semibold"
              onClick={onClose}
              variant="outline"
              data-testid="salesequipmentprice-button"
            >
              Cancel
            </Button>
            <Button
              className="text-sm font-semibold"
              data-testid="salesequipmentprice-button-2"
            >
              Submit
            </Button>
          </div>
        </div>
      </div>
    </DrawerRight>
  );
};

export default SalesEquipmentPrice;
