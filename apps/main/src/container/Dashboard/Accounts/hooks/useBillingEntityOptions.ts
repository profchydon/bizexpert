"use client";

import { useGetCountriesQuery } from "@/api/baseQueries/countriesApi/getCountries";
import { useMemo } from "react";
import { mapEntityToSubsidiary } from "@/api/baseQueries/companiesApi/entitiesApi/mapEntityToSubsidiary";
import { mapCountriesToWizardOptions } from "../utils/mapCountriesToWizardOptions";
import { filterEntitiesByCountry } from "../utils/filterEntitiesByCountry";
import {
  billingEntityOptionById,
  mapBillingEntityOptions,
  type BillingEntityOption,
} from "../utils/mapBillingEntityOptions";
import { useAccountsEntitiesQuery } from "./useAccountsData";

export type { BillingEntityOption };
export { billingEntityOptionById, mapBillingEntityOptions };

export type UseBillingEntityOptionsConfig = {
  country?: string | null;
  filterByCountry?: boolean;
};

export function useBillingEntityOptions(
  config: UseBillingEntityOptionsConfig = {},
) {
  const { country = null, filterByCountry = false } = config;
  const entitiesQuery = useAccountsEntitiesQuery();
  const countriesQuery = useGetCountriesQuery();
  const requiresCountry = filterByCountry && !country?.trim();

  const countryCode = useMemo(() => {
    if (!country?.trim()) return null;
    const options = mapCountriesToWizardOptions(
      countriesQuery.data?.data?.data,
    );
    return options.find((option) => option.value === country)?.code ?? null;
  }, [country, countriesQuery.data]);

  const options = useMemo(() => {
    const entities = (entitiesQuery.data?.data?.data ?? []).map(
      mapEntityToSubsidiary,
    );
    const scoped = filterByCountry
      ? filterEntitiesByCountry(entities, country, countryCode)
      : entities;
    return mapBillingEntityOptions(scoped);
  }, [country, countryCode, entitiesQuery.data, filterByCountry]);

  return {
    options,
    isLoading:
      entitiesQuery.isLoading ||
      entitiesQuery.isFetching ||
      countriesQuery.isLoading,
    isError: entitiesQuery.isError,
    requiresCountry,
  };
}
