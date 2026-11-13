type CountryInfo = {
  name: string;
  code: string;
};

export const getUniqueCountries = (
  defaultCountry: CountryInfo = { name: "Default Country", code: "XX" },
): CountryInfo[] => {
  const countrySet = new Map<string, CountryInfo>();

  if (defaultCountry.name && defaultCountry.code) {
    const uniqueKey = `${defaultCountry.name}-${defaultCountry.code}`;
    countrySet.set(uniqueKey, defaultCountry);
  }

  return Array.from(countrySet.values());
};
