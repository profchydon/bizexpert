import { companiesApi } from "..";
import { ICatalog } from "@/types/catalog";

const getCatalogs = companiesApi.injectEndpoints({
  endpoints: (query) => ({
    getCatalogs: query.query<
      ServerPaginatedResponse<ICatalog[]>,
      { companyId: string; page?: number; type?: "device" | "budget" }
    >({
      query: ({ companyId, page, type }) => ({
        url: `/${companyId}/catalogs`,
        params: { page, type },
      }),
      providesTags: ["Catalogs"],
    }),
  }),
});

export const { useGetCatalogsQuery } = getCatalogs;
