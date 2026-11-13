import type { Middleware } from "@reduxjs/toolkit";
import { clearAuthToken } from "@/utils/encryption/authTokenStorage";
import { unsetAuth } from "@/store/slices/authSlice";

export const authSessionMiddleware: Middleware = () => (next) => (action) => {
  if (unsetAuth.match(action)) {
    clearAuthToken();
  }

  return next(action);
};
