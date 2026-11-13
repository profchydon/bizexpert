import React, { useState } from "react";
import DrawerRight from "@/components/DrawerRight";

import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { removeUserscore } from "@/utils/underScoreTransformer";
import { MultiSelectValue } from "@/components/ui/autocomplete";
import CountrySelectField from "@/components/CountrySelectField";
import { DisabledWithTooltip } from "@/components/base/tooltip/disabled-with-tooltip";
import { getExportFilterDisabledReason } from "@/components/AllEquipments/equipmentDisabledReasons";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import dayjs from "dayjs";
import { useGetAssetTypesQuery } from "@/api/baseQueries/assetsApi/getAssetTypes";

const statuses = ["sold", "assigned", "unassigned", "in_storage"];
const purchaseType = ["Rayda", "External"];

interface Props {
  isOpen: boolean;
  onClose: () => void;
  setSelectedAssetTypes: (value: string[]) => void;
  selectedAssetTypes: string[];
  setSelectedStatus: (value: string[]) => void;
  selectedStatus: string[];
  setSelectedCountries: (value: MultiSelectValue) => void;
  selectedCountries: MultiSelectValue;
  setSelectedPurchaseType: (value: string[]) => void;
  selectedPurchaseType: string[];
  setDateRange: (value: { from: string; to: string } | undefined) => void;
  dateRange: { to: string; from: string };
  onClearFilter: () => void;
  onExportCSV: () => void;
  isExportLoading: boolean;
}

const ExportEquipmentCsvData: React.FC<Props> = ({
  isOpen,
  onClose,
  setSelectedAssetTypes,
  selectedAssetTypes,
  setSelectedCountries,
  selectedCountries,
  setSelectedStatus,
  selectedStatus,
  setSelectedPurchaseType,
  selectedPurchaseType,
  setDateRange,
  dateRange,
  onClearFilter,
  onExportCSV,
  isExportLoading,
}) => {
  const { data: assetTypesRes } = useGetAssetTypesQuery();
  const assetTypes = assetTypesRes?.data;

  const isBtnDisabled =
    selectedAssetTypes?.length === 0 &&
    selectedCountries?.length === 0 &&
    selectedStatus?.length === 0 &&
    selectedPurchaseType?.length === 0 &&
    !dateRange;

  return (
    <DrawerRight
      isOpen={isOpen}
      onClose={onClose}
      onCancel={onClose}
      drawerTitle="Export Data - Filter"
      saveText={
        <Popover>
          <PopoverTrigger>
            <DisabledWithTooltip
              isDisabled={isBtnDisabled}
              reason={getExportFilterDisabledReason(isBtnDisabled)}
            >
              <Button
                variant={"primary"}
                disabled={isBtnDisabled}
                className="text-sm"
                data-testid="exportequipmentcsvdata-button"
              >
                Export
              </Button>
            </DisabledWithTooltip>
          </PopoverTrigger>
          <PopoverContent className="w-72">
            <div className="flex flex-col gap-y-2">
              <DisabledWithTooltip
                isDisabled={isExportLoading}
                reason={isExportLoading ? "Export in progress." : null}
              >
                <Button
                  className="text-sm"
                  disabled={isExportLoading}
                  onClick={onExportCSV}
                  data-testid="exportequipmentcsvdata-button-2"
                >
                  Export as CSV
                </Button>
              </DisabledWithTooltip>
              <DisabledWithTooltip
                isDisabled
                reason="PDF export is not available yet."
                triggerClassName="block w-full"
              >
                <Button
                  disabled
                  className="text-sm w-full"
                  data-testid="exportequipmentcsvdata-button-3"
                >
                  Export as PDF
                </Button>
              </DisabledWithTooltip>
            </div>
          </PopoverContent>
        </Popover>
      }
      drawerDescription="Apply filters to export equipment data."
      addSecondaryButton={
        <div>
          <Button
            variant={"ghost"}
            onClick={onClearFilter}
            className="text-sm font-semibold text-primary-700"
            data-testid="exportequipmentcsvdata-button-4"
          >
            Clear filter
          </Button>
        </div>
      }
      data-testid="exportequipmentcsvdata-drawerright"
    >
      <div className="space-y-6">
        <div className="flex flex-col gap-y-4">
          <Label className="text-gray-900">Status</Label>

          <div className="flex flex-col gap-y-3 ml-3">
            {statuses?.map((status) => (
              <div className="flex items-center gap-x-3">
                <Checkbox
                  id="status"
                  checked={selectedStatus?.includes(status)}
                  onCheckedChange={(checked) => {
                    return checked
                      ? setSelectedStatus([...selectedStatus, status])
                      : setSelectedStatus(
                          selectedStatus.filter(
                            (value: any) => value !== status,
                          ),
                        );
                  }}
                  data-testid="exportequipmentcsvdata-checkbox"
                />
                <Label className="font-medium text-sm" htmlFor="status">
                  {removeUserscore(status)}
                </Label>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-y-4">
          <Label className="text-gray-900">Equipment type</Label>

          <div className="flex flex-col gap-y-3 ml-3">
            {assetTypes?.map((assetType) => (
              <div className="flex items-center gap-x-3">
                <Checkbox
                  id="type"
                  checked={selectedAssetTypes?.includes(assetType.name)}
                  onCheckedChange={(checked) => {
                    return checked
                      ? setSelectedAssetTypes([
                          ...selectedAssetTypes,
                          assetType.name,
                        ])
                      : setSelectedAssetTypes(
                          selectedAssetTypes.filter(
                            (value: any) => value !== assetType.name,
                          ),
                        );
                  }}
                  data-testid="exportequipmentcsvdata-checkbox-2"
                />
                <Label className="font-medium text-sm" htmlFor="type">
                  {assetType.name}
                </Label>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-y-4">
          <Label className="text-gray-900">Purchase type</Label>

          <div className="flex flex-col gap-y-3 ml-3">
            {purchaseType?.map((type) => (
              <div className="flex items-center gap-x-3">
                <Checkbox
                  id="source"
                  checked={selectedPurchaseType?.includes(type)}
                  onCheckedChange={(checked) => {
                    return checked
                      ? setSelectedPurchaseType([...selectedPurchaseType, type])
                      : setSelectedPurchaseType(
                          selectedPurchaseType.filter(
                            (value: any) => value !== type,
                          ),
                        );
                  }}
                  data-testid="exportequipmentcsvdata-checkbox-3"
                />
                <Label className="font-medium text-sm" htmlFor="source">
                  {type}
                </Label>
              </div>
            ))}
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
              isMulti
            />
          </div>
        </div>

        <div className="flex flex-col gap-y-4">
          <Label className="text-gray-900">Date</Label>

          <DateRangePicker
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

export default ExportEquipmentCsvData;
