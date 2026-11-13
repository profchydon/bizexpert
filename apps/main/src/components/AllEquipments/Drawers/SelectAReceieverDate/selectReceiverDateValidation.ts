import { toValidDate } from "@/utils/toValidDate";

export function isValidCollectionStartDate(value?: Date | string | null) {
  return Boolean(toValidDate(value));
}

export function getCollectionDateSubmitDisabledReason(
  value?: Date | string | null,
) {
  if (isValidCollectionStartDate(value)) return null;
  return "Select a collection start date to continue.";
}
