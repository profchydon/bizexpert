import { countryCodeMap } from "../constants";

interface CountryFlagProps {
  country: string;
  code?: string;
}

export default function CountryFlag({
  country,
  code: countryCode,
}: Readonly<CountryFlagProps>) {
  const code = countryCode ?? countryCodeMap[country] ?? "US";

  return (
    <img
      src={`https://www.untitledui.com/images/flags/${code}.svg`}
      alt={`${country} flag`}
      className="size-5 shrink-0 rounded-full"
    />
  );
}
