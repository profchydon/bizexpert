const DAY_MS = 86400000;
const OVERVIEW_DAYS = 30;

export function inventoryOverviewStartDate(now = new Date()): string {
  return new Date(now.getTime() - OVERVIEW_DAYS * DAY_MS).toISOString();
}

export const INVENTORY_OVERVIEW_TOP_LIMIT = 5;
