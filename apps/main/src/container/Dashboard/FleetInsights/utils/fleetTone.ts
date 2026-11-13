export type FleetTone = "good" | "fair" | "poor";

export function resolveFleetTone(
  passRate: number | null | undefined,
): FleetTone {
  if (passRate == null || Number.isNaN(passRate)) return "poor";
  const percent = passRate <= 1 ? passRate * 100 : passRate;
  if (percent >= 90) return "good";
  if (percent >= 70) return "fair";
  return "poor";
}

export function fleetToneLabel(tone: FleetTone): string {
  if (tone === "good") return "Good";
  if (tone === "fair") return "Fair";
  return "Needs attention";
}

export function fleetToneChipClass(tone: FleetTone): string {
  if (tone === "good")
    return "bg-success-50 text-success-700 border-success-200";
  if (tone === "fair")
    return "bg-warning-50 text-warning-700 border-warning-200";
  return "bg-error-50 text-error-700 border-error-200";
}

export function fleetToneHeadline(tone: FleetTone): string {
  if (tone === "good") return "Your fleet is in good shape";
  if (tone === "fair") return "Your fleet has gaps to close";
  return "Your fleet needs urgent attention";
}
