import { differenceInMonths, differenceInDays } from "date-fns";

/**
 * Calculates total months (including partial) between two dates
 */
export const getTotalMonthsFromStart = (startDate: string): number => {
  const now = new Date();
  const start = new Date(startDate);

  const fullMonths = differenceInMonths(now, start);
  const leftoverDays = differenceInDays(
    now,
    new Date(start.setMonth(start.getMonth() + fullMonths)),
  );

  const approxPartialMonth = leftoverDays / 30;

  return parseFloat((fullMonths + approxPartialMonth).toFixed(2));
};
