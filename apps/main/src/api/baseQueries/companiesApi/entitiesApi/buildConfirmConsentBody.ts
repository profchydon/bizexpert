export function buildConfirmConsentBody(sessionId?: string | null) {
  const trimmed = sessionId?.trim();
  if (!trimmed) return undefined;
  return { session_id: trimmed };
}
