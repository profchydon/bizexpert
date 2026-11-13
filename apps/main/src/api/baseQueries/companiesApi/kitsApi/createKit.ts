import { companiesApi } from "..";
import type { ICreateKitRequest, IKit } from "@/types/kit";

export const createKit = companiesApi.injectEndpoints({
  endpoints: (build) => ({
    createKit: build.mutation<
      ServerResponse<IKit>,
      { companyId: string; payload: ICreateKitRequest }
    >({
      query: ({ companyId, payload }) => ({
        url: `/${companyId}/kits`,
        method: "POST",
        data: payload,
      }),
      invalidatesTags: ["Kits"],
    }),
  }),
});

export const { useCreateKitMutation } = createKit;
