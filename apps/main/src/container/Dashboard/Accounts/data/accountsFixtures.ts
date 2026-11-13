export type ClosureBlockers = "none" | "offices" | "ar" | "both";
export type CardCaptureOutcome = "success" | "stalled";

export const defaultClosureBlockers: ClosureBlockers = "none";
export const defaultCardCaptureOutcome: CardCaptureOutcome = "success";
