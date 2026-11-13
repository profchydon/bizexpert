import React, { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getInitials } from "@/utils/getInitials";
import { useEquipDisplayCurrency } from "../OnboardDevices/useEquipDisplayCurrency";
import {
  calculateRunningTotal,
  formatCurrency,
} from "../OnboardDevices/equipItems";
import type { EquipReviewEmployee } from "../OnboardDevices/equipTypes";
import OnboardSummaryDeviceRow, {
  SUMMARY_COLUMN_TEMPLATE,
} from "./OnboardSummaryDeviceRow";

const HEAD_LABELS = [
  "Device",
  "Source & config",
  "Fulfilment date",
  "Qty",
  "Unit Price",
  "Line Total",
];

interface Props {
  employee: EquipReviewEmployee;
  onEdit: () => void;
}

const OnboardSummaryEmployeeCard: React.FC<Props> = ({ employee, onEdit }) => {
  const [open, setOpen] = useState(true);
  const { total, hasPending } = calculateRunningTotal(employee.devices);
  const currency = useEquipDisplayCurrency(employee.devices);
  const deviceCount = employee.devices.length;
  const subtitle = [employee.role, employee.country]
    .filter(Boolean)
    .join(" · ");

  return (
    <Card className="overflow-hidden">
      <div
        role="button"
        tabIndex={0}
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            setOpen((value) => !value);
          }
        }}
        className="flex w-full flex-wrap items-center justify-between gap-4 px-6 py-4 text-left outline-none transition hover:bg-gray-50 focus-visible:bg-gray-50"
      >
        <div className="flex min-w-0 items-center gap-3">
          <Avatar className="h-10 w-10">
            <AvatarFallback className="bg-gray-100 text-gray-600">
              {getInitials(employee.name)}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-gray-900">
              {employee.name}
            </p>
            {subtitle && (
              <p className="truncate text-xs text-gray-500">{subtitle}</p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-lg font-semibold tabular-nums text-gray-900">
            {formatCurrency(total, currency)}
            {hasPending && (
              <span className="ml-1 text-sm font-normal text-gray-500">
                + pending
              </span>
            )}
          </span>
          <span aria-hidden className="p-1 text-gray-400">
            {open ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </span>
          <Badge variant="gray" className="rounded-full">
            {deviceCount} device{deviceCount === 1 ? "" : "s"}
          </Badge>
          <Button
            type="button"
            variant="outline"
            className="h-9 px-4 text-sm font-semibold text-gray-700"
            onClick={(event) => {
              event.stopPropagation();
              onEdit();
            }}
            data-testid="onboardsummaryemployeecard-button"
          >
            Edit
          </Button>
        </div>
      </div>

      {open && deviceCount > 0 && (
        <div className="overflow-x-auto">
          <div className="min-w-[820px]">
            <div
              className="grid items-center gap-x-6 border-y border-gray-100 bg-gray-50 px-6 py-2.5"
              style={{ gridTemplateColumns: SUMMARY_COLUMN_TEMPLATE }}
            >
              {HEAD_LABELS.map((label) => (
                <div
                  key={label}
                  className="text-xs font-semibold text-gray-500"
                >
                  {label}
                </div>
              ))}
            </div>
            {employee.devices.map((item) => (
              <OnboardSummaryDeviceRow key={item.lineId} item={item} />
            ))}
          </div>
        </div>
      )}

      {open && deviceCount === 0 && (
        <div className="border-t border-gray-100 px-6 py-6 text-center text-sm text-gray-500">
          No devices selected for this employee.
        </div>
      )}
    </Card>
  );
};

export default OnboardSummaryEmployeeCard;
