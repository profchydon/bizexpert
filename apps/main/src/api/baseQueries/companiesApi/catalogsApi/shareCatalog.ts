import { companiesApi } from "..";
import { ICatalog } from "@/types/catalog";

const shareCatalog = companiesApi.injectEndpoints({
  endpoints: (query) => ({
    shareCatalog: query.mutation<
      ServerResponse<any>,
      {
        companyId: string;
        catalogId: string;
        emails: string[];
      }
    >({
      query: ({ companyId, catalogId, emails }) => ({
        url: `/${companyId}/catalogs/${catalogId}/share`,
        method: "POST",
        data: { emails },
      }),
      invalidatesTags: ["Catalogs"],
    }),
  }),
});

export const { useShareCatalogMutation } = shareCatalog;
