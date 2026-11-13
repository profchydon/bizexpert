type ApiError = {
  data?: {
    errors?: {
      conflicts?: { message?: string | null }[];
      requires_acknowledgment?: boolean;
    };
  };
};

export type SubRuleConflictError = {
  messages: string[];
  requiresAcknowledgment: boolean;
};

export function getSubRuleConflictError(
  error: unknown,
): SubRuleConflictError | null {
  const apiError = error as ApiError;
  const conflictErrors = apiError.data?.errors;
  const messages = (conflictErrors?.conflicts ?? [])
    .map((conflict) => conflict.message)
    .filter((message): message is string => Boolean(message));

  if (!messages.length) return null;

  return {
    messages,
    requiresAcknowledgment: Boolean(conflictErrors?.requires_acknowledgment),
  };
}
