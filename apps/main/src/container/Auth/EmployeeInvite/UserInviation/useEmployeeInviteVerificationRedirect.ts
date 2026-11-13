import { useCallback, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { IUserInvitation } from "@/types/employees";
import { useAuthUserDetail } from "@/utils/useAuthUser";

const POST_LOGIN_REDIRECT_KEY = "post_login_redirect";

export function useEmployeeInviteVerificationRedirect(
  invitation: IUserInvitation | null,
) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next");
  const verificationToken = searchParams.get("verification_token");
  const { isLoggedIn } = useAuthUserDetail();
  const isAuthenticated = isLoggedIn();

  const buildVerificationRedirect = useCallback(() => {
    if (!verificationToken) return "";
    const company = invitation?.company_id || "";
    const companyPart = company
      ? `&company=${encodeURIComponent(company)}`
      : "";
    return `/employee/verify-delivery?token=${encodeURIComponent(
      verificationToken,
    )}${companyPart}`;
  }, [invitation?.company_id, verificationToken]);

  useEffect(() => {
    if (next !== "verification" || !verificationToken) return;
    if (globalThis.window === undefined) return;

    const redirectPath = buildVerificationRedirect();

    if (isAuthenticated) {
      globalThis.window.sessionStorage.removeItem(POST_LOGIN_REDIRECT_KEY);
      router.replace(redirectPath);
      return;
    }

    globalThis.window.sessionStorage.setItem(
      POST_LOGIN_REDIRECT_KEY,
      redirectPath,
    );
  }, [
    next,
    verificationToken,
    buildVerificationRedirect,
    isAuthenticated,
    router,
  ]);

  return { buildVerificationRedirect, next, verificationToken };
}
