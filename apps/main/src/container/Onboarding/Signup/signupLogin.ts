import { assignSafeRedirectUrl } from "@/utils/auth/isSafeRedirectUrl";
import displayErrorMessage from "@/utils/displayErrorMessage";
import { showApiError } from "@/utils/showApiError";

type LoginAuthorization = () => {
  unwrap: () => Promise<{ data: { redirect_url: string } }>;
};

export const startSignupLogin = async (
  loginAuthorization: LoginAuthorization,
) => {
  try {
    const session = await loginAuthorization().unwrap();
    if (!assignSafeRedirectUrl(session.data.redirect_url)) {
      displayErrorMessage(
        "We couldn't start sign in.",
        "The sign-in address from the server was not a valid http or https URL.",
      );
    }
  } catch (error) {
    showApiError(error);
  }
};
