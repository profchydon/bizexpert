import React, { FC, useMemo, useState } from "react";
import { useTablePageQuery } from "@/hooks/useTablePageQuery";
import { Card, CardContent } from "@/components/ui/card";
import PageState from "@/components/PageState";
import { DataTable } from "@/components/ui/data-table";
import CountriesEmptyTable from "./CountriesEmptyTable";
import CountriesSearchToolbar from "./CountriesSearchToolbar";
import CountriesTableActions from "./CountriesTableActions";
import CountriesTableColumn from "./CountriesTableColumn";
import {
  DeviceRefreshCountryRow,
  filterDeviceRefreshCountries,
} from "./filterDeviceRefreshCountries";
import { paginateClientPage } from "./paginateClientPage";

interface Props {
  countries: DeviceRefreshCountryRow[];
  isPending: boolean;
  isError: boolean;
  handleViewBtn: (value: string) => void;
  isViewLoading: (countryId?: string) => boolean;
}

const CountriesTableData: FC<Props> = ({
  countries,
  isPending,
  isError,
  handleViewBtn,
  isViewLoading,
}) => {
  const [search, setSearch] = useState("");
  const { page: currentPage, setPage: setCurrentPage } =
    useTablePageQuery("countries_page");

  const filteredCountries = useMemo(
    () => filterDeviceRefreshCountries(countries, search),
    [countries, search],
  );

  const {
    items: pagedCountries,
    currentPage: page,
    lastPage,
  } = useMemo(
    () => paginateClientPage(filteredCountries, currentPage),
    [filteredCountries, currentPage],
  );

  const columns = useMemo(
    () =>
      CountriesTableColumn((item) => (
        <CountriesTableActions
          onView={() => {
            handleViewBtn(item?.country_id as string);
          }}
          isLoading={isViewLoading(item?.country_id)}
        />
      )),
    [handleViewBtn, isViewLoading],
  );

  const hasSearch = search.trim().length > 0;
  const showSearchEmpty =
    !isPending && hasSearch && filteredCountries.length === 0;
  const showEmpty = !isPending && !hasSearch && filteredCountries.length === 0;

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setCurrentPage(1);
  };

  return (
    <Card className="mt-2">
      <PageState isLoading={isPending} isError={isError}>
        <CountriesSearchToolbar
          count={filteredCountries.length}
          search={search}
          onSearchChange={handleSearchChange}
        />
        <CardContent className="px-0 pb-2 pt-0">
          <DataTable
            data={pagedCountries}
            columns={columns}
            pagination={{
              currentPage: page,
              lastPage,
              onPageChange: setCurrentPage,
            }}
          >
            {showSearchEmpty ? (
              <CountriesEmptyTable
                title="No countries found"
                description="Try a different country name or code."
              />
            ) : showEmpty ? (
              <CountriesEmptyTable />
            ) : null}
          </DataTable>
        </CardContent>
      </PageState>
    </Card>
  );
};

export default CountriesTableData;
