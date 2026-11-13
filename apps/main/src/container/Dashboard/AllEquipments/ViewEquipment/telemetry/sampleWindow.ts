import { dayLabel, seedFor } from "./historyWindow";
import type { SampleWindow, TrendOverride } from "./types";

// A trend needs enough history to be a trend. Below this the tab shows the reading and
// says when the chart arrives, rather than drawing a line through three weeks and calling
// it a direction. Analytics tools do the same thing with their first 48 hours.
export const SAMPLES_NEEDED = 60;

// Sampling starts when the agent build that records these series lands, not when the
// device enrolled. A long-installed agent on an older build has a short series.
export function getSampleWindow(
  id: string,
  override: TrendOverride = "default",
): SampleWindow {
  const collected =
    override === "ready"
      ? SAMPLES_NEEDED
      : override === "collecting"
        ? 46
        : 30 + (seedFor(id, "samples") % 45);
  const days = Math.min(collected, SAMPLES_NEEDED);
  const ready = days >= SAMPLES_NEEDED;
  return {
    days,
    need: SAMPLES_NEEDED,
    ready,
    // Dated, not counted: "in 14 days" would drift every time the page rendered.
    unlockLabel: dayLabel(-(SAMPLES_NEEDED - days)),
    sinceLabel: dayLabel(days),
  };
}
