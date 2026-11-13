import ReactCountryFlag from "react-country-flag";
import type { SelectItemType } from "@/components/base/select/select";
import type { ICountry } from "@/types/auth";

export function buildEmployeeCountrySelectItems(
  countries: ICountry[] = [],
): SelectItemType[] {
  return countries.map((country) => ({
    id: country.name,
    label: country.name,
    icon: (
      <ReactCountryFlag
        countryCode={country.code.toUpperCase()}
        svg
        title={`${country.name} flag`}
        style={{
          width: "20px",
          height: "20px",
          borderRadius: "9999px",
        }}
      />
    ),
  }));
}
