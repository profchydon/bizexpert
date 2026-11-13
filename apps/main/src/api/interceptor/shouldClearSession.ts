const UNAUTHENTICATED_MESSAGE = "unauthenticated";

function carriesUnauthenticatedMessage(data: unknown): boolean {
  if (typeof data === "string") {
    return data.trim().toLowerCase() === UNAUTHENTICATED_MESSAGE;
  }
  if (data && typeof data === "object" && "message" in data) {
    const message = (data as { message?: unknown }).message;
    return (
      typeof message === "string" &&
      message.trim().toLowerCase() === UNAUTHENTICATED_MESSAGE
    );
  }
  return false;
}

export function shouldClearSession(
  status: number | undefined,
  data: unknown,
): boolean {
  if (status === 401) return true;
  return carriesUnauthenticatedMessage(data);
}
