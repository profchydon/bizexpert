export const formatScientificNotation = (value: number | string): string => {
  const stringValue = value?.toString();

  if (stringValue?.includes("e")) {
    const formattedValue = Number(value)?.toLocaleString("fullwide", {
      useGrouping: false,
    });
    return formattedValue;
  }

  return stringValue;
};
