type ConversionType = "toMonths" | "toYears";

export const convertTime = (
  value: number,
  type: ConversionType,
): number | string => {
  if (type === "toMonths") {
    return value * 12;
  }

  if (type === "toYears") {
    const years = Math.floor(value / 12);
    const remainingMonths = value % 12;
    return remainingMonths === 0
      ? years
      : `${years} year(s) and ${remainingMonths} month(s)`;
  }

  throw new Error("Invalid conversion type");
};
