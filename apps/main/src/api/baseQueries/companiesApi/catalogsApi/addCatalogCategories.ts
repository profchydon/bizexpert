import { ICatalog } from "@/types/catalog";
import { companiesApi } from "..";

export const addCatalogCategories = companiesApi.injectEndpoints({
  endpoints: (build) => ({
    addCatalogCategories: build.mutation<
      ServerResponse<ICatalog>,
      {
        categories: {
          id: string;
          quantity: number;
        }[];
        companyId: string;
        catalogId: string;
      }
    >({
      query: ({ companyId, catalogId, categories }) => ({
        url: `/${companyId}/catalogs/${catalogId}/category`,
        method: "POST",
        data: { catalog_id: catalogId, categories },
      }),
      invalidatesTags: ["Catalogs"],
    }),
  }),
});

export const { useAddCatalogCategoriesMutation } = addCatalogCategories;
