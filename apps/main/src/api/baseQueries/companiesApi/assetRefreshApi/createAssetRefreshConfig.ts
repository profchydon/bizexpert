import { CreateRefreshDeviceRequest } from "@/types/assetRefresh";
import { companiesApi } from "..";

export const createAssetRefreshConfig = companiesApi.injectEndpoints({
  endpoints: (build) => ({
    createAssetRefreshConfig: build.mutation<
      ServerResponse<any>,
      CreateRefreshDeviceRequest
    >({
      query: ({ companyId, payload }) => ({
        url: `/${companyId}/asset-refresh/list`,
        method: "POST",
        data: payload,
      }),
      invalidatesTags: ["AseetRefresh"],
    }),
  }),
});

export const { useCreateAssetRefreshConfigMutation } = createAssetRefreshConfig;
