import { isRejectedWithValue } from "@reduxjs/toolkit";
import type { MiddlewareAPI, Middleware } from "@reduxjs/toolkit";
import * as Sentry from "@sentry/nextjs";
import displayErrorMessage from "@/utils/displayErrorMessage";
import {
  collectRtkQueryErrorMessages,
  RtkQueryErrorPayload,
  shouldReportRtkQueryErrorToSentry,
} from "./rtkQueryErrorLogger.logic";

/**
 * Log a warning and show a toast!
 */
export const rtkQueryErrorLogger: Middleware =
  (api: MiddlewareAPI) => (next) => (action) => {
    if (isRejectedWithValue(action)) {
      const payload = action.payload as RtkQueryErrorPayload;
      const messages = collectRtkQueryErrorMessages(payload);

      messages.forEach((message) => {
        displayErrorMessage(message);
      });

      if (shouldReportRtkQueryErrorToSentry(payload?.status)) {
        Sentry.captureException(new Error(messages.join("; ")), {
          extra: {
            status: payload?.status,
            data: payload?.data,
          },
        });
      }
    }

    return next(action);
  };
