import { companiesApi } from "..";

import type { ApproveOrderRequestArgs } from "./types";

const previewApproveCatalogPolicyOrderRequest = companiesApi.injectEndpoints({
  endpoints: (build) => ({
    previewApproveCatalogPolicyOrderRequest: build.query<
      ServerResponse<unknown>,
      ApproveOrderRequestArgs
    >({
      query: ({ companyId, catalogId, orderRequestId, payload }) => ({
        url: `/${companyId}/catalog-policies/${catalogId}/order-requests/${orderRequestId}/approve/preview`,
        method: "POST",
        data: payload ?? {},
      }),
    }),
  }),
});

export const { usePreviewApproveCatalogPolicyOrderRequestQuery } =
  previewApproveCatalogPolicyOrderRequest;
