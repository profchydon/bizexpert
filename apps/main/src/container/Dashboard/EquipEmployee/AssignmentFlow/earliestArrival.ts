const MINIMUM_FEE_LEAD_DAYS = 7;

export function parseDeliveryRangeMin(
  deliveryTime: string | undefined,
): number {
  if (!deliveryTime?.trim() || !/\d/.test(deliveryTime)) return 0;
  const match = /(\d+)/.exec(deliveryTime);
  return match ? Math.max(0, Number(match[1])) : 0;
}

export function deliveryLeadDays(deliveryTime: string | undefined): number {
  const numbers = [...(deliveryTime ?? "").matchAll(/(\d+)/g)].map((match) =>
    Number(match[1]),
  );
  const quoted = numbers.length === 0 ? 0 : Math.max(...numbers);
  return Math.max(quoted, MINIMUM_FEE_LEAD_DAYS);
}

function formatLocalDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function earliestArrivalFor(
  deliveryTime: string | undefined,
  now: Date = new Date(),
): string {
  const from = new Date(now);
  from.setHours(0, 0, 0, 0);
  from.setDate(from.getDate() + deliveryLeadDays(deliveryTime));
  return formatLocalDate(from);
}

export function earliestArrivalForAll(
  deliveryTimes: (string | undefined)[],
): string | undefined {
  const dates = deliveryTimes.map((deliveryTime) =>
    earliestArrivalFor(deliveryTime),
  );
  return dates.length === 0
    ? undefined
    : dates.reduce((latest, date) => (date > latest ? date : latest));
}
