const COUNTRY_BAR_CLASSES = [
  "bg-utility-brand-500",
  "bg-utility-orange-500",
  "bg-utility-success-500",
  "bg-utility-purple-500",
  "bg-utility-gray-blue-500",
  "bg-utility-blue-light-500",
  "bg-utility-pink-500",
  "bg-utility-indigo-500",
] as const;

export function countryBarClass(index: number): string {
  return COUNTRY_BAR_CLASSES[index % COUNTRY_BAR_CLASSES.length];
}
