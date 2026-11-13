import { ILevel } from "@/types/departments";
import { companiesApi } from "..";

const getLevels = companiesApi.injectEndpoints({
  endpoints: (query) => ({
    getLevels: query.query<
      ServerPaginatedResponse<ILevel[]>,
      { companyId: string; page?: number }
    >({
      query: ({ companyId, page }) => ({
        url: `/${companyId}/levels`,
        params: { page },
      }),
      providesTags: ["Levels"],
    }),
  }),
});

export const { useGetLevelsQuery } = getLevels;
