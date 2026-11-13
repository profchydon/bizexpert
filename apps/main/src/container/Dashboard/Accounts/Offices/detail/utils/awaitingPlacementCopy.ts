export const AWAITING_PLACEMENT_DESCRIPTION =
  "They belong to the office already. Assign each one to a room or to someone who works here.";

export function awaitingPlacementCopy(count: number): string {
  if (count < 1) return "";
  const noun = count === 1 ? "device" : "devices";
  const verb = count === 1 ? "needs" : "need";
  return `${count} ${noun} bought for this office ${verb} placing`;
}
