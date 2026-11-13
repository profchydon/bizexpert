import { companiesApi } from "..";

export interface CancellationPreviewResponse {
  scope: {
    kind: string;
    suborder_count: number;
    total_suborders: number;
  };
  instant: boolean;
  requires_type_to_confirm: boolean;
  refund_preview: {
    currency: string;
    payment_method: string;
    rail: string;
    amount_paid: number;
    spent_services: number;
    refundable_before_fee: number;
    gateway_fee: number;
    net_refund: number;
    rows: Array<{
      label: string;
      value: number | string;
      deduction?: boolean;
      note?: string;
      kind?: "payment" | "subtotal" | "deduction" | "total";
    }>;
    policy_rules: string[];
    line_items?: Array<{
      id: string;
      type?: string;
      amount?: number;
      spent_services?: number;
      refundable?: number;
    }>;
  };
  items: Array<Record<string, unknown>>;
  order: Record<string, unknown>;
}

interface PreviewParams {
  companyId?: string;
  orderId?: string;
  employeeIds?: string[];
  suborderIds?: string[];
}

export const cancellationPreviewApi = companiesApi.injectEndpoints({
  endpoints: (build) => ({
    getCancellationPreview: build.query<
      ServerResponse<CancellationPreviewResponse>,
      PreviewParams
    >({
      query: ({ companyId, orderId, employeeIds, suborderIds }) => ({
        url: `/${companyId}/orders/${orderId}/cancellation-preview`,
        method: "GET",
        params: {
          ...(employeeIds?.length
            ? { employee_ids: employeeIds.join(",") }
            : {}),
          ...(suborderIds?.length
            ? { suborder_ids: suborderIds.join(",") }
            : {}),
        },
      }),
      providesTags: ["Order"],
    }),
  }),
});

export const {
  useGetCancellationPreviewQuery,
  useLazyGetCancellationPreviewQuery,
} = cancellationPreviewApi;
