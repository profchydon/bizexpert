import React, { useMemo, useState } from "react";
import { useWorkspaceCompanyId } from "@/hooks/useWorkspaceCompanyId";
import CountriesTableData from "./tableData";
import routes from "@/routes";
import { useGetCountriesQuery } from "@/api/baseQueries/countriesApi/getCountries";
import { useGetEquipmentSummaryQuery } from "@/api/baseQueries/companiesApi/assetRefreshApi/getEquipmentSummary";
import { extractEquipmentSummaryPage } from "./equipmentSummaryPage";
import { isQueryResultPending } from "@/utils/isQueryResultPending";
import { useTransitionRouter } from "@/hooks/useTransitionRouter";

const CountriesTable = () => {
  const companyId = useWorkspaceCompanyId();
  const { push, isPending: isNavigatePending } = useTransitionRouter();
  const [navigatingCountryId, setNavigatingCountryId] = useState<string | null>(
    null,
  );

  const { data: getCountries } = useGetCountriesQuery();
  const getCountriesData = getCountries?.data?.data;

  const {
    data: equipmentSummaryRes,
    isLoading,
    isFetching,
    isError,
    isUninitialized,
  } = useGetEquipmentSummaryQuery(
    { companyId: companyId! },
    { skip: !companyId },
  );

  const { countries } = useMemo(
    () => extractEquipmentSummaryPage(equipmentSummaryRes?.data),
    [equipmentSummaryRes?.data],
  );

  const isPending = isQueryResultPending({
    isUninitialized,
    isLoading,
    isFetching,
    hasRows: countries.length > 0,
  });

  const findCountry = (id: string) =>
    getCountriesData?.find((country: { id: string }) => country.id === id);

  const handleCountrySelect = (country_id: string) => {
    const country = findCountry(country_id);
    const countryId = country?.id as string;
    const countryName = country?.name as string;

    setNavigatingCountryId(country_id);
    push(
      `${routes.ASSET_VAULT}?ci=${countryId}&cn=${countryName}&isEquipment=true&device-refresh=true`,
    );
  };

  const isViewLoading = (countryId?: string) =>
    Boolean(
      isNavigatePending && countryId && navigatingCountryId === countryId,
    );

  return (
    <CountriesTableData
      countries={countries}
      isPending={isPending}
      isError={isError}
      handleViewBtn={handleCountrySelect}
      isViewLoading={isViewLoading}
    />
  );
};

export default CountriesTable;
