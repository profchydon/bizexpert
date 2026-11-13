import { companiesApi } from "..";

export interface DeliveryRecipient {
  full_name?: string;
  email?: string;
  phone?: string;
  employment_type?: string;
}

export interface DeliveryAddressDetails {
  country?: string;
  country_code?: string;
  address?: string;
  nearest_landmark?: string;
  estimated_fulfillment_start_date?: string;
}

export interface DeliveryItem {
  id?: string;
  title?: string;
  description?: string;
  image_url?: string;
  quantity?: number;
}

export interface OrderDetailsData {
  id: string;
  order_number: string;
  type?: string;
  status?: string;
  signature_requested?: boolean;
  note?: string;
  delivery_address?: DeliveryAddressDetails;
  recipient?: DeliveryRecipient;
  delivery_items?: DeliveryItem[];
  sub_orders?: unknown[];
}

interface GetOrderDetailsRequest {
  companyId: string;
  orderId: string;
  instanceType?: string;
}

interface UpdateOrderDetailsRequest {
  companyId: string;
  orderId: string;
  payload: {
    phone?: string;
    country?: string;
    address?: string;
    nearest_landmark?: string;
    note?: string;
    signature_requested?: boolean;
    terms_accepted?: boolean;
  };
}

interface ConfirmOrderDetailsRequest {
  companyId: string;
  orderId: string;
  payload: {
    confirmed: boolean;
  };
}

const getOrderDetailsApi = companiesApi.injectEndpoints({
  endpoints: (build) => ({
    getOrderDetails: build.query<
      ServerResponse<OrderDetailsData>,
      GetOrderDetailsRequest
    >({
      query: ({ companyId, orderId, instanceType }) => ({
        url: `/${companyId}/orders/${orderId}/details`,
        params: instanceType ? { instance_type: instanceType } : undefined,
      }),
      providesTags: ["Order"],
    }),
    updateOrderDetails: build.mutation<
      ServerResponse<OrderDetailsData>,
      UpdateOrderDetailsRequest
    >({
      query: ({ companyId, orderId, payload }) => ({
        url: `/${companyId}/orders/${orderId}/details`,
        method: "PATCH",
        data: payload,
      }),
      invalidatesTags: ["Order"],
    }),
    confirmOrderDetails: build.mutation<
      ServerResponse<unknown>,
      ConfirmOrderDetailsRequest
    >({
      query: ({ companyId, orderId, payload }) => ({
        url: `/${companyId}/orders/${orderId}/details/confirm`,
        method: "POST",
        data: payload,
      }),
      invalidatesTags: ["Order"],
    }),
  }),
});

export const {
  useGetOrderDetailsQuery,
  useUpdateOrderDetailsMutation,
  useConfirmOrderDetailsMutation,
} = getOrderDetailsApi;
