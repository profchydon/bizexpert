export const sensitiveFieldLabelClass = "text-xs text-tertiary";

export const sensitiveFieldRowClass =
  "flex w-full items-center justify-between gap-3";

export const sensitiveFieldActionsClass = "flex shrink-0 items-center gap-1.5";

export const sensitiveFieldValueClass = (isRevealed: boolean) =>
  isRevealed
    ? "min-w-0 flex-1 pr-3 break-all text-sm font-medium text-primary"
    : "min-w-0 flex-1 pr-3 break-all font-mono text-sm font-medium tracking-wider text-tertiary";

export const maskedDots = (text: string) =>
  "•".repeat(Math.min(Math.max(text.length, 6), 18));
