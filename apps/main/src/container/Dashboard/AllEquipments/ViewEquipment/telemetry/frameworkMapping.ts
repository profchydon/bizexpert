import type { CheckKey } from "./signalCopy";
import type { TriState } from "./types";

// The five local checks map onto controls in each framework. Scoring the device against
// anonymous marks could report "3 of 5 met" without ever saying which three, so the shape
// kept here is the matrix itself: a check is either mapped by a framework or it is not.
export interface Framework {
  key: string;
  name: string;
  /** Abbreviated for the collapsed summary, where all three sit on one line. */
  short: string;
  covers: CheckKey[];
}

export const FRAMEWORKS: Framework[] = [
  {
    key: "soc2",
    name: "SOC 2",
    short: "SOC 2",
    covers: ["encryption", "firewall", "antivirus", "screenLock", "osPatch"],
  },
  // ISO 27001 has no control that maps to an idle screen lock, so its denominator is four.
  // The old pip row hid that; the matrix has to show it as "not mapped", not as a pass.
  {
    key: "iso",
    name: "ISO 27001",
    short: "ISO",
    covers: ["encryption", "firewall", "antivirus", "osPatch"],
  },
  {
    key: "cis",
    name: "CIS Benchmark",
    short: "CIS",
    covers: ["encryption", "firewall", "antivirus", "screenLock", "osPatch"],
  },
];

export interface FrameworkScore {
  framework: Framework;
  mapped: number;
  met: number;
}

export function scoreFramework(
  framework: Framework,
  compliance: Record<CheckKey, TriState>,
): FrameworkScore {
  return {
    framework,
    mapped: framework.covers.length,
    met: framework.covers.filter((key) => compliance[key] === "pass").length,
  };
}

export function scoreFrameworks(
  compliance: Record<CheckKey, TriState>,
): FrameworkScore[] {
  return FRAMEWORKS.map((framework) => scoreFramework(framework, compliance));
}

export const MARK_TOOLTIP: Record<TriState, string> = {
  pass: "Met. The agent confirmed this control.",
  fail: "Failing. Evidence is being logged against it.",
  not_verified: "Unverified. No evidence, so the control cannot be claimed.",
};

export const NOT_MAPPED_TOOLTIP = "Not mapped by this framework.";
