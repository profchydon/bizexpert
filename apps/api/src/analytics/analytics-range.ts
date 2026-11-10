import { endOfDay, startOfMonth } from 'date-fns';

export type AnalyticsQuery = {
  locationId?: string;
  startDate?: string;
  endDate?: string;
  limit?: number;
};

export function resolveDateRange(query: AnalyticsQuery): {
  start: Date;
  end: Date;
} {
  const now = new Date();
  return {
    start: query.startDate ? new Date(query.startDate) : startOfMonth(now),
    end: query.endDate ? endOfDay(new Date(query.endDate)) : endOfDay(now),
  };
}
