import { companiesApi } from "..";
import type {
  SubscriptionBillingInvoice,
  SubscriptionBillingInvoiceList,
  SubscriptionContract,
  SubscriptionEntitlementSnapshot,
  SubscriptionPlanChangeResult,
  SubscriptionPlanChangeVerifyResult,
} from "./subscriptionContract";

const subscriptionContractApi = companiesApi.injectEndpoints({
  endpoints: (build) => ({
    getSubscriptionContract: build.query<
      ServerResponse<SubscriptionContract>,
      { companyId?: string }
    >({
      query: ({ companyId }) => ({
        url: `/${companyId}/subscription`,
      }),
      providesTags: ["Subscription"],
    }),
    getSubscriptionEntitlements: build.query<
      ServerResponse<SubscriptionEntitlementSnapshot>,
      { companyId?: string }
    >({
      query: ({ companyId }) => ({
        url: `/${companyId}/entitlements`,
      }),
      providesTags: ["Subscription"],
    }),
    getSubscriptionInvoices: build.query<
      ServerResponse<SubscriptionBillingInvoiceList>,
      {
        companyId?: string;
        page?: number;
        search?: string;
        status?: string;
        perPage?: number;
        sortBy?: string;
        sortOrder?: "asc" | "desc";
      }
    >({
      query: ({
        companyId,
        page,
        search,
        status,
        perPage,
        sortBy,
        sortOrder,
      }) => ({
        url: `/${companyId}/subscription/invoices`,
        params: {
          page: page ?? 1,
          per_page: perPage ?? 10,
          search: search || undefined,
          status: status || undefined,
          sort_by: sortBy || "billed_on",
          sort_order: sortOrder || "desc",
        },
      }),
      providesTags: ["Subscription"],
    }),
    getSubscriptionInvoice: build.query<
      ServerResponse<SubscriptionBillingInvoice>,
      { companyId?: string; invoiceId: string }
    >({
      query: ({ companyId, invoiceId }) => ({
        url: `/${companyId}/subscription/invoices/${invoiceId}`,
      }),
      providesTags: ["Subscription"],
    }),
    changeSubscriptionPlan: build.mutation<
      ServerResponse<SubscriptionPlanChangeResult>,
      { companyId: string; planId: string; redirectUrl?: string }
    >({
      query: ({ companyId, planId, redirectUrl }) => {
        const data = {
          plan_id: planId,
          ...(redirectUrl ? { redirect_url: redirectUrl } : {}),
        };
        console.log("change-plan payload", data);
        return {
          url: `/${companyId}/subscription/change-plan`,
          method: "POST",
          data,
        };
      },
      invalidatesTags: ["Subscription"],
    }),
    cancelScheduledSubscriptionChange: build.mutation<
      ServerResponse<SubscriptionContract>,
      { companyId: string }
    >({
      query: ({ companyId }) => ({
        url: `/${companyId}/subscription/scheduled-change`,
        method: "DELETE",
      }),
      invalidatesTags: ["Subscription"],
    }),
    retrySubscriptionPlanPayment: build.mutation<
      ServerResponse<{ link: string | null; tx_ref: string | null }>,
      { companyId: string; txRef: string; redirectUrl: string }
    >({
      query: ({ companyId, txRef, redirectUrl }) => ({
        url: `/${companyId}/subscription/transactions/${txRef}/retry-payment`,
        method: "POST",
        data: { redirect_url: redirectUrl },
      }),
    }),
    verifySubscriptionPlanChange: build.query<
      ServerResponse<SubscriptionPlanChangeVerifyResult>,
      { companyId?: string; txRef: string }
    >({
      query: ({ companyId, txRef }) => ({
        url: `/${companyId}/subscription/transactions/${txRef}/verify`,
      }),
      providesTags: ["Subscription"],
    }),
  }),
});

export const {
  useGetSubscriptionContractQuery,
  useGetSubscriptionEntitlementsQuery,
  useGetSubscriptionInvoicesQuery,
  useGetSubscriptionInvoiceQuery,
  useChangeSubscriptionPlanMutation,
  useCancelScheduledSubscriptionChangeMutation,
  useRetrySubscriptionPlanPaymentMutation,
  useVerifySubscriptionPlanChangeQuery,
} = subscriptionContractApi;
