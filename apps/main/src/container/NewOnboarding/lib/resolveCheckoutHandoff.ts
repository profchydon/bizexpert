export type CheckoutHandoff = "redirected" | "failed";

type CheckoutResponse = {
  data?: {
    collection?: { link?: string | null } | null;
  };
};

export function resolveCheckoutHandoff(
  response: CheckoutResponse,
): CheckoutHandoff {
  const link = response.data?.collection?.link;
  if (typeof link === "string" && link.length > 0) {
    return "redirected";
  }
  return "failed";
}
