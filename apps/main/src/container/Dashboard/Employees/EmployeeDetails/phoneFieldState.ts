import {
  formatEmployeePhone,
  parseEmployeePhone,
} from "@/utils/phone/parseEmployeePhone";

export type PhoneFieldState = {
  country: string;
  phone: string;
  emitted: string;
};

export function createPhoneFieldState(value?: string | null): PhoneFieldState {
  const parsed = parseEmployeePhone(value);
  return {
    country: parsed.country,
    phone: parsed.phone,
    emitted: value ?? "",
  };
}

export function editPhoneField(
  country: string,
  phone: string,
): PhoneFieldState & { output: string } {
  const output = formatEmployeePhone(country, phone);
  return { country, phone, emitted: output, output };
}

export function applyExternalPhone(
  state: PhoneFieldState,
  value?: string | null,
): PhoneFieldState | null {
  const nextValue = value ?? "";
  if (nextValue === state.emitted) return null;

  const parsed = parseEmployeePhone(value);
  return {
    country: parsed.country,
    phone: parsed.phone,
    emitted: nextValue,
  };
}
