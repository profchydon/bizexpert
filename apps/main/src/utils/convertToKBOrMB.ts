export const convertToKBOrMB = (
  value: number,
  threshold: number = 1024,
): string => {
  if (value < threshold) {
    return `${value} B`;
  } else if (value < threshold * threshold) {
    return `${(value / threshold).toFixed(2)} KB`;
  } else {
    return `${(value / (threshold * threshold)).toFixed(2)} MB`;
  }
};
