import { companiesApi } from "..";
import type { CreateOfficePayload, ServerOffice } from "@/types/offices";

const createOffice = companiesApi.injectEndpoints({
  endpoints: (build) => ({
    createOffice: build.mutation<
      ServerResponse<ServerOffice>,
      { companyId: string; payload: CreateOfficePayload }
    >({
      query: ({ companyId, payload }) => ({
        url: `/${companyId}/offices`,
        method: "POST",
        data: payload,
      }),
      invalidatesTags: ["Offices", "Entities"],
    }),
  }),
});

export const { useCreateOfficeMutation } = createOffice;
