import { extractApiErrorMessage } from "@/utils/extractApiErrorMessage";

export type RtkQueryErrorPayload = {
  status?: number;
  data?: {
    message?: string;
    errors?: Record<string, string[]> | string[] | string[][];
  };
};

export function shouldReportRtkQueryErrorToSentry(status: unknown): boolean {
  if (status === undefined || status === null) {
    return true;
  }

  if (typeof status !== "number") {
    return true;
  }

  return status >= 500;
}

export function collectRtkQueryErrorMessages(
  payload: RtkQueryErrorPayload | undefined,
): string[] {
  if (!payload?.data) {
    return ["Something went wrong"];
  }

  const { title } = extractApiErrorMessage(payload, "Something went wrong");
  return [title];
}
