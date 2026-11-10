import {
  endOfDay,
  startOfDay,
  startOfMonth,
  startOfWeek,
  subDays,
} from "date-fns";

export function periodToRange(period: string): {
  startDate: string;
  endDate: string;
} {
  const now = new Date();
  let start: Date;
  let end: Date = endOfDay(now);

  switch (period) {
    case "today":
      start = startOfDay(now);
      break;
    case "yesterday":
      start = startOfDay(subDays(now, 1));
      end = endOfDay(subDays(now, 1));
      break;
    case "this_week":
      start = startOfWeek(now);
      break;
    case "this_month":
      start = startOfMonth(now);
      break;
    case "last_30_days":
    default:
      start = startOfDay(subDays(now, 30));
      break;
  }

  return { startDate: start.toISOString(), endDate: end.toISOString() };
}
