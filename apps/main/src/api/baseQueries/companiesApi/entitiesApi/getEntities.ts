import { companiesApi } from "..";
import type { EntitiesListParams, EntitiesListPayload } from "./types";

const getEntities = companiesApi.injectEndpoints({
  endpoints: (query) => ({
    getEntities: query.query<
      ServerResponse<EntitiesListPayload>,
      {
        companyId: string;
        params?: EntitiesListParams;
      }
    >({
      query: ({ companyId, params }) => ({
        url: `/${companyId}/entities`,
        params,
      }),
      providesTags: ["Entities"],
    }),
  }),
});

export const { useGetEntitiesQuery, useLazyGetEntitiesQuery } = getEntities;
