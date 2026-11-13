"use client";

import { Trash } from "lucide-react";
import React, { useEffect } from "react";
import DrawerRight from "@/components/DrawerRight";
import { product_1 } from "@/assets/images";
import formatAmount from "@/utils/formatAmount";
import { useAuthUserDetail } from "@/utils/useAuthUser";
import { cn } from "@/lib/utils";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ICatalog } from "@/types/catalog";
import useCatalog from "@/hooks/useCatalog";
import Link from "next/link";
import routes from "@/routes";
import { Badge } from "@/components/ui/badge";

import { useWorkspaceCurrencySymbol } from "@/hooks/useWorkspaceCurrencySymbol";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  catalog?: ICatalog;
}

const ItemSummary: React.FC<Props> = ({ isOpen, onClose, catalog }) => {
  const currencySymbol = useWorkspaceCurrencySymbol();

  const catalogAsset = catalog?.assets?.data ?? [];

  const { totalAssetAmountRange, handleRemoveAsset, isRemoveAssetLoading } =
    useCatalog(catalog!);

  useEffect(() => {
    if (catalogAsset.length === 0) {
      onClose();
    }
  }, [catalogAsset.length, onClose]);

  return (
    <DrawerRight
      isOpen={isOpen}
      onClose={onClose}
      onCancel={onClose}
      drawerDescription=""
      drawerTitle="Items summary"
      hideDefaultFooterBtn
      data-testid="itemsummary-drawerright"
    >
      <div className="absolute w-full flex flex-row justify-between pb-2 z-[50] top-[50px] border-b shadow-none bg-white py-1 right-0 left-0">
        <div className="pl-6 ">
          <span className="font-semibold text-primary-600 text-sm w-14 h-4 bg-[#F0F6FF] rounded-lg px-2 py-1">
            {catalogAsset.length} item(s)
          </span>
        </div>
        <div className="pr-5 ">
          <span className="text-normal font-semibold text-xl text-gray-900">
            {totalAssetAmountRange ?? (
              <Badge variant="red">Not available</Badge>
            )}
          </span>
        </div>
      </div>

      <div className=" space-y-3 flex flex-col flex-grow overflow-auto">
        {catalogAsset.map((item) => {
          const formattedArray = Object.entries(item.spec)
            .map(([key, value]) => value)
            .join(" ");
          return (
            <div
              key={item.asset_pricing.id}
              className="border-b py-6 flex flex-row items-center justify-between"
            >
              <div className="flex items-center space-x-2">
                <Avatar className="h-12 w-12">
                  <AvatarImage
                    src={(item?.images?.[0] as string) ?? product_1}
                    alt="asset_image"
                  />
                </Avatar>
                <div className="font-semibold flex flex-col text-base space-y-1">
                  <div>
                    <p
                      className="text-sm text-gray-900 font-semibold line-clamp-2"
                      title={`${item?.name} ${formattedArray}`}
                    >
                      {item?.name}
                    </p>
                    <small>{formattedArray}</small>
                  </div>
                </div>
              </div>

              <div className="sm:text-sm md:text-base flex flex-col items-end justify-between space-y-1">
                <Trash
                  className={cn(
                    "text-gray-500 cursor-pointer font-sm w-[16px] mb-2 justify-end",
                    isRemoveAssetLoading && "pointer-events-none",
                  )}
                  onClick={() => {
                    handleRemoveAsset(item.asset_pricing.id);
                  }}
                />
                <span className="text-xs md:text-sm text-gray-600 font-normal">
                  {`${currencySymbol}${formatAmount(item.asset_pricing.amount)}`}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="py-4 space-y-1">
        <div className="border-b py-4 flex flex-row items-center justify-between">
          <span className="text-sm font-medium">Subtotal</span>
          <span className="text-sm font-medium">
            {totalAssetAmountRange ?? (
              <Badge variant="red">Not available</Badge>
            )}
          </span>
        </div>
      </div>

      {/* <div className="bg-[#F9FAFB]  ">
        <div className="py-4 space-y-3 items-center justify-center px-4">
          <p className="font-semibold IBM Plex Sans text-base leading-6 text-black">
            Note
          </p>
          <p className="font-normal text-sm leading-5 text-black">
            All assets purchased through the website will have insurance
            coverage in case of any damage or loss during transit, after
            delivery and duration of use.
          </p>
        </div>
      </div> */}

      <Link href={`${routes.CATALOGS}/${catalog?.id}`}>
        <Button
          className="w-full text-sm mt-8"
          data-testid="itemsummary-button"
        >
          Add Items
        </Button>
      </Link>
    </DrawerRight>
  );
};

export default ItemSummary;
