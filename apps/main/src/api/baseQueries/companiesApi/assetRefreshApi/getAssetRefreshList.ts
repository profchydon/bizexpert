import { companiesApi } from "..";

export const getAssetRefreshList = companiesApi.injectEndpoints({
  endpoints: (build) => ({
    getAssetRefreshList: build.query<
      ServerResponse<any>,
      { companyId: string }
    >({
      query: ({ companyId }) => ({
        url: `/${companyId}/asset-refresh/list`,
      }),
      providesTags: ["AseetRefresh"],
    }),
  }),
});

export const { useGetAssetRefreshListQuery } = getAssetRefreshList;
