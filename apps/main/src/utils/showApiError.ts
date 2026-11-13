import displayErrorMessage from "./displayErrorMessage";
import { extractApiErrorMessage } from "./extractApiErrorMessage";
import { isRtkQueryError } from "./handleUnexpectedAsyncError";

export const showApiError = (error: unknown) => {
  if (isRtkQueryError(error)) {
    return;
  }

  const { title } = extractApiErrorMessage(error);
  displayErrorMessage(title);
};
