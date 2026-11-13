import React, { useMemo } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { BadgeWithFlag } from "@/components/base/badges/badges";
import { FlagTypes } from "@/components/base/badges/badge-types";
import { Country } from "country-state-city";
import { Info } from "lucide-react";
import CustomTooltip from "@/components/CustomTooltip";
import { CheckoutItem } from "../hooks/useStorageCheckout";
import { formatMoney } from "../utils/storagePricing";
import { ACTION_META } from "../data/deviceActions";
import { useEmployeeDirectory } from "../support/Employees/data/employee-directory";

interface StorageCheckoutEquipmentCardProps {
  kind: "deployment" | "device_check" | "disposal";
  items: CheckoutItem[];
  getLineFee: (item: CheckoutItem) => number;
  currency: string;
}

const BADGE_COLOR: Record<string, string> = {
  deployment: "bg-primary-50 text-primary-700 border-primary-200",
  device_check: "bg-gray-100 text-gray-700 border-gray-200",
  disposal: "bg-warning-50 text-warning-700 border-warning-200",
};

const FEE_LABEL: Record<string, string> = {
  deployment: "Shipping & handling",
  device_check: "Device check fee",
  disposal: "Disposal fee",
};

export function StorageCheckoutEquipmentCard({
  kind,
  items,
  getLineFee,
  currency,
}: StorageCheckoutEquipmentCardProps) {
  const meta = ACTION_META[kind];
  const employees = useEmployeeDirectory();

  const totalFee = useMemo(() => {
    return items.reduce((acc, item) => acc + getLineFee(item), 0);
  }, [items, getLineFee]);

  const badgeClass =
    BADGE_COLOR[kind] || "bg-gray-100 text-gray-700 border-gray-200";
  const feeLabel = FEE_LABEL[kind] || "Fee";

  return (
    <Card className="p-6">
      <CardHeader className="p-0">
        <CardTitle className="text-gray-900 text-2xl font-medium">
          Equipment
        </CardTitle>
        <CardDescription className="text-gray-600 text-sm mt-1">
          All the equipment for this order
        </CardDescription>
      </CardHeader>
      <Separator className="my-5" />

      <CardContent className="p-0 w-full flex flex-col gap-y-6">
        <div className="flex flex-col gap-y-6">
          {items.map((item, index) => {
            const lineFee = getLineFee(item);

            let description = `${item.serialNumber} · ${item.country}`;
            if (kind === "deployment") {
              let empName = item.recipientName;
              let empCountry = item.recipientCountry;

              if (!empName && item.employeeId) {
                const foundEmp = employees.find(
                  (e) => e.id === item.employeeId,
                );
                if (foundEmp) {
                  empName =
                    foundEmp.name ||
                    `${(foundEmp as any).first_name || ""} ${(foundEmp as any).last_name || ""}`.trim() ||
                    foundEmp.email;
                  empCountry = empCountry || foundEmp.country;
                }
              }

              description += ` · → ${empName || "employee"}${item.wipeRequested ? " · Factory reset before ship" : ""}`;
            } else if (kind === "disposal") {
              const d =
                item.disposalMethod === "destroy"
                  ? "Certificate of destruction"
                  : item.erasureWaived
                    ? "Erasure waived · Impact Program"
                    : "Certified erasure · Impact Program";
              description += ` · ${d}`;
            } else {
              description += ` · ${item.checkNote || "Re-grade check"}`;
            }

            let resolvedCode = item.recipientCountry || item.country;
            if (
              kind === "deployment" &&
              !item.recipientCountry &&
              item.employeeId
            ) {
              const foundEmp = employees.find((e) => e.id === item.employeeId);
              if (foundEmp?.country) {
                resolvedCode = foundEmp.country;
              }
            }
            if (resolvedCode && resolvedCode.length > 2) {
              const found = Country.getAllCountries().find(
                (c) => c.name.toLowerCase() === resolvedCode.toLowerCase(),
              );
              if (found) {
                resolvedCode = found.isoCode;
              }
            }

            return (
              <React.Fragment key={item.id}>
                <div className="flex flex-row items-center justify-between">
                  <div className="flex flex-row items-center space-x-4">
                    <Avatar className="h-12 w-12 rounded-lg border border-gray-200 shadow-sm">
                      <AvatarImage
                        src={item.image || ""}
                        alt="product_img"
                        className="rounded-lg object-cover"
                      />
                      <AvatarFallback className="text-gray-600 bg-gray-50 uppercase rounded-lg">
                        {item.deviceName?.[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col gap-y-1.5">
                      <p className="text-sm font-medium text-gray-900">
                        {item.deviceName}
                      </p>
                      <div className="flex flex-row items-center gap-2">
                        <Badge
                          variant="outline"
                          className={`font-medium shadow-none py-0 px-2 rounded-full ${badgeClass}`}
                        >
                          {meta.label}
                        </Badge>
                        <span className="text-xs text-gray-500">
                          {description}
                        </span>
                        {kind === "deployment" && (
                          <BadgeWithFlag
                            type="pill-color"
                            size="sm"
                            color="gray"
                            flag={(resolvedCode || "") as FlagTypes}
                          >
                            {(() => {
                              let c = item.recipientCountry || item.country;
                              if (!item.recipientCountry && item.employeeId) {
                                const foundEmp = employees.find(
                                  (e) => e.id === item.employeeId,
                                );
                                if (foundEmp?.country) c = foundEmp.country;
                              }
                              return c;
                            })()}
                          </BadgeWithFlag>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="text-sm font-semibold text-gray-900">
                    {formatMoney(lineFee, currency)}
                  </div>
                </div>
                {index < items.length - 1 && <Separator className="my-1" />}
              </React.Fragment>
            );
          })}
        </div>

        <div className="mt-2 bg-gray-50/80 rounded-xl p-5 border border-gray-100 flex flex-col gap-4">
          <div className="flex items-center justify-between text-sm text-gray-600">
            <span>Items</span>
            <span className="font-medium">{items.length}</span>
          </div>
          <div className="flex items-center justify-between text-sm text-gray-600">
            <span>{feeLabel}</span>
            <span className="font-medium">
              {formatMoney(totalFee, currency)}
            </span>
          </div>
          <Separator className="border-gray-200" />
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-base font-semibold text-gray-900">
              Total
              <CustomTooltip content="This is the total fee for this group of actions.">
                <Info className="size-4 text-gray-400" />
              </CustomTooltip>
            </div>
            <span className="text-base font-bold text-gray-900">
              {formatMoney(totalFee, currency)}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
