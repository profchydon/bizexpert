import routes from "@/routes";

export type PaymentVerifyKind = "success" | "error";

export function shouldApplyPaymentVerify(
  handled: PaymentVerifyKind | null,
  kind: PaymentVerifyKind,
  hasResult: boolean,
) {
  return Boolean(hasResult) && handled !== kind;
}

export function paymentVerifyRedirectPath(kind: PaymentVerifyKind) {
  const flag = kind === "success" ? "success_instance" : "error_instance";
  return `${routes.TRANSACTIONS}?${flag}=true`;
}
