import { periodToRange } from "./ai-period";

describe("periodToRange", () => {
  it("maps today to the current day bounds", () => {
    const range = periodToRange("today");
    const start = new Date(range.startDate);
    const end = new Date(range.endDate);
    expect(start.getDate()).toBe(end.getDate());
    expect(end.getTime()).toBeGreaterThan(start.getTime());
  });

  it("maps yesterday before today", () => {
    const today = periodToRange("today");
    const yesterday = periodToRange("yesterday");
    expect(new Date(yesterday.endDate).getTime()).toBeLessThan(
      new Date(today.startDate).getTime(),
    );
  });

  it("defaults unknown periods to the last 30 days", () => {
    const range = periodToRange("unknown");
    const span =
      new Date(range.endDate).getTime() - new Date(range.startDate).getTime();
    expect(span).toBeGreaterThan(29 * 24 * 60 * 60 * 1000);
  });
});
