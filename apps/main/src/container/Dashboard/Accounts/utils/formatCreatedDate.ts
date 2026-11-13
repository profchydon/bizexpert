export function formatCreatedDate(createdDaysAgo: number): string {
  if (createdDaysAgo <= 0) return "Today";
  const date = new Date();
  date.setUTCDate(date.getUTCDate() - createdDaysAgo);
  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });
}
