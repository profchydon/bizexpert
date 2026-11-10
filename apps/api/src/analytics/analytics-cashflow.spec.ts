import { mergeCashflowDays, summarizeCashflow } from './analytics-cashflow';

describe('cashflow series', () => {
  const day = (iso: string) => new Date(iso);

  it('merges inflow and outflow onto the same days', () => {
    const series = mergeCashflowDays(
      [{ period: day('2026-01-02T00:00:00.000Z'), amount: '199', count: '11' }],
      [
        {
          period: day('2026-01-02T00:00:00.000Z'),
          amount: '860.36',
          count: '14',
        },
        { period: day('2026-01-03T00:00:00.000Z'), amount: '10', count: '1' },
      ],
    );
    expect(series).toHaveLength(2);
    expect(series[0]).toMatchObject({
      inflowAmount: 199,
      inflowCount: 11,
      outflowAmount: 860.36,
      outflowCount: 14,
    });
    expect(series[1]?.outflowAmount).toBe(10);
    expect(series[1]?.inflowAmount).toBe(0);
  });

  it('totals inflow and outflow across days', () => {
    expect(
      summarizeCashflow([
        {
          period: day('2026-01-02T00:00:00.000Z'),
          inflowAmount: 199,
          inflowCount: 11,
          outflowAmount: 860.36,
          outflowCount: 14,
        },
        {
          period: day('2026-01-03T00:00:00.000Z'),
          inflowAmount: 1,
          inflowCount: 1,
          outflowAmount: 0,
          outflowCount: 0,
        },
      ]),
    ).toEqual({
      inflowAmount: 200,
      inflowCount: 12,
      outflowAmount: 860.36,
      outflowCount: 14,
    });
  });
});
