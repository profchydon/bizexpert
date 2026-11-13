import * as Sentry from "@sentry/nextjs";
import displayErrorMessage from "@/utils/displayErrorMessage";

export function isRtkQueryError(error: unknown): boolean {
  if (typeof error !== "object" || error === null || !("status" in error)) {
    return false;
  }

  const status = (error as { status: unknown }).status;
  return typeof status === "number" || typeof status === "string";
}

export function handleUnexpectedAsyncError(
  error: unknown,
  fallbackMessage = "Something went wrong",
): void {
  if (isRtkQueryError(error)) {
    return;
  }

  Sentry.captureException(error);
  displayErrorMessage(fallbackMessage);
}
