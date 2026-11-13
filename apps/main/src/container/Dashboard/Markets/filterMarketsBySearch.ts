import type { MarketApp } from "./marketCatalog";

export function filterMarketsBySearch(
  apps: MarketApp[],
  query: string,
): MarketApp[] {
  const needle = query.trim().toLowerCase();
  if (!needle) return apps;
  return apps.filter((app) => {
    const haystack = [app.name, app.tagline, app.audience, app.category]
      .join(" ")
      .toLowerCase();
    return haystack.includes(needle);
  });
}
