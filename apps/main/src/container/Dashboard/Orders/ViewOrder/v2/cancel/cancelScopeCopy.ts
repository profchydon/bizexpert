export const plural = (count: number, word: string) =>
  `${count} ${word}${count === 1 ? "" : "s"}`;

export function cancelledGroupLabel(): string {
  return "Already cancelled";
}

export function cancelledBadgeLabel(): string {
  return "Cancelled";
}

export function cancelledTooltip(): string {
  return "This sub-order was cancelled. Nothing will be delivered for this employee.";
}

export function excludedGroupLabel(isOffboarding: boolean): string {
  return isOffboarding ? "Already retrieved" : "Already delivered";
}

export function excludedBadgeLabel(isOffboarding: boolean): string {
  return isOffboarding ? "Retrieved" : "Delivered";
}

export function excludedTooltip(isOffboarding: boolean): string {
  return isOffboarding
    ? "Retrieval is finished, so this device cannot be cancelled and stays paid."
    : "Already delivered to its owner, so it cannot be cancelled and stays paid.";
}
