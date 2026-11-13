import { companiesApi } from "..";

export const editCatalog = companiesApi.injectEndpoints({
  endpoints: (build) => ({
    editCatalog: build.mutation<
      ServerResponse<any>,
      {
        catalogId: string;
        companyId: string;
        name: string;
        description: string;
        country_id: string;
        departments: string[];
        levels: string[];
      }
    >({
      query: ({ companyId, catalogId, ...rest }) => ({
        url: `/${companyId}/catalogs/${catalogId}`,
        method: "PUT",
        data: { ...rest },
      }),
      invalidatesTags: ["Catalogs"],
    }),
  }),
});

export const { useEditCatalogMutation } = editCatalog;
