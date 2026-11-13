import React, { useState } from "react";
import DrawerRight from "@/components/DrawerRight";

import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { MultiSelectValue } from "@/components/ui/autocomplete";
import { Button } from "@/components/ui/button";

import dayjs from "dayjs";

import CountrySelectField from "@/components/CountrySelectField";
import {
  OptionType,
  PaginatedMultiSelect,
} from "@/components/PaginatedMultiSelect";
import { ASSET_ORDER_STATUS, orderStatusMap } from "@/utils/orderStatusMap";
import { Badge } from "@/components/ui/badge";
import { OrderFlowType, orderFlowTypeCheck } from "@/types/offboarding";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const statuses = ["in_progress", "completed", "cancelled"];
const types = [
  "onboarding",
  "offboarding",
  "storage_to_employee",
  "buy_to_storage",
  "renew_storage",
  "device_refresh",
];

interface Props {
  isOpen: boolean;
  onClose: () => void;
  selectedOrderTypes: string[];
  selectedStatus: string[];
  selectedCountries: MultiSelectValue;
  dateRange: { to: string; from: string };
  title?: string;
  description?: string;
  isExportBtn?: boolean;
  isExportLoading?: boolean;

  setSelectedOrderTypes: (value: string[]) => void;
  setSelectedStatus: (value: string[]) => void;
  setSelectedCountries: (value: MultiSelectValue) => void;
  setDateRange: (value: { from: string; to: string } | undefined) => void;
  onApplyFilter: () => void;
  onClearFilter: () => void;
}

const FilterOrderDrawer: React.FC<Props> = ({
  isOpen,
  onClose,
  selectedOrderTypes,
  selectedCountries,
  selectedStatus,
  dateRange,
  title,
  description,
  isExportBtn = false,
  isExportLoading = false,
  setSelectedOrderTypes,
  setSelectedCountries,
  setSelectedStatus,
  setDateRange,
  onApplyFilter,
  onClearFilter,
}) => {
  return (
    <DrawerRight
      isOpen={isOpen}
      onClose={onClose}
      onCancel={onClose}
      onSave={!isExportBtn && (onApplyFilter as any)}
      drawerTitle={title || "Filters"}
      saveText={
        !isExportBtn ? (
          "Apply"
        ) : (
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"primary"}
                className="text-sm"
                data-testid="orderfilterdrawer-button"
              >
                Export
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-72">
              <div className="flex flex-col gap-y-2">
                <Button
                  className="text-sm"
                  disabled={isExportLoading}
                  onClick={onApplyFilter}
                  data-testid="orderfilterdrawer-button-2"
                >
                  Export as CSV
                </Button>
              </div>
            </PopoverContent>
          </Popover>
        )
      }
      drawerDescription={description || "Apply filters to table data.."}
      addSecondaryButton={
        <div>
          <Button
            variant={"ghost"}
            onClick={onClearFilter}
            className="text-sm font-semibold text-primary-700"
            data-testid="orderfilterdrawer-button-3"
          >
            Clear filter
          </Button>
        </div>
      }
      data-testid="orderfilterdrawer-drawerright"
    >
      <div className="space-y-6">
        <div className="flex flex-col gap-y-4">
          <Label className="text-gray-900">Order status</Label>
          <div className="flex flex-col gap-y-3 ml-3">
            {statuses?.map((status) => {
              const getStatus = status as ASSET_ORDER_STATUS;
              return (
                <div key={status} className="flex items-center gap-x-3">
                  <Checkbox
                    id={getStatus}
                    checked={selectedStatus?.includes(getStatus)}
                    onCheckedChange={(checked) => {
                      return checked
                        ? setSelectedStatus([...selectedStatus, getStatus])
                        : setSelectedStatus(
                            selectedStatus.filter(
                              (value: any) => value !== getStatus,
                            ),
                          );
                    }}
                    data-testid="orderfilterdrawer-checkbox"
                  />
                  {orderStatusMap?.[getStatus]?.label && (
                    <div className="w-fit">
                      <Badge
                        className={orderStatusMap[getStatus]?.className}
                        variant={orderStatusMap[getStatus]?.variant as any}
                      >
                        {orderStatusMap[getStatus]?.icon}
                        {orderStatusMap[getStatus]?.label}
                      </Badge>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
        <div className="flex flex-col gap-y-4">
          <Label className="text-gray-900">Type</Label>
          <div className="flex flex-col gap-y-3 ml-3">
            {types?.map((order) => {
              const getOrder = order as OrderFlowType;
              return (
                <div key={order} className="flex items-center gap-x-3">
                  <Checkbox
                    id={getOrder}
                    checked={selectedOrderTypes?.includes(getOrder)}
                    onCheckedChange={(checked) => {
                      return checked
                        ? setSelectedOrderTypes([
                            ...selectedOrderTypes,
                            getOrder,
                          ])
                        : setSelectedOrderTypes(
                            selectedOrderTypes.filter(
                              (value: any) => value !== getOrder,
                            ),
                          );
                    }}
                    data-testid="orderfilterdrawer-checkbox-2"
                  />
                  {orderFlowTypeCheck[getOrder]?.label && (
                    <div className="w-fit">
                      <Badge
                        className={orderFlowTypeCheck[getOrder]?.className}
                        variant={orderFlowTypeCheck[getOrder]?.variant as any}
                      >
                        {orderFlowTypeCheck[getOrder]?.label}
                      </Badge>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className="flex flex-col gap-y-4">
          <Label className="text-gray-900">Country</Label>
          <div className="flex flex-col gap-y-3">
            <CountrySelectField
              onChange={(value: any) =>
                setSelectedCountries(value as MultiSelectValue)
              }
              selectedOption={selectedCountries as MultiSelectValue}
              placeholder={"Select country"}
              isMulti
            />
          </div>
        </div>

        <div className="flex flex-col gap-y-4">
          <Label className="text-gray-900">Date</Label>

          <DateRangePicker
            showCompare={false}
            initialDateTo={new Date()}
            initialDateFrom={new Date()}
            onReset={() => setDateRange(undefined)}
            onUpdate={({ range }) => {
              setDateRange({
                from: dayjs(range.from).format("MMM DD, YYYY"),
                to: dayjs(range.to).format("MMM DD, YYYY"),
              });
            }}
          />
        </div>
      </div>
    </DrawerRight>
  );
};

export default FilterOrderDrawer;
