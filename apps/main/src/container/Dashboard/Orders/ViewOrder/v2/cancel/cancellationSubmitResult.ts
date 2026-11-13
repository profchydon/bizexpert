import type { CancellationPreviewResponse } from "@/api/baseQueries/companiesApi/ordersApi/getCancellationPreview";
import type { CancelOrderResponse } from "@/api/baseQueries/companiesApi/ordersApi/cancelOrder";

export function cancellationSubmitResult(response: {
  data?: CancelOrderResponse;
}): {
  ok: true;
  instant?: boolean;
  refund_preview?: CancellationPreviewResponse["refund_preview"];
} {
  return {
    ok: true,
    instant: response.data?.instant === true,
    refund_preview: response.data?.refund_preview,
  };
}
