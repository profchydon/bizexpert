import { getLocalTimeZone, today } from "@internationalized/date";
import type { DateValue } from "react-aria-components";

export function isRequestCheckNeededByUnavailable(date: DateValue): boolean {
  const zone = getLocalTimeZone();
  if (date.compare(today(zone)) <= 0) {
    return true;
  }

  const weekday = date.toDate(zone).getDay();
  return weekday === 0 || weekday === 6;
}

export function requestCheckMinNeededByDate() {
  let date = today(getLocalTimeZone()).add({ days: 1 });
  while (isRequestCheckNeededByUnavailable(date)) {
    date = date.add({ days: 1 });
  }
  return date;
}
