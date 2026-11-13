import React from "react";
import ReactFlagsSelect from "react-flags-select";

interface Props {
  setSelectedCountry: (value: string) => void;
  selectedCountry: string;
}
const CountrySelect: React.FC<Props> = ({
  selectedCountry,
  setSelectedCountry,
}) => {
  return (
    <ReactFlagsSelect
      selected={selectedCountry}
      onSelect={(code) => setSelectedCountry(code)}
      searchable
      placeholder="Select country"
      selectedSize={14}
      optionsSize={14}
      selectButtonClassName="border border-gray-200 rounded-md text-sm text-gray-500"
    />
  );
};

export default CountrySelect;
