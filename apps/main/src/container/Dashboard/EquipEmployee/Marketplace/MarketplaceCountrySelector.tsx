import { useEffect, useMemo } from "react";
import Autocomplete, { SingleSelectValue } from "@/components/ui/autocomplete";
import { useGetCountriesQuery } from "@/api/baseQueries/countriesApi/getCountries";
import { useAppDispatch, useAppSelector } from "@/store";
import { setCountry } from "@/store/slices/equipEmployeeSlice";
import MarketplaceCountryTip from "./MarketplaceCountryTip";
import ReactCountryFlag from "react-country-flag";

interface CountryOption {
  id?: string;
  name?: string;
  code?: string;
  country_code?: string;
  eta?: string | null;
}

const resolveCountryCode = (country?: CountryOption) => {
  return (country?.code || country?.country_code || "").toUpperCase();
};

const getFlagIcon = (countryCode?: string, countryName?: string) => {
  if (!countryCode) {
    return null;
  }

  return (
    <ReactCountryFlag
      countryCode={countryCode}
      svg
      title={`${countryName ?? countryCode} flag`}
      style={{ width: "20px", height: "20px", borderRadius: "2px" }}
    />
  );
};

const MarketplaceCountrySelector = () => {
  const dispatch = useAppDispatch();
  const {
    equipEmployee: { country },
  } = useAppSelector((state) => state.persistedReducers);
  const { data: countriesResponse } = useGetCountriesQuery();

  const countries: CountryOption[] = countriesResponse?.data?.data ?? [];

  const selectedCountry = useMemo(
    () => countries.find((item) => item?.id === country?.id),
    [countries, country?.id],
  );

  const displayName = selectedCountry?.name ?? country?.name ?? "";
  const displayCode =
    resolveCountryCode(selectedCountry) ||
    resolveCountryCode(country) ||
    country?.code?.toUpperCase();

  useEffect(() => {
    if (!country?.id || (country.name && country.code)) {
      return;
    }

    if (!selectedCountry) {
      return;
    }

    dispatch(
      setCountry({
        id: country.id,
        name: country.name ?? selectedCountry.name,
        code: country.code ?? resolveCountryCode(selectedCountry),
        eta: country.eta ?? selectedCountry.eta,
      }),
    );
  }, [country, dispatch, selectedCountry]);

  const options = useMemo(
    () =>
      countries.map((item) => ({
        value: item?.id ?? "",
        label: item?.name ?? "",
        icon: getFlagIcon(resolveCountryCode(item), item?.name),
      })),
    [countries],
  );

  const selectedOption: SingleSelectValue = country?.id
    ? {
        value: country.id,
        label: displayName,
        icon: getFlagIcon(displayCode, displayName),
      }
    : null;

  return (
    <div className="relative">
      <MarketplaceCountryTip />
      <Autocomplete
        externalKey={`marketplace-country-${country?.id || "none"}`}
        options={options}
        selectedOption={selectedOption}
        setSelectedOption={(value) => {
          const selected = value as SingleSelectValue;

          if (!selected?.value) {
            return;
          }

          const countryToSet = countries.find(
            (item) => item?.id === selected.value,
          );

          dispatch(
            setCountry({
              id: countryToSet?.id,
              name: countryToSet?.name,
              code: countryToSet?.code,
              eta: countryToSet?.eta,
            }),
          );
        }}
        isSearchable
        isClearable={false}
        placeholder="Select country"
        data-testid="marketplacecountryselector-autocomplete"
      />
    </div>
  );
};

export default MarketplaceCountrySelector;
