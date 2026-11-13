export const cancellationSuccessCopy = (
  instant = false,
  refundStatus?: string | null,
) => {
  if (instant && refundStatus === "on_hold") {
    return {
      title: "Cancellation confirmed",
      body: "Your order is cancelled. The refund is on hold until the shared payment settles or the other order on this payment is cancelled.",
    };
  }

  if (instant) {
    return {
      title: "Cancellation confirmed",
      body: "Your order has been cancelled and any eligible refund has been calculated.",
    };
  }

  return {
    title: "Successfully requested for cancellation",
    body: "Your cancellation request has been submitted to an admin. The order status will be updated once reviewed.",
  };
};
