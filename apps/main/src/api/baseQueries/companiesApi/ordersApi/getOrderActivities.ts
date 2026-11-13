import { companiesApi } from "..";

interface GetOrderActivitiesRequest {
  companyId?: string;
  orderId?: string;
  params?: {
    per_page?: number;
    page?: number;
  };
}

export interface OrderActivity {
  id: string;
  event: string;
  action?: string;
  entity?: string;
  entity_type?: string;
  description: string;
  status: string;
  timestamp: string;
  formatted_timestamp?: string;
  is_read: boolean;
  icon?: {
    type?: string | null;
    value?: string | null;
  } | null;
  title?: {
    text?: string | null;
    link?: string | null;
    is_clickable?: boolean;
  } | null;
  subtitle?: {
    prefix?: string | null;
    highlight?: string | null;
    highlight_link?: string | null;
  } | null;
  description_display?: {
    prefix?: string | null;
    text?: string | null;
    link_text?: string | null;
    link?: string | null;
  } | null;
  badge?: {
    text?: string | null;
    type?: string | null;
  } | null;
  comment?: string | null;
  document?: {
    name?: string | null;
    size?: string | null;
    extension?: string | null;
    url?: string | null;
  } | null;
  actor?: {
    id?: string;
    name?: string | null;
    initials?: string | null;
    avatar?: string | null;
  } | null;
  employee?: {
    id?: string;
    name?: string | null;
    link?: string | null;
  } | null;
  source?: {
    id?: string;
    type?: string | null;
    name?: string | null;
    image?: string | null;
  } | null;
}

interface GetOrderActivitiesResponse {
  data: {
    activities: OrderActivity[];
    read_count: number;
    unread_count: number;
    total_read_count: number;
    total_unread_count: number;
  };
  total: number;
  per_page: number;
  current_page: number;
  last_page: number;
}

const getOrderActivitiesApi = companiesApi.injectEndpoints({
  endpoints: (query) => ({
    getOrderActivities: query.query<
      ServerResponse<GetOrderActivitiesResponse>,
      GetOrderActivitiesRequest
    >({
      query: ({ companyId, orderId, params }) => ({
        url: `/${companyId}/orders/${orderId}/activities`,
        params,
      }),
      providesTags: ["Order"],
    }),
  }),
});

export const { useGetOrderActivitiesQuery, useLazyGetOrderActivitiesQuery } =
  getOrderActivitiesApi;
