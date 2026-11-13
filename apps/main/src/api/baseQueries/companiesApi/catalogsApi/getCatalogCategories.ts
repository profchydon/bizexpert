import { companiesApi } from "..";
import { ICatalog } from "@/types/catalog";

const getCatalogCategories = companiesApi.injectEndpoints({
  endpoints: (query) => ({
    getCatalogCategories: query.query<
      ServerPaginatedResponse<ICatalog[]>,
      { companyId: string; page?: number; catalogId: string }
    >({
      query: ({ companyId, page, catalogId }) => ({
        url: `/${companyId}/catalogs/${catalogId}/category`,
        params: { page },
      }),
      providesTags: ["Catalogs"],
    }),
  }),
});

export const { useGetCatalogCategoriesQuery } = getCatalogCategories;
