import { companiesApi } from "..";
import { ICatalog } from "@/types/catalog";

const getCatalog = companiesApi.injectEndpoints({
  endpoints: (query) => ({
    getCatalog: query.query<
      ServerResponse<ICatalog>,
      { companyId: string; catalogId: string }
    >({
      query: ({ companyId, catalogId }) => ({
        url: `/${companyId}/catalogs/${catalogId}`,
      }),
      providesTags: ["Catalogs"],
    }),
  }),
});

export const { useGetCatalogQuery } = getCatalog;
