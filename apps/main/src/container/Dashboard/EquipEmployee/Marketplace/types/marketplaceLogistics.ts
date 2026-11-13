export interface MarketplaceLogisticsHoliday {
  name: string;
  date: string;
}

export interface MarketplaceLogistics {
  holidays?: MarketplaceLogisticsHoliday[];
  active_alerts?: unknown[];
  summary?: string | null;
}

export const shouldShowMarketplaceLogisticsBanner = (
  logistics?: MarketplaceLogistics | null,
): logistics is MarketplaceLogistics & { summary: string } => {
  if (!logistics) {
    return false;
  }

  const summary = logistics.summary?.trim();

  if (!summary) {
    return false;
  }

  const hasHolidays = (logistics.holidays?.length ?? 0) > 0;
  const hasActiveAlerts = (logistics.active_alerts?.length ?? 0) > 0;

  return hasHolidays || hasActiveAlerts;
};

export const getMarketplaceLogisticsBannerTitle = (
  logistics: MarketplaceLogistics,
): string | null => {
  const firstHoliday = logistics.holidays?.[0];

  if (!firstHoliday?.name?.trim()) {
    return null;
  }

  if (firstHoliday.date?.trim()) {
    return `${firstHoliday.name} — ${firstHoliday.date}`;
  }

  return firstHoliday.name;
};
