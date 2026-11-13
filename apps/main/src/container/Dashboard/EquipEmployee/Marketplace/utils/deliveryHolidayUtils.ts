import type { NigeriaHoliday } from "../data/nigeriaHolidays";

export interface HolidayDelay {
  holiday: NigeriaHoliday;
  delayDays: number;
  adjustedDeliveryTime: string;
}

const parseDeliveryRange = (
  deliveryTime: string,
): { min: number; max: number } => {
  const rangeRegex = /(\d+)\s*-\s*(\d+)/;
  const rangeMatch = rangeRegex.exec(deliveryTime);

  if (rangeMatch) {
    return { min: Number(rangeMatch[1]), max: Number(rangeMatch[2]) };
  }

  const singleRegex = /(\d+)/;
  const singleMatch = singleRegex.exec(deliveryTime);
  const days = singleMatch ? Number(singleMatch[1]) : 7;

  return { min: days, max: days };
};

const getUpcomingHoliday = (
  holidays: NigeriaHoliday[],
  today: Date = new Date(),
  horizonDays = 30,
): NigeriaHoliday | null => {
  const horizon = new Date(today);
  horizon.setDate(horizon.getDate() + horizonDays);

  return (
    holidays.find(
      (holiday) => holiday.startDate >= today && holiday.startDate <= horizon,
    ) ?? null
  );
};

export { getUpcomingHoliday, parseDeliveryRange };
