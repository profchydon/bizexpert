import {
  extractApiErrorMessage,
  isGenericApiErrorMessage,
} from "@/utils/extractApiErrorMessage";

export function entityApiErrorMessage(
  error: unknown,
  fallback: string,
): string {
  const { title } = extractApiErrorMessage(error, fallback);
  if (!title.trim() || isGenericApiErrorMessage(title)) return fallback;
  return title;
}
