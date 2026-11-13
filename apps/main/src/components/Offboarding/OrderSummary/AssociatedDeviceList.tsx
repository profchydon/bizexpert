import { roundedImage_placeholder } from "@/assets/images";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ICart } from "@/types/cart";
import { IEquipment } from "@/types/equipments";
import {
  ActionType,
  assetActionType,
  Offboard_asset,
} from "@/types/offboarding";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import React, { FC } from "react";
import OrderSummary from "./OrderSummary";
import { getOffboardActionLabel } from "../util";
import { companyBillingCurrencySymbol } from "@/utils/companyBillingCurrency";
import { useAuthUserDetail } from "@/utils/useAuthUser";
import truncate from "lodash/truncate";
import DeviceRefreshFeeBreakdownSummary from "@/components/DeviceRefresh/DeviceRefreshFeeBreakdownSummary";

interface ItemsCardProps {
  image: string;
  name: string;
  description: string;
  actionType: ActionType;
  actionLabel?: string;
  estimatedSalesPrice?: string | number | undefined;
  storageDuration?: string;
  currency_symbol?: string;
}

const ItemsCard: FC<ItemsCardProps> = ({
  image,
  name,
  description,
  actionType,
  actionLabel,
  estimatedSalesPrice,
  storageDuration,
  currency_symbol,
}) => {
  const badgeLabel = actionLabel ?? assetActionType[actionType]?.label;
  return (
    <div className="flex flex-row items-center justify-between py-2 border-b border-border-secondary last:border-b-0">
      <div className="flex flex-row items-center space-x-4 min-w-0 flex-1">
        <div className="rounded-lg w-12 h-12 flex flex-col justify-center items-center bg-gray-100 border border-gray-200 shadow-sm shrink-0 overflow-hidden">
          <Image
            src={image || roundedImage_placeholder}
            alt={`${name}-img`}
            className="w-full h-full object-cover"
            width={48}
            height={48}
          />
        </div>
        <div className="flex flex-col gap-y-1.5 min-w-0">
          <p className="text-base font-medium text-gray-900 truncate">
            {name || "Equipment"}
          </p>
          <div className="flex flex-row items-center flex-wrap gap-2">
            {badgeLabel && (
              <Badge
                className={`font-medium shadow-none py-0 px-2 ${assetActionType[actionType]?.className || ""}`}
                variant={assetActionType[actionType]?.variant as any}
              >
                {badgeLabel}
              </Badge>
            )}
            {description && description !== name && (
              <span className="text-sm text-gray-500 truncate">
                {truncate(description, { length: 40 })}
              </span>
            )}
            {estimatedSalesPrice && (
              <span className="text-sm text-gray-600 truncate">
                Estimated sales price:{" "}
                <span className="font-medium text-gray-900">
                  {currency_symbol || ""}
                  {estimatedSalesPrice}
                </span>
              </span>
            )}
            {storageDuration && (
              <span className="text-sm text-gray-600 truncate">
                Storage duration:{" "}
                <span className="font-medium text-gray-900">
                  {storageDuration || ""} Month
                </span>
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

interface Props {
  data: Offboard_asset[];
  feeData: Record<string, any>;
}
const AssociatedDeviceList: FC<Props> = ({ data, feeData }) => {
  const { getCompanyDetails } = useAuthUserDetail();
  const company = getCompanyDetails();
  const billingSymbol = companyBillingCurrencySymbol(company);
  const searchParams = useSearchParams();
  const isDeviceRefresh = Boolean(searchParams.get("device-refresh"));
  const isEmployeeOffboarding = Boolean(
    searchParams.get("isEmployeeOffboarding"),
  );

  return (
    <Card className="p-6">
      <CardHeader className="p-0">
        <CardTitle className="text-gray-900 text-2xl font-medium">
          Equipment
        </CardTitle>
        <CardDescription className="text-gray-600 text-sm">
          All the equipment for this order
        </CardDescription>
      </CardHeader>
      <Separator className="my-5 bg-border-secondary" />
      <CardContent className="p-0 w-full flex flex-col gap-y-8">
        <div className="flex flex-col gap-y-8">
          {data?.map((item) => {
            return (
              <>
                <ItemsCard
                  image={item?.image_url || ""}
                  // @ts-ignore
                  name={[item?.title, item?.asset?.name].find(Boolean) || ""}
                  description={[
                    // @ts-ignore
                    item?.title || item?.asset?.name,
                    item?.make,
                    item?.year ? `(${item.year})` : null,
                  ]
                    .filter(Boolean)
                    .join(" ")}
                  actionType={
                    // @ts-ignore
                    item?.flowType || (item?.actionType as ActionType)
                  }
                  actionLabel={getOffboardActionLabel(
                    // @ts-ignore
                    item?.flowType || (item?.actionType as ActionType),
                    isEmployeeOffboarding,
                  )}
                  estimatedSalesPrice={item?.estimatedSalesPrice}
                  storageDuration={
                    !isDeviceRefresh ? item?.storageDuration : ""
                  }
                  currency_symbol={billingSymbol}
                />
                {/* <ItemsCard
                  image={item?.image_url || ""}
                  name={item?.title || item?.asset?.name || ""}
                  description={`${item?.title || item?.asset?.name || ""} ${item?.make || ""} ${item?.year && `(${item?.year})`}`}
                  actionType={item?.actionType as ActionType || item?.flowType}
                  estimatedSalesPrice={item?.estimatedSalesPrice}
                  storageDuration={item?.storageDuration}
                  currency_symbol={billingSymbol}
                /> */}
              </>
            );
          })}
        </div>
        {data && !isDeviceRefresh ? (
          <OrderSummary data={data} feeData={feeData} />
        ) : (
          <DeviceRefreshFeeBreakdownSummary data={data} feeData={feeData} />
        )}
      </CardContent>
    </Card>
  );
};

export default AssociatedDeviceList;
