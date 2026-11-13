import { orderTrackingApi } from ".";

export interface TrackingEvent {
  event: string;
  note?: string;
  date: string;
  status: string;
}

export interface OrderItem {
  name: string;
  specs: string;
  quantity: number;
}

export interface EstimatedDelivery {
  start_date: string;
  end_date: string;
}

export interface Destination {
  country: string;
  address: string;
}

export interface OrderTrackingData {
  order_id: string;
  order_type: string;
  order_type_display: string;
  status: string;
  status_display: string;
  all_statuses: Array<{ value: string; display: string }>;
  last_updated: string;
  estimated_delivery?: EstimatedDelivery;
  destination: Destination;
  current_location?: string;
  order_date: string;
  tracking_link?: string;
  external_tracking_link?: string | null;
  courier_name?: string | null;
  tracking_events: TrackingEvent[];
  items: OrderItem[];
  total_items: number;
}

export interface TrackOrderResponse {
  success: boolean;
  message: string;
  data: OrderTrackingData;
}

interface TrackOrderPayload {
  order_number: string;
}

export const getOrderTracking = orderTrackingApi.injectEndpoints({
  endpoints: (build) => ({
    getOrderTracking: build.mutation<TrackOrderResponse, TrackOrderPayload>({
      query: (payload) => ({
        url: `/track`,
        method: "POST",
        data: payload,
        params: { excludePathFromEncryption: true },
      }),
      invalidatesTags: ["Orders"],
    }),
  }),
});

export const { useGetOrderTrackingMutation } = getOrderTracking;
