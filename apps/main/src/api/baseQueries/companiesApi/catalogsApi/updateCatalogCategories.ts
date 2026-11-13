import { ICatalog } from "@/types/catalog";
import { companiesApi } from "..";

export const updateCatalogCategories = companiesApi.injectEndpoints({
  endpoints: (build) => ({
    updateCatalogCategories: build.mutation<
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
        method: "PUT",
        data: { categories },
      }),
      invalidatesTags: ["Catalogs"],
    }),
  }),
});

export const { useUpdateCatalogCategoriesMutation } = updateCatalogCategories;
