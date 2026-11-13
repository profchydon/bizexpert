import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import type { ICart } from "@/types/cart";
import type { IEmployees } from "@/types/employees";
import { useSearchParams } from "next/navigation";
import React, { FC } from "react";
import OrderItemsFeeSummary from "./OrderItemsFeeSummary";
import { useAppSelector } from "@/store";
import { Country } from "country-state-city";
import { OrderSummaryEquipmentCard } from "./OrderSummaryEquipmentCard";
import type { OrderFeeSummary } from "./orderFeeSummary";
import {
  orderSummaryActionType,
  orderSummaryFulfilmentLabel,
  orderSummaryItemDescription,
} from "./orderSummaryCartItemView";

interface Props {
  data?: ICart[];
  employee?: IEmployees;
  itemFeeSummary?: OrderFeeSummary;
  itemFeeTotal?: number;
  isStorageOnlyFlow?: boolean;
  skipFeeQuery?: boolean;
}

const AssociatedDeviceList: FC<Props> = ({
  data,
  employee,
  itemFeeSummary,
  itemFeeTotal,
  isStorageOnlyFlow = false,
  skipFeeQuery = false,
}) => {
  const param = useSearchParams();
  const catalogId = param.get("catalogId") ?? undefined;
  const selectedCountry = useAppSelector(
    (state) => state.persistedReducers.equipEmployee.country,
  );

  const expandedItems = data?.flatMap((item) =>
    Array.from({ length: item.quantity }, (_, index) => ({
      ...item,
      itemId: `${item.pricing?.id ?? item.equipmentId}-${index + 1}`,
    })),
  );

  return (
    <Card className="min-w-0 overflow-hidden p-6">
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
          {expandedItems?.map((item) => {
            const itemCountry = item?.country;
            let resolvedCode = itemCountry?.code?.toUpperCase();

            if (!resolvedCode && (itemCountry?.name || itemCountry?.label)) {
              const nameToFind = itemCountry?.name || itemCountry?.label;
              if (typeof nameToFind === "string") {
                const found = Country.getAllCountries().find(
                  (country) =>
                    country.name.toLowerCase() === nameToFind.toLowerCase(),
                );
                if (found) resolvedCode = found.isoCode;
              }
            }

            const countryCode =
              resolvedCode || selectedCountry?.code?.toUpperCase();
            const countryLabel =
              itemCountry?.label || itemCountry?.name || selectedCountry?.name;

            return (
              <React.Fragment key={item.itemId || item.pricing?.id}>
                <OrderSummaryEquipmentCard
                  image={
                    (Array.isArray(item?.images)
                      ? item?.images?.[0]
                      : item?.images) || ""
                  }
                  name={item?.asset?.name}
                  description={orderSummaryItemDescription(
                    item,
                    countryLabel,
                    employee,
                    catalogId,
                  )}
                  storageDuration={item?.storageDuration}
                  isStorage={
                    item?.source === "STORAGE" || Boolean(item?.storage)
                  }
                  countryCode={countryCode}
                  countryLabel={countryLabel}
                  actionType={orderSummaryActionType(item)}
                  fulfilmentLabel={orderSummaryFulfilmentLabel(
                    item.fulfillment_date,
                  )}
                />
                <Separator className="my-3 last:hidden" />
              </React.Fragment>
            );
          })}
        </div>
        {!catalogId && (
          <OrderItemsFeeSummary
            employee={employee}
            buyToStorage={isStorageOnlyFlow}
            feeSummary={itemFeeSummary}
            skipFeeQuery={skipFeeQuery}
            totalItems={itemFeeTotal ?? expandedItems?.length}
          />
        )}
      </CardContent>
    </Card>
  );
};

export default AssociatedDeviceList;
