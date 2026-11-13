"use client";

import ReactCountryFlag from "react-country-flag";
import Loader from "@/components/Loader";
import { Checkbox } from "@/components/base/checkbox/checkbox";
import type { SelectItemType } from "@/components/base/select/select";
import { useGetAssetTypesQuery } from "@/api/baseQueries/assetsApi/getAssetTypes";
import { useGetCountriesQuery } from "@/api/baseQueries/countriesApi/getCountries";
import { removeUserscore } from "@/utils/underScoreTransformer";
import type { EquipmentFilterValues } from "./equipmentFilterOptions";
import {
  EQUIPMENT_FILTER_STATUSES,
  EQUIPMENT_RAM_ITEMS,
  EQUIPMENT_STORAGE_ITEMS,
} from "./equipmentFilterOptions";
import { EquipmentFilterMultiField } from "./EquipmentFilterMultiField";

type Props = {
  draft: EquipmentFilterValues;
  onChange: (patch: Partial<EquipmentFilterValues>) => void;
};

const toggleValue = (values: string[], value: string, checked: boolean) =>
  checked ? [...values, value] : values.filter((entry) => entry !== value);

const buildCountryItems = (
  countries: { id: string; name: string; code: string }[] = [],
): SelectItemType[] =>
  countries.map((country) => ({
    id: country.id,
    label: country.name,
    icon: (
      <ReactCountryFlag
        countryCode={country.code.toUpperCase()}
        svg
        title={`${country.name} flag`}
        style={{ width: "20px", height: "20px", borderRadius: "9999px" }}
      />
    ),
  }));

export function EquipmentFilterFields({ draft, onChange }: Props) {
  const {
    data: assetTypesRes,
    isLoading: assetTypesLoading,
    isFetching: assetTypesFetching,
  } = useGetAssetTypesQuery();
  const {
    data: countriesRes,
    isLoading: countriesLoading,
    isFetching: countriesFetching,
  } = useGetCountriesQuery();
  const assetTypes = assetTypesRes?.data ?? [];
  const countryItems = buildCountryItems(countriesRes?.data?.data);
  const isLoading =
    assetTypesLoading ||
    assetTypesFetching ||
    countriesLoading ||
    countriesFetching;

  if (isLoading) {
    return (
      <div className="flex min-h-48 items-center justify-center py-10">
        <Loader />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3">
        <span className="text-sm font-medium text-secondary">
          Equipment type
        </span>
        <div className="flex flex-col gap-3 pl-3">
          {assetTypes.map((assetType) => (
            <Checkbox
              key={assetType.id}
              size="sm"
              label={assetType.name}
              isSelected={draft.selectedAssetTypes.includes(assetType.name)}
              onChange={(checked) =>
                onChange({
                  selectedAssetTypes: toggleValue(
                    draft.selectedAssetTypes,
                    assetType.name,
                    checked,
                  ),
                })
              }
              data-testid="equipmentfilterfields-checkbox"
            />
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <span className="text-sm font-medium text-secondary">Status</span>
        <div className="flex flex-col gap-3 pl-3">
          {EQUIPMENT_FILTER_STATUSES.map((status) => (
            <Checkbox
              key={status}
              size="sm"
              label={removeUserscore(status)}
              isSelected={draft.selectedStatus.includes(status)}
              onChange={(checked) =>
                onChange({
                  selectedStatus: toggleValue(
                    draft.selectedStatus,
                    status,
                    checked,
                  ),
                })
              }
              data-testid="equipmentfilterfields-checkbox-2"
            />
          ))}
        </div>
      </div>

      <EquipmentFilterMultiField
        label="RAM"
        placeholder="Search RAM"
        items={EQUIPMENT_RAM_ITEMS}
        selected={draft.selectedRam}
        onChange={(next) => onChange({ selectedRam: next })}
      />

      <EquipmentFilterMultiField
        label="Storage"
        placeholder="Search storage"
        items={EQUIPMENT_STORAGE_ITEMS}
        selected={draft.selectedStorage}
        onChange={(next) => onChange({ selectedStorage: next })}
      />

      <EquipmentFilterMultiField
        label="Country"
        placeholder="Search country"
        items={countryItems}
        selected={draft.selectedCountries}
        onChange={(next) => onChange({ selectedCountries: next })}
      />
    </div>
  );
}
