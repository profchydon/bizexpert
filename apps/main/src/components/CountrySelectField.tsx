import React from "react";
import Autocomplete, {
  MultiSelectValue,
  SingleSelectValue,
} from "./ui/autocomplete";
import { useGetCountriesQuery } from "@/api/baseQueries/countriesApi/getCountries";
import useTransformCountriesWithETA from "@/hooks/useTransformCountriesWithETA";

interface Props {
  onChange: (value: { value: string; label: string }) => void;
  selectedOption: { value: string; label: string } | MultiSelectValue;
  isMulti?: boolean;
  placeholder?: string;
  portalInBody?: boolean;
}
const CountrySelectField: React.FC<Props> = ({
  onChange,
  selectedOption,
  isMulti = false,
  placeholder,
  portalInBody,
}) => {
  const { data: getCountries } = useGetCountriesQuery();

  const countries = getCountries?.data?.data;
  const formatCountriesWithETA = useTransformCountriesWithETA(countries);

  return (
    <Autocomplete
      options={formatCountriesWithETA}
      setSelectedOption={(value) => {
        onChange(value as any);
      }}
      isMulti={isMulti}
      selectedOption={selectedOption}
      isSearchable
      portalInBody={portalInBody}
      data-testid="countryselectfield-autocomplete"
      placeholder={placeholder || ""}
    />
  );
};

export default CountrySelectField;
