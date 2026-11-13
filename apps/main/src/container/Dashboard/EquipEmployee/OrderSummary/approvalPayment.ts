import routes from "@/routes";
import type { ApproveCatalogOrderRequestPayload } from "@/api/baseQueries/companiesApi/catalogPoliciesApi/types";

export type ApprovalPaymentRequest = {
  acknowledgeBudgetWarning: boolean;
  catalogId: string;
  orderRequestId: string;
  returnPath?: string;
};

export function approvalRedirectUrl({
  catalogId,
  origin,
  orderRequestId,
  returnPath = routes.APPROVALS,
}: {
  catalogId: string;
  origin: string;
  orderRequestId: string;
  returnPath?: string;
}) {
  const params = new URLSearchParams({ catalogId, requestId: orderRequestId });
  const safeReturnPath =
    returnPath.startsWith("/") && !returnPath.startsWith("//")
      ? returnPath
      : routes.APPROVALS;
  return `${origin}${safeReturnPath}?${params.toString()}`;
}

export function approvalPaymentPayload({
  acknowledgeBudgetWarning,
  additionalRecipients = [],
  note,
  orderNote,
  paymentMethod,
  redirectUrl,
  signatureRequested,
}: {
  acknowledgeBudgetWarning: boolean;
  additionalRecipients?: string[];
  note?: string;
  orderNote?: string;
  paymentMethod: "Card" | "Credit";
  redirectUrl: string;
  signatureRequested?: boolean;
}): ApproveCatalogOrderRequestPayload {
  return {
    acknowledge_budget_warning: acknowledgeBudgetWarning,
    ...(additionalRecipients.length > 0 && {
      additional_recipients: additionalRecipients,
    }),
    confirm_proceed_with_unavailable_items: false,
    debit_wallet_on_approval: false,
    ...(note && { note }),
    ...(orderNote && { order_note: orderNote }),
    payment_method: paymentMethod,
    redirect_url: redirectUrl,
    ...(signatureRequested !== undefined && {
      signature_requested: signatureRequested,
    }),
  };
}

export function approvalPaymentLink(response: unknown) {
  const link = (response as { data?: { payment?: { link?: unknown } } })?.data
    ?.payment?.link;

  return typeof link === "string" ? link : null;
}
