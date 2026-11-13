export type CompleteScreenAction =
  | "loading"
  | "redirect-signup"
  | "redirect-setup"
  | "show";

export function resolveCompleteScreenAction({
  hasCompany,
  hasTxRef,
  isProgressLoading,
  onboardingCompleted,
}: {
  hasCompany: boolean;
  hasTxRef: boolean;
  isProgressLoading: boolean;
  onboardingCompleted?: boolean;
}): CompleteScreenAction {
  if (!hasCompany) return "redirect-signup";
  if (hasTxRef) return "show";
  if (isProgressLoading) return "loading";
  if (onboardingCompleted) return "show";
  return "redirect-setup";
}
