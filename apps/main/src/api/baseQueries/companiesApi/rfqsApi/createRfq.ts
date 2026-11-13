import { companiesApi } from "..";

type CreateRfqDevice = {
  name: string;
  description: string;
  quantity: number;
  budget_per_unit: number;
  asset_type: string;
  properties: Record<string, string>;
};

type CreateRfqPayload = {
  country_id: string;
  currency_code: string;
  devices: CreateRfqDevice[];
};

type CreateRfqRequest = {
  companyId: string;
  payload: CreateRfqPayload;
};

export const createRfq = companiesApi.injectEndpoints({
  endpoints: (build) => ({
    createRfq: build.mutation<ServerResponse<any>, CreateRfqRequest>({
      query: ({ companyId, payload }) => ({
        url: `/${companyId}/rfqs`,
        method: "POST",
        data: payload,
      }),
      invalidatesTags: ["Order"],
    }),
  }),
});

export const { useCreateRfqMutation } = createRfq;
