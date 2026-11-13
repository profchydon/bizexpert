export const formatDecimalYears = (decimalYears: number): string | null => {
  if (!decimalYears) return null;

  const isPast = decimalYears < 0;
  const absYears = Math.abs(decimalYears);

  const years = Math.floor(absYears);
  const remainingMonths = Math.floor((absYears - years) * 12);
  const totalDays = Math.round((absYears - years - remainingMonths / 12) * 365);

  if (years === 0 && remainingMonths > 0) {
    return `${remainingMonths} month${remainingMonths > 1 ? "s" : ""} ${isPast ? "ago" : "from now"}`;
  }

  if (years === 0 && remainingMonths === 0 && totalDays > 0) {
    return `${totalDays} day${totalDays > 1 ? "s" : ""} ${isPast ? "ago" : "from now"}`;
  }

  if (years > 0 && remainingMonths > 0) {
    return `${years} year${years > 1 ? "s" : ""}, ${remainingMonths} month${remainingMonths > 1 ? "s" : ""} ${isPast ? "ago" : "from now"}`;
  }

  if (years > 0) {
    return `${years} year${years > 1 ? "s" : ""} ${isPast ? "ago" : "from now"}`;
  }

  return `${totalDays} day${totalDays > 1 ? "s" : ""} ${isPast ? "ago" : "from now"}`;
};
