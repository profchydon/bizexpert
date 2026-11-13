import { companiesApi } from "..";

export const createCatalog = companiesApi.injectEndpoints({
  endpoints: (build) => ({
    createCatalog: build.mutation<
      ServerResponse<any>,
      {
        companyId: string;
        name: string;
        description: string;
        country_id: string;
        departments: string[];
        levels: string[];
      }
    >({
      query: ({ companyId, ...rest }) => ({
        url: `/${companyId}/catalogs`,
        method: "POST",
        data: { ...rest },
      }),
      invalidatesTags: ["Catalogs"],
    }),
  }),
});

export const { useCreateCatalogMutation } = createCatalog;
