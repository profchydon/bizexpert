import { isValidPhoneNumber } from "react-phone-number-input";

const WEBSITE_RE = /^(https?:\/\/)?([a-z0-9-]+\.)+[a-z]{2,}(\/\S*)?$/i;

export const EMPLOYEE_SIZE_OPTIONS = [
  "1-10",
  "11-50",
  "51-100",
  "101-250",
  "251-500",
  "501-1000",
  "1000+",
];

export function websiteHint(value: string): string | undefined {
  if (!value.trim()) return "Enter a website.";
  if (!WEBSITE_RE.test(value.trim())) {
    return "Enter a valid website URL, like acme.com.";
  }
  return undefined;
}

export function phoneHint(value: string): string | undefined {
  if (!value.trim()) return "Enter a phone number.";
  if (!isValidPhoneNumber(value)) return "Enter a valid phone number.";
  return undefined;
}

export function companyNameHint(value: string): string | undefined {
  if (!value.trim()) return "Enter a company name.";
  return undefined;
}
