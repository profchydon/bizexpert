import type { StorageActionFeePaymentMethod } from "@/api/baseQueries/feesApi/getStorageActionFees";
import type { StorageActionsInitiateReq } from "@/api/baseQueries/companiesApi/transactionsApi/storageActionsPayment";
import {
  toStorageActionInitiateOrders,
  type StorageActionFeeOrder,
} from "@/api/baseQueries/feesApi/storageActionFeeOrders";

export function buildStorageActionsInitiatePayload({
  additionalRecipients,
  countryId,
  note,
  orders,
  paymentMethod,
  redirectUrl,
  signatureRequested,
}: {
  additionalRecipients?: string[];
  countryId: string;
  note?: string;
  orders: StorageActionFeeOrder[];
  paymentMethod: StorageActionFeePaymentMethod;
  redirectUrl: string;
  signatureRequested?: boolean;
}): StorageActionsInitiateReq {
  const orderNote = note?.trim();
  const recipients = additionalRecipients?.filter((email) => email.trim());

  return {
    payment_method: paymentMethod,
    country_id: countryId,
    redirect_url: redirectUrl,
    ...(orderNote ? { order_note: orderNote } : {}),
    ...(recipients && recipients.length > 0
      ? { additional_recipients: recipients }
      : {}),
    orders: toStorageActionInitiateOrders(orders, signatureRequested),
  };
}
