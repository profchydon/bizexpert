import { IDashboard } from "@/types/dashboard";
import { companiesApi } from "..";
import { ISubscription } from "@/types/subscriptions";

export const viewSubscription = companiesApi.injectEndpoints({
  endpoints: (query) => ({
    viewSubscription: query.query<
      ServerResponse<ISubscription>,
      { companyId?: string }
    >({
      query: ({ companyId }) => ({
        url: `/${companyId}/subscriptions/current`,
      }),
      providesTags: ["Subscription"],
    }),
  }),
});

export const { useViewSubscriptionQuery } = viewSubscription;
