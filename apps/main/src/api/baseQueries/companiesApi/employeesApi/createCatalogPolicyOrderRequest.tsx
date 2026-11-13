import type { EmployeeCatalogPolicyOrderRequestPayload } from "@/types/employees";
import { companiesApi } from "..";

const createCatalogPolicyOrderRequest = companiesApi.injectEndpoints({
  endpoints: (query) => ({
    createCatalogPolicyOrderRequest: query.mutation<
      ServerResponse,
      {
        companyId: string;
        catalogId: string;
        payload: EmployeeCatalogPolicyOrderRequestPayload;
      }
    >({
      query: ({ companyId, catalogId, payload }) => ({
        url: `/${companyId}/employees/catalog-policies/${catalogId}/order-requests`,
        method: "POST",
        data: payload,
      }),
      invalidatesTags: ["CatalogOrderRequests"],
    }),
  }),
});

export const { useCreateCatalogPolicyOrderRequestMutation } =
  createCatalogPolicyOrderRequest;
