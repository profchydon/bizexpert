"use client";

import routes from "@/routes";
import { useAppDispatch } from "@/store";
import { clearClientAuthSession } from "@/utils/auth/clearClientAuthSession";
import { sanitizePostLoginRedirect } from "@/utils/auth/postLoginRedirect";
import { useAuthUserDetail } from "@/utils/useAuthUser";
import {
  resolveAccessContext,
  resolveDefaultDashboardRoute,
  shouldRedirectBasicUserToEmployeePortal,
} from "@/utils/auth/resolveAccessContext";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";

const POST_LOGIN_REDIRECT_KEY = "post_login_redirect";

const consumePostLoginRedirect = () => {
  if (globalThis.window === undefined) return null;
  const path = globalThis.window.sessionStorage.getItem(
    POST_LOGIN_REDIRECT_KEY,
  );
  if (path) {
    globalThis.window.sessionStorage.removeItem(POST_LOGIN_REDIRECT_KEY);
  }
  return sanitizePostLoginRedirect(path);
};

const AuthRedirectWrapper: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const searchParams = useSearchParams();
  const [isMounted, setIsMounted] = useState(false);

  const { isLoggedIn, getUserDetails, getEntityMemberships } =
    useAuthUserDetail();
  const isAuth = isLoggedIn();
  const user = getUserDetails();
  const switchAccountParam = searchParams.get("switch_account");
  const shouldSwitchAccount =
    switchAccountParam === "1" || switchAccountParam === "true";

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (shouldSwitchAccount) {
      clearClientAuthSession(dispatch);
      return;
    }

    if (!isAuth || !user) {
      return;
    }

    const access = resolveAccessContext(user, getEntityMemberships());
    const postLoginRedirect = consumePostLoginRedirect();
    if (postLoginRedirect) {
      router.push(postLoginRedirect);
      return;
    }

    if (shouldRedirectBasicUserToEmployeePortal(access)) {
      router.push(routes.EMPLOYEE);
      return;
    }

    router.push(resolveDefaultDashboardRoute(access));
  }, [dispatch, isAuth, router, shouldSwitchAccount, user]);

  return isMounted && (!isAuth || shouldSwitchAccount) && children;
};

export default AuthRedirectWrapper;
