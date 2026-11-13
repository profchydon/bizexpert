import { companiesApi } from "..";

export type KitCategoryLookupItem = {
  kit_id: string;
  kit_name?: string | null;
  categories?: { id: string; name?: string | null }[];
};

const getKitCategories = companiesApi.injectEndpoints({
  endpoints: (build) => ({
    getKitCategories: build.query<
      ServerResponse<KitCategoryLookupItem[]>,
      { companyId: string; kitIds: string[] }
    >({
      query: ({ companyId, kitIds }) => ({
        url: `/${companyId}/kits/categories`,
        method: "POST",
        data: { kit_ids: kitIds },
      }),
    }),
  }),
});

export const { useGetKitCategoriesQuery } = getKitCategories;
