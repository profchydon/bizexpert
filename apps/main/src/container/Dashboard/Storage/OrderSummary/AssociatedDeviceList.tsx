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
import { useAppSelector } from "@/store";
import { ICart } from "@/types/cart";
import { IEmployees } from "@/types/employees";
import { useSearchParams } from "next/navigation";
import React, { FC } from "react";
import OrderItemsFeeSummary from "./OrderItemsFeeSummary";
import { IEquipmentsInStorageByCountry } from "@/types/equipments";

import { BadgeWithFlag } from "@/components/base/badges/badges";
import { FlagTypes } from "@/components/base/badges/badge-types";
import { Country } from "country-state-city";

interface ItemsCardProps {
  image: string;
  name: string;
  description: string;
  actionType?: string;
  countryCode?: string;
  countryLabel?: string;
}

const ItemsCard: FC<ItemsCardProps> = ({
  image,
  name,
  description,
  actionType,
  countryCode,
  countryLabel,
}) => {
  const getBadgeVariant = () => {
    if (
      actionType === "dispose" ||
      actionType === "Dispose" ||
      actionType === "archive" ||
      actionType === "Archive" ||
      actionType === "Disposal"
    )
      return "pending";
    if (
      actionType === "device_check" ||
      actionType === "Device check" ||
      actionType === "device check"
    )
      return "gray";
    if (
      actionType === "deploy" ||
      actionType === "Deploy" ||
      actionType === "deployment" ||
      actionType === "Deploy from storage"
    )
      return "blue";
    return "blue";
  };

  const getBadgeLabel = () => {
    if (actionType) {
      if (
        actionType.toLowerCase() === "archive" ||
        actionType.toLowerCase() === "disposal" ||
        actionType.toLowerCase() === "dispose"
      )
        return "Dispose";
      if (
        actionType.toLowerCase() === "device_check" ||
        actionType.toLowerCase() === "device check"
      )
        return "Device check";
      if (
        actionType.toLowerCase() === "deploy" ||
        actionType.toLowerCase() === "deployment" ||
        actionType.toLowerCase() === "deploy from storage"
      )
        return "Deploy";
      return (
        actionType.charAt(0).toUpperCase() + actionType.slice(1).toLowerCase()
      );
    }
    return "Onboard";
  };

  return (
    <div className="flex flex-row items-center justify-between py-2">
      <div className="flex flex-row items-center space-x-4 min-w-0 flex-1">
        <Avatar className="h-12 w-12 rounded-lg border border-gray-200 shadow-sm shrink-0">
          <AvatarImage
            src={image || ""}
            alt="product_img"
            className="rounded-lg object-cover"
          />
          <AvatarFallback className="text-gray-600 bg-gray-50 uppercase rounded-lg">{`${name?.[0] || ""}`}</AvatarFallback>
        </Avatar>
        <div className="flex flex-col gap-y-1.5 min-w-0">
          <p className="text-base font-medium text-gray-900 truncate">
            {name || "Equipment"}
          </p>
          <div className="flex flex-row items-center flex-wrap gap-2">
            <Badge
              className="font-medium shadow-none py-0 px-2"
              variant={getBadgeVariant() as any}
            >
              {getBadgeLabel()}
            </Badge>
            {description && description !== name && (
              <span className="text-sm text-gray-500 truncate">
                {description}
              </span>
            )}
            {actionType?.toLowerCase() === "deploy" ||
            actionType?.toLowerCase() === "deploy from storage" ||
            actionType?.toLowerCase() === "deployment" ? (
              <BadgeWithFlag
                type="pill-color"
                size="sm"
                color="gray"
                flag={(countryCode || "") as FlagTypes}
              >
                {countryLabel}
              </BadgeWithFlag>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
};

interface Props {
  data?: IEquipmentsInStorageByCountry[];
  employee?: IEmployees;
}
const AssociatedDeviceList: FC<Props> = ({ data, employee }) => {
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
      <Separator className="my-5" />

      <CardContent className="p-0 w-full flex flex-col gap-y-8">
        <div className="flex flex-col gap-y-8">
          {data?.map((item) => {
            const actionType =
              item?.actionType ||
              (item?.title?.toLowerCase().includes("dispose")
                ? "Dispose"
                : item?.title?.toLowerCase().includes("device check")
                  ? "Device check"
                  : item?.title?.toLowerCase().includes("deploy")
                    ? "Deploy"
                    : undefined);

            let description =
              item?.title
                ?.replace(/dispose/i, "")
                ?.replace(/device check/i, "")
                ?.replace(/deploy from storage/i, "")
                ?.replace(/deploy/i, "")
                ?.trim()
                ?.replace(/^[-·\s]+/, "")
                ?.trim() || item?.title;

            if (
              (actionType === "deploy" ||
                actionType === "Deploy" ||
                actionType === "deployment" ||
                actionType === "Deploy from storage") &&
              employee
            ) {
              const employeeName =
                (employee as any).name ||
                `${employee.first_name || ""} ${employee.last_name || ""}`.trim() ||
                employee.email ||
                employee.personal_email;
              description += ` · → ${employeeName || "employee"}`;
            }

            const itemCountry =
              item?.country || employee?.country || employee?.country_code;
            let resolvedCode = itemCountry;

            if (itemCountry) {
              const found = Country.getAllCountries().find(
                (c) =>
                  c.name.toLowerCase() === itemCountry.toLowerCase() ||
                  c.isoCode.toLowerCase() === itemCountry.toLowerCase(),
              );
              if (found) {
                resolvedCode = found.isoCode;
              }
            }

            return (
              <React.Fragment key={item?.id}>
                <ItemsCard
                  image={item?.image_url || ""}
                  name={item?.title}
                  description={description}
                  actionType={actionType}
                  countryCode={resolvedCode}
                  countryLabel={itemCountry}
                />

                <Separator className="my-3 last:hidden" />
              </React.Fragment>
            );
          })}
        </div>
        <OrderItemsFeeSummary employee={employee} totalItems={data?.length} />
      </CardContent>
    </Card>
  );
};

export default AssociatedDeviceList;
