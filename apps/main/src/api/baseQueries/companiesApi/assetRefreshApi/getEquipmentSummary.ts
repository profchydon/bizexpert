import { companiesApi } from "..";

export const getEquipmentSummary = companiesApi.injectEndpoints({
  endpoints: (build) => ({
    getEquipmentSummary: build.query<
      ServerResponse<any>,
      { companyId: string }
    >({
      query: ({ companyId }) => ({
        url: `/${companyId}/asset-refresh/equipments`,
      }),
      providesTags: ["AseetRefresh"],
    }),
  }),
});

export const { useGetEquipmentSummaryQuery } = getEquipmentSummary;
