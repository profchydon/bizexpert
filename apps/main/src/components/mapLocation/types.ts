import type { ReactNode } from "react";

export interface I_Location {
  address: string;
  city: string;
  country: string;
  isoCode: string;
  currencyCode: string;
  lat: number;
  lng: number;
  state: string;
  street: string;
  streetNumber: string;
}

export type MapLocationFinderProps = {
  getOfficeLocation: (location: I_Location) => void;
  children?: ReactNode;
  defaultValue?: string | { address: string };
  reset?: boolean;
  label?: string;
  specificCountry?: string | null;
  placeholder?: string;
  disabled?: boolean;
};

export type AddressComponent = {
  long_name: string;
  short_name: string;
  types: string[];
};

export type ParsedAddress = {
  country: string;
  state: string;
  city: string;
  street: string;
  streetNumber: string;
  isoCode: string;
};

export type LatLng = {
  lat: number;
  lng: number;
};
