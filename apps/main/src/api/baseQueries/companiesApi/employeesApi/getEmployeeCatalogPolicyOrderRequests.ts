import type {
  CatalogOrderRequestApi,
  CatalogOrderRequestListPayload,
} from "@/types/catalogPolicyOrderRequest";
import { companiesApi } from "..";

type Args = {
  catalogId: string;
  companyId: string;
  params?: {
    page?: number;
    per_page?: number;
    status?: string | null;
  };
};

const getEmployeeCatalogPolicyOrderRequests = companiesApi.injectEndpoints({
  endpoints: (build) => ({
    getEmployeeCatalogPolicyOrderRequests: build.query<
      ServerResponse<CatalogOrderRequestListPayload | CatalogOrderRequestApi[]>,
      Args
    >({
      query: ({ catalogId, companyId, params }) => ({
        url: `/${companyId}/employees/catalog-policies/${catalogId}/order-requests`,
        params,
      }),
      providesTags: (_result, _error, { catalogId }) => [
        { type: "CatalogOrderRequests", id: `EMPLOYEE:${catalogId}` },
        "CatalogOrderRequests",
      ],
    }),
  }),
});

export const { useGetEmployeeCatalogPolicyOrderRequestsQuery } =
  getEmployeeCatalogPolicyOrderRequests;
