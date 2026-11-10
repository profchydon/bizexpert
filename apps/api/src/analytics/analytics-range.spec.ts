import { endOfDay, startOfMonth } from 'date-fns';
import { resolveDateRange } from './analytics-range';

describe('resolveDateRange', () => {
  it('defaults to the current month through today', () => {
    const range = resolveDateRange({});
    expect(range.start.getTime()).toBe(startOfMonth(new Date()).getTime());
    expect(range.end.getTime()).toBe(endOfDay(new Date()).getTime());
  });

  it('uses the provided start and end dates', () => {
    const range = resolveDateRange({
      startDate: '2026-01-01',
      endDate: '2026-01-31',
    });
    expect(range.start.toISOString().startsWith('2026-01-01')).toBe(true);
    expect(range.end.getDate()).toBe(31);
  });
});
