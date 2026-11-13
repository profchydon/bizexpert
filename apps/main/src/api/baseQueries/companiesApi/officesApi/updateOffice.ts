import { companiesApi } from "..";
import type { ServerOfficeDetail, UpdateOfficePayload } from "@/types/offices";

const updateOffice = companiesApi.injectEndpoints({
  endpoints: (build) => ({
    updateOffice: build.mutation<
      ServerResponse<ServerOfficeDetail>,
      { companyId: string; officeId: string; payload: UpdateOfficePayload }
    >({
      query: ({ companyId, officeId, payload }) => ({
        url: `/${companyId}/offices/${officeId}`,
        method: "PUT",
        data: payload,
      }),
      invalidatesTags: (result, error, { officeId }) => [
        "Offices",
        { type: "Office", id: officeId },
      ],
    }),
  }),
});

export const { useUpdateOfficeMutation } = updateOffice;
