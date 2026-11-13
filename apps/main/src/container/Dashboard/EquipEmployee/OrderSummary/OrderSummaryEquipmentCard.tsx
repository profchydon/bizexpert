"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { BadgeWithFlag } from "@/components/base/badges/badges";
import { toBadgeFlag } from "@/components/base/badges/toBadgeFlag";
import {
  equipmentBadgeLabel,
  equipmentBadgeVariant,
} from "./orderSummaryEquipmentBadge";

interface OrderSummaryEquipmentCardProps {
  image: string;
  name: string;
  description: string;
  storageDuration?: string;
  isStorage?: boolean;
  countryCode?: string;
  countryLabel?: string;
  actionType?: string;
  fulfilmentLabel?: string | null;
}

export function OrderSummaryEquipmentCard({
  image,
  name,
  description,
  storageDuration,
  isStorage,
  countryCode,
  countryLabel,
  actionType,
  fulfilmentLabel,
}: Readonly<OrderSummaryEquipmentCardProps>) {
  const flag = toBadgeFlag(countryCode);

  return (
    <div className="flex w-full min-w-0 flex-row items-start justify-between py-2">
      <div className="flex min-w-0 flex-1 flex-row items-start space-x-4">
        <Avatar className="h-12 w-12 shrink-0 rounded-lg border border-gray-200 shadow-sm">
          <AvatarImage
            src={image || ""}
            alt="product_img"
            className="rounded-lg object-cover"
          />
          <AvatarFallback className="rounded-lg bg-gray-50 uppercase text-gray-600">
            {name?.[0] || ""}
          </AvatarFallback>
        </Avatar>
        <div className="flex min-w-0 flex-1 flex-col gap-y-1.5">
          <p className="break-words text-base font-medium text-gray-900">
            {name || "Equipment"}
          </p>
          {description && description !== name && (
            <p className="break-words text-sm text-gray-500">{description}</p>
          )}
          <div className="flex flex-row flex-wrap items-center gap-2">
            {!storageDuration && (
              <Badge
                className="px-2 py-0 font-medium shadow-none"
                variant={equipmentBadgeVariant(actionType, isStorage)}
              >
                {equipmentBadgeLabel(actionType, isStorage)}
              </Badge>
            )}
            {flag && countryLabel && (
              <BadgeWithFlag
                type="pill-color"
                size="sm"
                color="gray"
                flag={flag}
              >
                {countryLabel}
              </BadgeWithFlag>
            )}
          </div>
          {fulfilmentLabel && (
            <p className="text-sm text-gray-700">{fulfilmentLabel}</p>
          )}
        </div>
      </div>
    </div>
  );
}
