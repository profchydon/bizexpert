import { companiesApi } from "..";

interface UpdateOrderSignatureRequest {
  companyId: string;
  orderId: string;
  signatureRequired: boolean;
  subOrderIds?: string[]; // Optional: specific sub-orders to update
}

interface RemoveOrderSignatureRequest {
  companyId: string;
  orderId: string;
}

interface AddOrderSignatureRequest {
  companyId: string;
  orderId: string;
  employeeId: string;
}

interface RemoveSubOrderSignatureRequest {
  companyId: string;
  orderId: string;
  employee_ids: string[];
}

interface AddSubOrderSignatureRequest {
  companyId: string;
  orderId: string;
  employee_ids: string[];
}

interface UpdateOrderSignatureResponse {
  success: boolean;
  message: string;
  data: {
    updated_count: number;
    failed_count: number;
    failed_sub_orders?: Array<{
      id: string;
      employee_name: string;
      status: string;
      reason: string;
    }>;
  };
}

export const updateOrderSignature = companiesApi.injectEndpoints({
  endpoints: (build) => ({
    updateOrderSignature: build.mutation<
      UpdateOrderSignatureResponse,
      UpdateOrderSignatureRequest
    >({
      query: ({ companyId, orderId, ...body }) => ({
        url: `/${companyId}/orders/${orderId}/signature`,
        method: "PATCH",
        data: body,
      }),
      invalidatesTags: ["Order"],
    }),
    removeOrderSignature: build.mutation<
      ServerResponse<any>,
      RemoveOrderSignatureRequest
    >({
      query: ({ companyId, orderId }) => ({
        url: `/${companyId}/orders/${orderId}/signature/remove`,
        method: "PUT",
      }),
      invalidatesTags: ["Order"],
    }),
    addOrderSignature: build.mutation<
      ServerResponse<any>,
      AddOrderSignatureRequest
    >({
      query: ({ companyId, orderId }) => ({
        url: `/${companyId}/orders/${orderId}/signature/add`,
        method: "PUT",
      }),
      invalidatesTags: ["Order"],
    }),
    removeSubOrderSignature: build.mutation<
      ServerResponse<any>,
      RemoveSubOrderSignatureRequest
    >({
      query: ({ companyId, orderId, employee_ids }) => ({
        url: `/${companyId}/orders/${orderId}/sub-orders/signature/remove`,
        method: "PUT",
        data: { employee_ids },
      }),
      invalidatesTags: ["Order"],
    }),
    addSubOrderSignature: build.mutation<
      ServerResponse<any>,
      AddSubOrderSignatureRequest
    >({
      query: ({ companyId, orderId, employee_ids }) => ({
        url: `/${companyId}/orders/${orderId}/sub-orders/signature/add`,
        method: "PUT",
        data: { employee_ids },
      }),
      invalidatesTags: ["Order"],
    }),
  }),
});

export const {
  useUpdateOrderSignatureMutation,
  useRemoveOrderSignatureMutation,
  useAddOrderSignatureMutation,
  useRemoveSubOrderSignatureMutation,
  useAddSubOrderSignatureMutation,
} = updateOrderSignature;
