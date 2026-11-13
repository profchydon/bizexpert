import { useEffect, useState } from "react";
import { Filter } from "lucide-react";
import type {
  FilterAssetTypeOption,
  FilterCountryOption,
  RequestFilters,
} from "../types";
import { toggleSelectedValue } from "../utils";
import BudgetRangeSection from "./BudgetRangeSection";
import CountryFlag from "./CountryFlag";
import FilterChip from "./FilterChip";

interface FilterDropdownProps {
  assetTypes: FilterAssetTypeOption[];
  budgetRangeLimits: [number, number];
  countries: FilterCountryOption[];
  isOpen: boolean;
  onClose: () => void;
  filters: RequestFilters;
  onApply: (filters: RequestFilters) => void;
}

export default function FilterDropdown({
  assetTypes,
  budgetRangeLimits,
  countries,
  isOpen,
  onClose,
  filters,
  onApply,
}: Readonly<FilterDropdownProps>) {
  const [localFilters, setLocalFilters] = useState<RequestFilters>(filters);

  const getResetFilters = (): RequestFilters => ({
    countries: [],
    assetTypes: [],
    budgetRange: budgetRangeLimits,
  });

  useEffect(() => {
    if (isOpen) {
      setLocalFilters(filters);
    }
  }, [filters, isOpen]);

  if (!isOpen) return null;

  const handleReset = () => {
    const resetFilters = getResetFilters();
    setLocalFilters(resetFilters);
    onApply(resetFilters);
  };

  const handleApply = () => {
    onApply(localFilters);
    onClose();
  };

  const toggleCountry = (countryId: string) => {
    setLocalFilters((previous) => ({
      ...previous,
      countries: toggleSelectedValue(previous.countries, countryId),
    }));
  };

  const toggleAssetType = (assetType: string) => {
    setLocalFilters((previous) => ({
      ...previous,
      assetTypes: toggleSelectedValue(previous.assetTypes, assetType),
    }));
  };

  return (
    <div>
      <button
        type="button"
        className="fixed inset-0 z-40 cursor-default"
        onClick={onClose}
      >
        <span className="sr-only">Close filter dropdown</span>
      </button>

      <div className="absolute right-0 top-full z-50 mt-2 w-[340px] rounded-xl border border-gray-200 bg-white shadow-lg">
        <div className="flex items-center justify-between border-b border-gray-200 px-5 py-3">
          <h3 className="text-base font-semibold text-gray-900">
            Filter Requests
          </h3>
          <button
            type="button"
            onClick={handleReset}
            className="text-sm font-semibold text-primary-700 hover:text-primary-800"
          >
            Reset
          </button>
        </div>

        <div className="flex max-h-[70vh] flex-col gap-5 overflow-y-auto p-5">
          <div className="flex flex-col gap-2.5">
            <span className="text-sm font-semibold text-gray-700">Country</span>
            <div className="flex flex-wrap gap-2">
              {countries.map((country) => (
                <FilterChip
                  key={country.id}
                  label={country.name}
                  leading={
                    <CountryFlag country={country.name} code={country.code} />
                  }
                  isSelected={localFilters.countries.includes(country.id)}
                  onClick={() => toggleCountry(country.id)}
                />
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-2.5">
            <span className="text-sm font-semibold text-gray-700">
              Asset Type
            </span>
            <div className="flex flex-wrap gap-2">
              {assetTypes.map((assetType) => (
                <FilterChip
                  key={assetType.value}
                  label={assetType.label}
                  isSelected={localFilters.assetTypes.includes(assetType.value)}
                  onClick={() => toggleAssetType(assetType.value)}
                />
              ))}
            </div>
          </div>

          <BudgetRangeSection
            budgetRange={localFilters.budgetRange}
            min={budgetRangeLimits[0]}
            max={budgetRangeLimits[1]}
            onChange={(budgetRange) =>
              setLocalFilters((previous) => ({ ...previous, budgetRange }))
            }
          />
        </div>

        <div className="flex gap-2 border-t border-gray-200 px-5 py-3">
          <button
            type="button"
            onClick={handleReset}
            className="h-10 flex-1 rounded-md border border-gray-200 bg-white text-sm font-semibold text-gray-700 hover:bg-gray-50"
          >
            Clear
          </button>

          <button
            type="button"
            onClick={handleApply}
            className="h-10 flex-1 rounded-md bg-primary-700 px-3 text-sm font-semibold text-white hover:bg-primary-800"
          >
            <span className="inline-flex items-center gap-2">
              <Filter className="size-4" />
              Apply Filter
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
