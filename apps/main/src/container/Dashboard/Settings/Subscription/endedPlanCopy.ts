export function endedPlanCopy(input: {
  planName: string;
  endedOn: string;
  freePlanName: string;
}): { title: string; description: string; cta: string } {
  const when = input.endedOn ? ` on ${input.endedOn}` : "";
  const home = input.freePlanName
    ? ` and you are on ${input.freePlanName}`
    : "";
  return {
    title: `Your ${input.planName} plan has ended`,
    description: `The renewal went unpaid, so ${input.planName} ended${when}${home}. Every device, employee and record is still here. Subscribe again whenever you are ready.`,
    cta: `Resubscribe to ${input.planName}`,
  };
}

export function planOnScreen<T extends { amount: number }>(
  lapsed: boolean,
  contractPlan: T | undefined,
  freePlan: T | undefined,
): T | undefined {
  if (!lapsed || !contractPlan || contractPlan.amount === 0) {
    return contractPlan;
  }
  return freePlan ?? contractPlan;
}
