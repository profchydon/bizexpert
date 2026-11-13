"use client";

import { useEffect, useRef, useState } from "react";
import { PhoneCountrySelect } from "@/components/base/input/phone-country-select";
import {
  applyExternalPhone,
  createPhoneFieldState,
  editPhoneField,
} from "./phoneFieldState";

type Props = {
  value?: string | null;
  onChange: (value: string) => void;
};

export function EditEmployeePhoneField({ value, onChange }: Props) {
  const initial = createPhoneFieldState(value);
  const [country, setCountry] = useState(initial.country);
  const [phone, setPhone] = useState(initial.phone);
  const emittedRef = useRef(initial.emitted);

  useEffect(() => {
    const next = applyExternalPhone(
      { country: "", phone: "", emitted: emittedRef.current },
      value,
    );
    if (!next) return;
    emittedRef.current = next.emitted;
    setCountry(next.country);
    setPhone(next.phone);
  }, [value]);

  const sync = (nextCountry: string, nextPhone: string) => {
    const next = editPhoneField(nextCountry, nextPhone);
    emittedRef.current = next.emitted;
    setCountry(next.country);
    setPhone(next.phone);
    onChange(next.output);
  };

  return (
    <PhoneCountrySelect
      country={country}
      phone={phone}
      onCountryChange={(nextCountry) => sync(nextCountry, phone)}
      onPhoneChange={(nextPhone) => sync(country, nextPhone)}
    />
  );
}
