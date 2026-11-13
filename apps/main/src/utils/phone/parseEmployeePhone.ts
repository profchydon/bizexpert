import { parsePhoneNumber } from "react-phone-number-input";
import { phoneDialCodes } from "./phone-data";

export function parseEmployeePhone(value?: string | null) {
  if (!value?.trim()) {
    return { country: "ng", phone: "" };
  }

  try {
    const parsed = parsePhoneNumber(value);
    if (parsed) {
      return {
        country: parsed.country?.toLowerCase() ?? "ng",
        phone: parsed.nationalNumber ?? "",
      };
    }
  } catch {
    return { country: "ng", phone: value.replace(/\D/g, "") };
  }

  return { country: "ng", phone: value.replace(/\D/g, "") };
}

export function formatEmployeePhone(country: string, phone: string) {
  let digits = phone.replace(/\D/g, "");
  if (!digits) return "";

  const dial = phoneDialCodes[country]?.replace(/\D/g, "") ?? "";
  if (dial && digits.startsWith(dial)) {
    digits = digits.slice(dial.length);
  }
  if (digits.startsWith("0")) {
    digits = digits.slice(1);
  }

  return `+${dial}${digits}`;
}

export function normalizeEmployeePhoneValue(value?: string | null): string {
  if (!value?.trim()) return "";
  const parsed = parseEmployeePhone(value);
  return formatEmployeePhone(parsed.country, parsed.phone);
}
