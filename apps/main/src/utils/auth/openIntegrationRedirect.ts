import displayErrorMessage from "@/utils/displayErrorMessage";
import { showApiError } from "@/utils/showApiError";
import { openSafeRedirectUrl } from "./isSafeRedirectUrl";

export function asRedirectUrl(value: unknown): string | undefined {
  return typeof value === "string" ? value : undefined;
}

export async function openIntegrationRedirect(
  loadUrl: () => Promise<string | null | undefined>,
): Promise<boolean> {
  try {
    const url = await loadUrl();
    if (openSafeRedirectUrl(url)) {
      return true;
    }

    displayErrorMessage(
      "We couldn't open the connection.",
      "The connect address from the server was not a valid http or https URL.",
    );
    return false;
  } catch (error) {
    showApiError(error);
    return false;
  }
}
