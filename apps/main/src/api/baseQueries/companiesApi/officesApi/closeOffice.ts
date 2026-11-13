import { companiesApi } from "..";

const closeOffice = companiesApi.injectEndpoints({
  endpoints: (build) => ({
    closeOffice: build.mutation<
      ServerResponse<unknown>,
      { companyId: string; officeId: string }
    >({
      query: ({ companyId, officeId }) => ({
        url: `/${companyId}/offices/${officeId}/close`,
        method: "POST",
        data: {},
      }),
      invalidatesTags: (result, error, { officeId }) => [
        "Offices",
        "Entities",
        { type: "Office", id: officeId },
      ],
    }),
  }),
});

export const { useCloseOfficeMutation } = closeOffice;
