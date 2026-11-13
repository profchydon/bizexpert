export interface ApiErrorMessage {
  title: string;
  description?: string;
}

type ApiErrorSource = {
  status?: number;
  data?: { message?: string; errors?: unknown };
  message?: string;
  errors?: unknown;
  success?: boolean;
};

const joinErrorValues = (value: unknown): string[] => {
  if (typeof value === "string" && value.trim()) {
    return [value.trim()];
  }
  if (Array.isArray(value)) {
    return value.flatMap(joinErrorValues);
  }
  if (value && typeof value === "object") {
    return Object.values(value).flatMap(joinErrorValues);
  }
  return [];
};

const joinErrors = (errors: unknown): string | undefined => {
  const joined = joinErrorValues(errors).join(" ");
  return joined || undefined;
};

const GENERIC_API_ERROR_TITLES = new Set(["validation error"]);

export const normalizeErrorText = (value: string) =>
  value.trim().toLowerCase().replace(/\s+/g, " ");

export const isGenericApiErrorMessage = (message: string) =>
  GENERIC_API_ERROR_TITLES.has(normalizeErrorText(message));

export const isRedundantErrorDescription = (
  title: string,
  description?: string,
): boolean => {
  if (!description) {
    return true;
  }

  const normalizedTitle = normalizeErrorText(title);
  const normalizedDescription = normalizeErrorText(description);

  if (!normalizedDescription) {
    return true;
  }

  return (
    normalizedTitle === normalizedDescription ||
    normalizedTitle.includes(normalizedDescription) ||
    normalizedDescription.includes(normalizedTitle)
  );
};

export const extractApiErrorMessage = (
  source: unknown,
  fallback = "Something went wrong. Please try again.",
): ApiErrorMessage => {
  const error = (source ?? {}) as ApiErrorSource;
  const body = (error.data ?? error) as ApiErrorSource;
  const message = typeof body.message === "string" ? body.message.trim() : "";
  const description = joinErrors(body.errors);

  if (message && description && isGenericApiErrorMessage(message)) {
    return { title: description };
  }

  const title = message || description || fallback;

  if (isRedundantErrorDescription(title, description)) {
    return { title };
  }

  return {
    title,
    description,
  };
};
