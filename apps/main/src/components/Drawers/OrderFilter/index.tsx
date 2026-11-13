import React, { FC, useEffect, useState } from "react";
import { ListFilter } from "lucide-react";
import FilterOrderDrawer from "./OrderfilterDrawer";

import { format } from "date-fns";
import { MultiSelectValue } from "@/components/ui/autocomplete";
import { Button } from "@/components/ui/button";
import {
  orderListFiltersKey,
  type OrderListFilters,
} from "@/utils/orderListFilters";

function splitFilter(value?: string) {
  return (
    value
      ?.split(",")
      .map((part) => part.trim())
      .filter(Boolean) ?? []
  );
}

function countriesFromFilter(country?: string): MultiSelectValue | null {
  const labels = splitFilter(country);
  if (!labels.length) return null;
  return labels.map((label) => ({ label, value: label }));
}

interface FilterParams {
  type?: string | null;
  status?: string | null;
  search?: string | null;
  country?: string | null;
  from?: string | null;
  to?: string | null;
  page?: number;
  per_page?: number;
}
interface Props {
  appliedFilters?: OrderListFilters;
  handleApply?: (newParams: FilterParams) => Promise<void> | void;
  reset?: () => void;
  actionBtn?: string;
  title?: string;
  description?: string;
  isExportBtn?: boolean;
  isExportLoading?: boolean;
}
const OrderFilter: FC<Props> = ({
  actionBtn,
  title,
  description,
  isExportBtn,
  isExportLoading,
  appliedFilters,
  handleApply,
  reset,
}) => {
  const [isFilterOrderOpen, setIsFilterOrderOpen] = useState(false);
  const [selectedOrderTypes, setSelectedOrderTypes] = useState<string[]>(() =>
    splitFilter(appliedFilters?.type),
  );
  const [selectedStatus, setSelectedStatus] = useState<string[]>(() =>
    splitFilter(appliedFilters?.status),
  );
  const [selectedCountries, setSelectedCountries] =
    useState<MultiSelectValue | null>(() =>
      countriesFromFilter(appliedFilters?.country),
    );
  const [dateRange, setDateRange] = useState<
    { to: string; from: string } | undefined
  >(() =>
    appliedFilters?.from || appliedFilters?.to
      ? {
          from: appliedFilters.from ?? "",
          to: appliedFilters.to ?? "",
        }
      : undefined,
  );
  const appliedKey = orderListFiltersKey(appliedFilters ?? {});

  useEffect(() => {
    if (isFilterOrderOpen) return;
    setSelectedOrderTypes(splitFilter(appliedFilters?.type));
    setSelectedStatus(splitFilter(appliedFilters?.status));
    setSelectedCountries(countriesFromFilter(appliedFilters?.country));
    setDateRange(
      appliedFilters?.from || appliedFilters?.to
        ? {
            from: appliedFilters.from ?? "",
            to: appliedFilters.to ?? "",
          }
        : undefined,
    );
  }, [appliedKey, isFilterOrderOpen]);

  const toggleFilterOrder = () => {
    setIsFilterOrderOpen(!isFilterOrderOpen);
  };

  const clearFilters = () => {
    setSelectedOrderTypes([]);
    setSelectedStatus([]);
    setSelectedCountries(null);
    setDateRange(undefined);
    reset?.();
  };

  const applyFilter = () => {
    const type = selectedOrderTypes?.join(",") || undefined;
    const status = selectedStatus?.join(",") || undefined;
    const from = dateRange?.from
      ? format(dateRange?.from as string, "yyyy-MM-dd")
      : undefined;
    const to = dateRange?.to
      ? format(dateRange?.to as string, "yyyy-MM-dd")
      : undefined;
    const country =
      selectedCountries?.map((value) => value.label).join(",") || undefined;
    const filters = {
      type: type === "" ? undefined : type,
      status: status === "" ? undefined : status,
      country: country === "" ? undefined : country,
      from,
      to,
    };
    return filters;
  };

  const handleApplyFilter = async () => {
    const appliedFilter = applyFilter();
    handleApply?.({
      ...appliedFilter,
    });
  };

  return (
    <>
      <Button
        variant={!actionBtn ? "outline" : "primary"}
        className="text-sm gap-x-2"
        onClick={toggleFilterOrder}
        disabled={isExportLoading && isExportLoading}
        data-testid="orderfilter-button"
      >
        {!actionBtn && <ListFilter size={16} />}
        <span className="text-sm font-semibold">{actionBtn || "Filter"}</span>
      </Button>
      <FilterOrderDrawer
        isOpen={isFilterOrderOpen}
        onClose={toggleFilterOrder}
        selectedOrderTypes={selectedOrderTypes!}
        selectedCountries={selectedCountries!}
        selectedStatus={selectedStatus!}
        setSelectedOrderTypes={(value) => setSelectedOrderTypes(value)}
        setSelectedCountries={(value) => setSelectedCountries(value)}
        setSelectedStatus={(value) => setSelectedStatus(value)}
        onApplyFilter={() => {
          handleApplyFilter();
          toggleFilterOrder();
        }}
        setDateRange={(value) => setDateRange(value!)}
        dateRange={dateRange!}
        onClearFilter={() => {
          clearFilters();
          toggleFilterOrder();
        }}
        title={title}
        description={description}
        isExportBtn={isExportBtn}
        isExportLoading={isExportLoading}
      />
    </>
  );
};

export default OrderFilter;
