const PREFERRED_DATE_FORMAT = new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "short",
  year: "numeric",
});

export const PREFERRED_DATE_HELP = {
  title: "The date you would like it to arrive",
  description:
    "We share it with the supplier and aim for it, but it is not guaranteed. The device may arrive on a different day.",
};

export function formatPreferredDate(value?: string | null): string | null {
  if (!value) {
    return null;
  }

  const [year, month, day] = value.split("T")[0].split("-").map(Number);
  if (!year || !month || !day) {
    return null;
  }

  const date = new Date(year, month - 1, day);
  if (
    date.getFullYear() !== year ||
    date.getMonth() !== month - 1 ||
    date.getDate() !== day
  ) {
    return null;
  }

  return PREFERRED_DATE_FORMAT.format(date);
}

export function showPreferredDeliveryDate(
  destinationType?: "employee" | "office" | "storage",
): boolean {
  return destinationType !== "storage";
}
